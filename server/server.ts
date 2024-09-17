/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import "dotenv/config";
import express from "express";
import pg from "pg";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { authMiddleware, ClientError, errorMiddleware } from "./lib/index.js";

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type NeededBy = {
  userId: number;
  shoppingItemId: number;
};

type Shopper = {
  shopperId: number;
  userId: number;
};

type Auth = {
  username: string;
  password: string;
};

type ShoppingItems = {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
  groupId: number;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error("TOKEN_SECRET not found in .env");

const app = express();

app.use(express.json());

app.post("/api/auth/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, "username and password are required fields");
    }

    // Check if the username already exists
    const checkUserSql = `
        select "username"
            from "users"
            where "username" = $1
    `;
    const prams = [username];
    const checkUserResult = await db.query(checkUserSql, prams);
    if (checkUserResult.rows.length > 0) {
      throw new ClientError(409, "Username already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const sql = `
      insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username";
    `;

    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/sign-in", async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, "invalid login");
    }

    const sql = `
      select *
        from "users"
        where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    if (!result) throw new ClientError(401, `User ${username} was not found`);

    const { userId, name, hashedPassword } = result.rows[0];

    if (await argon2.verify(hashedPassword, password)) {
      const payload = {
        userId,
        name,
        username,
      };
      const token = jwt.sign(payload, hashKey);
      res.status(200).json({ user: payload, token });
    } else {
      throw new ClientError(401, "Invalid login");
    }
  } catch (error) {
    next(error);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const sql = `
    select *
        from "users"
    `;
    const result = await db.query<User>(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/shoppingItems", async (req, res, next) => {
  try {
    const sql = `
          select *
            from "shoppingItems"
            join "users" using ("userId")
            order by "shoppingItemId" desc;
      `;
    const result = await db.query<ShoppingItems[]>(sql);
    if (!result) throw new ClientError(401, "Failed to create shopping item.");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/shoppingItems", authMiddleware, async (req, res, next) => {
  try {
    const { title, status, userId } = req.body;
    if (!title || !status || !userId) {
      throw new ClientError(401, "title, status, userId are required.");
    }
    const sql = `
        insert into "shoppingItems" ("title", "status", "userId")
        values ($1, $2, $3)
        returning *;
    `;
    const params = [title, status, userId];
    const result = await db.query<ShoppingItems>(sql, params);
    if (!result) throw new ClientError(401, "Failed to create shopping item.");
    const [item] = result.rows;
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

app.get("/api/neededBy", async (req, res, next) => {
  try {
    const sql = `
    select *
        from "neededBy"
        join "users" using ("userId")
    `;
    const result = await db.query<NeededBy[]>(sql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/neededBy/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!Number.isInteger(+userId)) {
      throw new ClientError(400, `userId ${userId} must be a number.`);
    }
    const { shoppingItemId } = req.body;
    const addUserSql = `
        insert into "neededBy" ("userId", "shoppingItemId")
        values ($1, $2)
        returning *;
    `;
    const params = [userId, shoppingItemId];
    await db.query(addUserSql, params);
    const getUsersSql = `
    select *
        from "neededBy"
        join "users" using ("userId")
    `;
    const result = await db.query<User[]>(getUsersSql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/neededBy/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!Number.isInteger(+userId)) {
      throw new ClientError(400, `userId ${userId} must be a number.`);
    }
    const { shoppingItemId } = req.body;
    const removeUserSql = `
        delete from "neededBy"
            where "userId" = $1
            and "shoppingItemId" = $2;
      `;
    const params = [userId, shoppingItemId];
    await db.query(removeUserSql, params);
    const getUsersSql = `
      select *
          from "neededBy"
          join "users" using ("userId")
      `;
    const result = await db.query<User[]>(getUsersSql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/shopper", async (req, res, next) => {
  try {
    const sql = `
    select *
        from "shopper"
    `;
    const result = await db.query<Shopper>(sql);
    const [shopper] = result.rows;
    res.json(shopper || null);
  } catch (error) {
    next(error);
  }
});

app.post("/api/shopper/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!Number.isInteger(+userId)) throw new ClientError(400, `userId ${userId} must be a number.`);
    const sql = `
    insert into "shopper" ("userId")
        values ($1)
        returning *;
    `;
    const params = [userId];
    await db.query(sql, params);
    const getShopperSql = `
    select *
        from "shopper"
    `;
    const result = await db.query<Shopper>(getShopperSql);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/shopper/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!Number.isInteger(+userId)) throw new ClientError(400, `userId ${userId} must be a number.`);
    const sql = `
    delete from "shopper"
        where "userId" = $1
    `;
    const params = [userId];
    await db.query(sql, params);
    res.status(204).json({ message: "successfully deleted shopper" });
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

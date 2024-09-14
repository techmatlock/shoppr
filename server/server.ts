/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import "dotenv/config";
import express, { application } from "express";
import pg, { Client, DatabaseError } from "pg";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { authMiddleware, ClientError, errorMiddleware } from "./lib/index.js";

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
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
  } catch (err) {
    next(err);
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
  } catch (err) {
    // Catching duplicate key error
    if (err.code === "23505") {
      next(new ClientError(409, "Username already exists"));
    } else {
      next(err);
    }
  }
});

app.get("/api/shoppingItems", async (req, res, next) => {
  try {
    const sql = `
          select *
            from "shoppingItems"
            order by "shoppingItemId" desc;
      `;
    const result = await db.query(sql);
    if (!result) throw new ClientError(401, "Failed to create shopping item.");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post("/api/shoppingItems", authMiddleware, async (req, res, next) => {
  try {
    const { title, status, userId } = req.body as ShoppingItems;
    if (!title || !status || !userId) {
      throw new ClientError(401, "title, status, userId are required.");
    }
    const sql = `
        insert into "shoppingItems" ("title", "status", "userId")
        values ($1, $2, $3)
        returning *;
    `;
    const params = [title, status, userId];
    const result = await db.query(sql, params);
    if (!result) throw new ClientError(401, "Failed to create shopping item.");
    const [item] = result.rows;
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

app.get("/api/neededBy", authMiddleware, async (req, res, next) => {
  try {
    const sql = `
    select *
        from "neededBy"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

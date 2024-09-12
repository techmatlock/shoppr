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
      select "userId",
             "hashedPassword"
        from "users"
        where "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    if (!result) throw new ClientError(401, `User ${username} was not found`);

    const { userId, hashedPassword } = result.rows[0];

    if (await argon2.verify(hashedPassword, password)) {
      const payload = {
        userId,
        username,
      };
      const token = jwt.sign(payload, hashKey);
      res.status(200).json({ user: payload, token });
    } else {
      throw new ClientError(401, "Invalid login");
    }
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

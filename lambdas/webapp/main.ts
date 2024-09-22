import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Pool, QueryResult } from "pg";
import * as bcrypt from "bcryptjs";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false,
  },
});

interface ShoppingItem {
  shoppingItemId: number;
  title: string;
  status: string;
  userId: number;
}

interface Users {
  userId: number;
  name: string;
  username: string;
  hashedPassword: string;
}

interface Message {
  userId: number;
  message: string;
  timestamp: string;
}

interface Shopper {
  userId: number;
}

interface NeededBy {
  userId: number;
  shoppingItemId: number;
}

interface UserCredentials {
  username: string;
  password: string;
}

const allowedHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;

  try {
    switch (`${httpMethod} ${path}`) {
      case "GET /shoppingItems":
        return await getShoppingItems();
      case "PUT /shoppingItems":
        return await removeItem(event);
      case "GET /users":
        return await getUsers();
      case "GET /neededBy":
        return await getNeededBy();
      case "POST /neededBy":
        return await addNeededBy(event);
      case "DELETE /neededBy":
        return await removeNeededBy(event);
      case "GET /shopper":
        return await getShopper();
      case "POST /shopper":
        return await addShopper(event);
      case "DELETE /shopper":
        return await removeShopper(event);
      case "GET /messages":
        return await getMessages();
      case "POST /messages":
        return await addMessage(event);
      case "POST /sign-up":
        return await signUp(event);
      case "POST /sign-in":
        return await signIn(event);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Unsupported HTTP method or path" }),
        };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

async function signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }
    const parsedBody = JSON.parse(event.body) as UserCredentials;
    const { username, password } = parsedBody;

    const existingUser = await getUserByUsername(client, username);

    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Username already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query('INSERT INTO "users" ("username", "hashedPassword") VALUES ($1, $2)', [username, hashedPassword]);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } finally {
    client.release();
  }
}

async function signIn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const parsedBody = JSON.parse(event.body) as UserCredentials;
    const { username, password } = parsedBody;

    const user = await getUserByUsername(client, username);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sign in successful", username: user.username }),
    };
  } finally {
    client.release();
  }
}

async function getUsers(): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const result: QueryResult<Users> = await client.query('SELECT * FROM "users"');
    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows),
    };
  } finally {
    client.release();
  }
}

async function getShoppingItems(): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const result: QueryResult<ShoppingItem> = await client.query('SELECT * FROM "shoppingItems"');
    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows),
    };
  } finally {
    client.release();
  }
}

async function removeItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const itemIdString = event.queryStringParameters?.shoppingItemId;

    if (!itemIdString) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const itemId = parseInt(itemIdString);

    const result: QueryResult<ShoppingItem> = await client.query('UPDATE "shoppingItems" SET status = $1 WHERE "shoppingItemId" = $2 RETURNING *', ["completed", itemId]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function getNeededBy(): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const result: QueryResult<NeededBy[]> = await client.query('SELECT * FROM "neededBy" JOIN "users" USING ("userId")');
    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows),
    };
  } finally {
    client.release();
  }
}

async function addNeededBy(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const userIdString = event.queryStringParameters?.userId;

    if (!userIdString || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }
    const userId = parseInt(userIdString);
    const shoppingItemId: number = JSON.parse(event.body)?.shoppingItemId;

    await client.query('INSERT INTO "neededBy" ("userId", "shoppingItemId") values ($1, $2)', [userId, shoppingItemId]);

    const result: QueryResult<NeededBy> = await client.query('SELECT * FROM "neededBy" JOIN "users" USING ("userId")');

    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows),
    };
  } finally {
    client.release();
  }
}

async function removeNeededBy(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const userIdString = event.queryStringParameters?.id;

    if (!userIdString || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }
    const userId = parseInt(userIdString);
    const shoppingItemId: number = JSON.parse(event.body)?.shoppingItemId;

    if (!userId || !shoppingItemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const result: QueryResult<NeededBy> = await client.query('DELETE FROM "neededBy" WHERE "userId" = $1 AND "shoppingItemId" = $2', [userId, shoppingItemId]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function getShopper(): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const result: QueryResult<Shopper> = await client.query('SELECT * FROM "shopper"');
    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function addShopper(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const userIdString = event.queryStringParameters?.id;

    if (!userIdString) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const userId = parseInt(userIdString);

    const result: QueryResult<Shopper> = await client.query('INSERT INTO "shopper" ("userId") VALUES ($1) RETURNING *', [userId]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Failed to add shopper." }),
      };
    }

    return {
      statusCode: 201,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function removeShopper(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const userIdString = event.queryStringParameters?.id;

    if (!userIdString) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const userId = parseInt(userIdString);

    const result: QueryResult<Shopper> = await client.query('DELETE FROM "shopper" WHERE "userId" = $1', [userId]);

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Shopper not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function getMessages(): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    const result: QueryResult<Message[]> = await client.query('SELECT * FROM "messages"');
    return {
      statusCode: 200,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows),
    };
  } finally {
    client.release();
  }
}

async function addMessage(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const client = await pool.connect();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const parsedBody = JSON.parse(event.body) as Message;
    const { userId, message, timestamp } = parsedBody;

    const result: QueryResult<Message> = await client.query('INSERT INTO "messages" ("userId", "message", "timestamp") VALUES ($1, $2, $3) RETURNING *', [userId, message, timestamp]);

    return {
      statusCode: 201,
      headers: allowedHeaders,
      body: JSON.stringify(result.rows[0]),
    };
  } finally {
    client.release();
  }
}

async function getUserByUsername(client: any, username: string): Promise<any> {
  const result: QueryResult<Users> = await client.query('SELECT * FROM "users" WHERE "username" = $1', [username]);
  return result.rows[0];
}

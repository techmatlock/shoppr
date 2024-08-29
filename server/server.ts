import "dotenv/config"; // To read CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from "@clerk/clerk-sdk-node";
import express, { Application, Request } from "express";

const port = process.env.PORT || 3000;
const app: Application = express();

declare global {
  interface Express {
    Request: StrictAuthProp;
  }
}

// Use the strict middleware that raises an error when unauthenticated
app.get(
  "/protected-route",
  ClerkExpressRequireAuth({
    // Add options here
    // See the Middleware options section for more details
  }),
  (req: RequireAuthProp<Request>, res) => {
    res.json(req.auth);
  }
);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

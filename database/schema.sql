drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text,
  "hashedPassword" text,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "shoppingItems" (
  "shoppingItemId" serial PRIMARY KEY,
  "title" text,
  "status" text,
  "userId" integer,
  "groupId" integer,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "neededBy" (
  "neededById" serial PRIMARY KEY,
  "userId" integer,
  "shoppingItemId" integer
);

CREATE TABLE "assignees" (
  "assigneesId" serial PRIMARY KEY,
  "userId" integer,
  "shoppingItemsId" integer,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "groups" (
  "groupId" serial PRIMARY KEY,
  "name" text UNIQUE
);

CREATE TABLE "groupMembers" (
  "groupMemberId" serial PRIMARY KEY,
  "groupId" integer,
  "userId" integer
);

ALTER TABLE "shoppingItems" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "shoppingItems" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");

ALTER TABLE "neededBy" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "neededBy" ADD FOREIGN KEY ("shoppingItemId") REFERENCES "shoppingItems" ("shoppingItemId");

ALTER TABLE "assignees" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "assignees" ADD FOREIGN KEY ("shoppingItemsId") REFERENCES "shoppingItems" ("shoppingItemId");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("groupId") REFERENCES "groups" ("groupId");

ALTER TABLE "groupMembers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

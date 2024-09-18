# shoppr

A full stack React project for users who want to group buy groceries in bulk and split the costs to save money.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Preview](#preview)
- [Installation](#installation)
- [Challenges Encountered](#challenges-encountered)

## Technologies Used

- PostgreSQL
- Express
- React
- Node.js
- TypeScript
- AWS

## Features

- Users can register and login
- Users can add shopping items
- Users can remove or add to need item
- Users can elect themselves to be the current shopper

## Preview

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo-name
   ```
3. Install all dependencies with `npm install`.

#### Create the database

If your project will be using a database, create it now.

1. Start PostgreSQL
   ```sh
   sudo service postgresql start
   ```
1. Create database (replace `name-of-database` with a name of your choosing, such as the name of your app)
   ```sh
   createdb name-of-database
   ```
1. In the `server/.env` file, in the `DATABASE_URL` value, replace `changeMe` with the name of your database, from the last step
1. While you are editing `server/.env`, also change the value of `TOKEN_SECRET` to a custom value, without spaces.
1. Make the same changes to `server/.env.example`.

#### Start the development servers

1. In both the `client` and `server` folders, start the development servers using:
   ```sh
   npm run dev
   ```
1. Later, when you wish to stop the development servers, type `Ctrl-C` in the terminal where the servers are running.

#### Set up the database

1. In your browser navigate to the site you used for your database design.
1. Export your database as PostgreSQL, this should generate the SQL code for creating your database tables.
1. Copy the generated SQL code and paste it into `database/schema.sql` below the preexisting sql code in the file. The end result should look something like: _(You will likely have more tables)_

   ```SQL
   set client_min_messages to warning;

   -- DANGER: this is NOT how to do it in the real world.
   -- `drop schema` INSTANTLY ERASES EVERYTHING.
   drop schema "public" cascade;

   create schema "public";

   create table "todos" (
       "todoId"      serial PRIMARY KEY,
       "task"        text not null,
       "isCompleted" boolean not null,
       "createdAt"   timestamptz not null DEFAULT now(),
       "updatedAt"   timestamptz not null DEFAULT now()
   );
   ```

1. In a separate terminal, run `psql -d <databasebaseUrl> -f data.sql schema.sql` to create your tables
1. At this point your database is setup and you are good to start using it. However there is no data in your database, which isn't necessarily a bad thing, but if you want some starting data in your database you need to add insert statements into the `database/data.sql` file. You can add whatever starting data you need/want. Here is an example:
   ```SQL
   insert into "todos" ("task", "isCompleted")
   values
       ('Learn to code', false),
       ('Build projects', false),
       ('Get a job', false);
   ```
1. After any changes to `database/schema.sql` or `database/data.sql` re-run the `psql <databasebaseUrl> -f data.sql -f schema.sql` command to update your database. Use `psql` to verify your changes were successfully applied.

## Challenges Encountered

1. Ran into a bug with my getInitials function in my UserContext. Originally I passed in the user object because I was only concerned with the logged in user and displaying the avatar dropdown menu. But, my shopping list also needed to call this function and pass in the owner name associated with the shopping item. So when I was calling getInitials(), my shopping list kept displaying the wrong owner name since it was using the current logged in user object which was not intended. I changed the parameter to accept a string, being a name instead.
2. Since my shopping list had a button to update the needed by column, but the shopping list used a separate state than the needed by state I had to nest a second state in the JSX and filter the results to match the needed by shopping item id with the shopping item id for each list item. This was challenging because I had two separate POST and DELETE calls to the database and then I needed to update two different states which would cause the shopping list component to re-render.
3. Another problem with the shopping list was I would click add to add myself to the needed by column, but I wasn't checking for an existing row if the user had already clicked on the button to add themselves as item needed. So the icon wasn't changing to a delete icon because the POST call wasn't checking to see if a row already existed. So I added a checkIfNeedExists function to return true or false and then if true, remove the current user from the database.
4. Came across a bug where my shopper state variable was returning undefined even though I could send a GET request with Postman and return a successful response. The issue was in my `server.ts` with the Express route, I needed to destructure the array `const [shopper] = result.rows`. Once I made the change, I was able to get the correct userId from the shopper table.
5. When I implemented sockets for a real-time chat box, I realized that the server connection would display the results in real time but if the user refreshed the page, the chat would get cleared. So I had to persist the messages by modifying my database schema and adding a messages table. After that, in the ChatBox component I created a an async POST request to the database and then on success, fetch new messages from the database.

# shoppr

A full stack React project for users who want to group buy groceries in bulk and split the costs to save money.

## Table of Contents

- [Preview](#preview)
- [Technologies Used](#technologies-used)
- [Live Demo](#live-demo)
- [Features](#features)
- [Installation](#installation)
- [Challenges Encountered](#challenges-encountered)

## Preview

![Recording 2024-09-18 at 16 45 05](https://github.com/user-attachments/assets/00b1de4b-b80c-4192-9be6-73620f8dcac9)

## Technologies Used

- Lambda
- API Gateway
- RDS PostgreSQL
- S3
- React
- TypeScript

## Live Demo

http://shoppr.cloud.s3-website-us-east-1.amazonaws.com/

Username: guest  
Password: password

## Features

- Users can register and login
- Users can add shopping items
- Users can remove or add to need item
- Users can elect themselves to be the current shopper
- Users can mark a shopping item as done

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

#### Start the development servers

1. In both the `client` and `server` folders, start the development servers using:
   ```sh
   npm run dev
   ```
1. Later, when you wish to stop the development servers, type `Ctrl-C` in the terminal where the servers are running.

#### Set up the database

1. In your browser navigate to the site you used for your database design.
2. Export your database as PostgreSQL, this should generate the SQL code for creating your database tables.
3. In a separate terminal, run `psql -d <databasebaseUrl> -f data.sql schema.sql` to create your tables
4. After any changes to `database/schema.sql` or `database/data.sql` re-run the `psql <databasebaseUrl> -f data.sql -f schema.sql` command to update your database. Use `psql` to verify your changes were successfully applied.

## Challenges Encountered

1. I was getting a 401 Unauthorized error from the frontend when trying to fetch routes protected by a Lambda authorizer in API Gateway. Initially, the token I was retrieving from context was not being fetched when the component mounted, so when my routes were called, no token was being sent in the Authorization header. I fixed the issue by calling `readToken` and `readUser` functions to get the credentials in a `useEffect` before making the fetch calls in the component.

2. One of my fetch calls was receiving an empty response since the select query found no data, but this caused an "Unexpected end of JSON input" error. I fixed this by returning a 200 response instead of a 404, as the fetch was expected to receive an empty response.

3. When I first deployed the frontend to S3, I was receiving CORS errors when the fetch calls hit the API Gateway endpoint. I fixed this by adding the correct header in the response from the Lambda handler: `headers: {"Access-Control-Allow-Origin": "*"}`.

4. Some tables in the SQL statements for my Lambda handler weren't enclosed in quotes, so when the user hit the API Gateway endpoint, the SQL query failed because the table name "lowercasedtable" did not exist. I enclosed the tables in quotes, which preserved case sensitivity and prevented the table names from being lowercased during the `npm run build`.

5. I had to change how I was using the filter method in my shopping list. Initially I thought i could access the state array items, but realized I needed to access the array of objects. So I was trying to use filter on an array without objects and ran into frontend application errors. I changed the filter function to access the object with Object.values().

6. My shopping list had a button to update the "needed by" column, but since the shopping list and "needed by" used separate state variables, I had to nest a second state in the JSX and filter the results to match the "needed by" shopping item ID with the shopping item ID for each list item. This was challenging because I had separate POST and DELETE calls to the database, and then I needed to update two different states, causing the shopping list component to re-render.

7. Another problem with the shopping list occurred when I clicked the button to add myself to the "needed by" column, but I wasn't checking if a row already existed when the user had already clicked the button. As a result, the icon wasn't changing to a delete icon because the POST call wasn't checking for an existing row. I added a `checkIfNeedExists` function to return true or false, and if true, remove the current user from the database.

8. I encountered a bug where my `shopper` state variable was returning undefined, even though I could send a GET request with Postman and receive a successful response. The issue was in my `server.ts` with the Express route, where I needed to destructure the array: `const [shopper] = result.rows`. Once I made the change, I was able to retrieve the correct `userId` from the `shopper` table.

9. When I implemented sockets for a real-time chatbox, I realized that the server connection displayed the results in real time, but if the user refreshed the page, the chat would be cleared. To persist the messages, I modified my database schema by adding a `messages` table. After that, in the `ChatBox` component, I created a POST request to the database, and upon success, fetched the new messages from the database.

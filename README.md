# Food Recipes Project

> *Welcome to my Food Recipes Project! This is my first full-stack application built using the MERN stack. Below are the instructions to set up and run the project.*

Getting Started
Prerequisites
Make sure you have the following installed on your machine:

Node.js

npm (Node Package Manager)

Installation
Clone the repository:

bash
Copy code

git clone [your-repo-url]

cd f-recipes
Set up the client side:

bash
Copy code

cd client
npm install
npm run dev
After running this command, you should see:

sql
Copy code

VITE v5.4.2 ready in [time] ms

➜  Local:   http://localhost:5173/

➜  Network: use --host to expose

➜  press h + enter to show help

Set up the server side:

bash
Copy code
cd ../server

npm install
npm start
You should see:

arduino
Copy code

Server running at http://localhost:3001

Successfully connected to MongoDB

Running the Application

After running the above commands, the frontend will be accessible at http://localhost:5173 and the backend will be running on http://localhost:3001.
You can test the API with requests such as /getcategories, which should return the categories fetched from the database.


Support
This is my first full-stack project, and any feedback or support would be greatly appreciated!

# Ethiopian Food Recipes

**Ethiopian Food Recipes** is a web application that allows users to easily post, browse, comment, and interact with a variety of Ethiopian recipes. Users can explore a wide selection of recipes across different categories, submit their own recipes, and engage with others through likes, comments, and ratings.

## Features

### Recipe Browsing
- Browse recipes shared by others.
- Filter recipes by categories such as **Dinner**, **Lunch**, **Desserts**, **Breakfast**, **Drink**, **Snacks**, **Fasting**, **Vegetable**, **Fruits**, and **Dairy & Egg**.
- Browse by the creator or search for recipes by title.
- Filter recipes based on preparation times and ingredients.

### User Account Management
- Users can sign up and create accounts to save their favorite recipes.
- Authenticated users can create, edit, and delete their own recipes.

### Recipe Creation
- Users can create a new recipe by adding the following:
  - **Title**
  - **Description**
  - **Ingredients** (stored in a separate database table)
  - **Instructions** (stored in a separate database table)
  - **Cooking Time**
  - **Category** (e.g., Dinner, Lunch, etc.)
  - **Multiple images**, including a featured image for the thumbnail.

### Interaction
- Users can **like** recipes.
- Users can **bookmark** their favorite recipes.
- Users can **comment** on recipes.
- Users can **rate** recipes.

## Technical Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for secure user authentication

## Technical Requirements

- JWT authentication system to secure user data and access.
- Tailwind CSS for responsive and attractive styling.
- Focus on delivering a clean and user-friendly UI/UX design.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB set up and running.

### Installation

1. **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/your-username/foodrecipes-ethiopia.git
    cd foodrecipes-ethiopia
    ```

2. **Setup Frontend**:
    - Navigate to the client directory:
      ```bash
      cd client
      ```
    - Install the frontend dependencies:
      ```bash
      npm install
      ```
    - Run the frontend development server:
      ```bash
      npm run dev
      ```
    - You should see the following output:
      ```bash
      VITE v5.4.2  ready in 2385 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help
      ```
    - Open your browser and go to `http://localhost:5173/` to view the application.

3. **Setup Backend**:
    - Navigate to the server directory:
      ```bash
      cd server
      ```
    - Install the backend dependencies:
      ```bash
      npm install
      ```
    - Run the backend development server:
      ```bash
      npm start
      ```
    - You should see the following output:
      ```bash
      [nodemon] 3.1.4
      [nodemon] to restart at any time, enter `rs`
      [nodemon] watching path(s): *.*
      [nodemon] watching extensions: js,mjs,cjs,json
      [nodemon] starting `node index.js`
      Server running at http://localhost:3001
      Successfully connected to MongoDB
      ```

4. The backend API will be running at `http://localhost:3001`, and the frontend will be running at `http://localhost:5173`.

### Environment Variables
Make sure to configure the following environment variables for local development:
- **MONGO_URI**: MongoDB connection string (e.g., `mongodb://localhost:27017/foodrecipes`).
- **JWT_SECRET**: A secret key for signing JWT tokens.
  
Example `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/foodrecipes
JWT_SECRET=your_jwt_secret_key

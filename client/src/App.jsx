import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Recipes } from "./pages/Recipes";
import { Auth } from "./pages/Auth";
import { CreateRecipes } from "./pages/Create-recipes";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Ingredients } from "./pages/Ingredients";
import { SavedRecipes } from "./pages/Saved-recipes";
import RecipesList from "./pages/RecipesList"; // Corrected import path
import RecipeDetails from "./pages/RecipesDetails";
import MyRecipes from "./pages/Myrecipes";
import EditRecipe from "./pages/Edit";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/create-recipes" element={<CreateRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/edit-recipe/:recipeID" element={<EditRecipe />} />
          <Route
            path="/recipes/category/:categoryName"
            element={<RecipesList />}
          />{" "}
          {/* New route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

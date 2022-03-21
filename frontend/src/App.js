import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './component/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Recipe from './pages/Recipe';
import RecipeList from './pages/RecipeList';
import Profile from './pages/Profile';
import Footer from './component/Footer';
import PrivateRoute from './component/PrivateRoute';
import NewRecipeModal from './component/NewRecipeModal';
import EditRecipeModal from './component/EditRecipeModal';

function App() {
  return (
    <>
      <Router>
        <div className='flex flex-col min-h-screen bg-slate-100'>
          <Header />
          {/* <Routes></Routes> */}
          <main className='container mx-auto px-3 min-h-[calc(100vh_-_195px)]'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/recipe-list' element={<RecipeList />} />
              <Route path='/recipe/:recipeId' element={<Recipe />} />
              <Route path='/profile' element={<PrivateRoute />}>
                <Route path='/profile' element={<Profile />} />
              </Route>
              <Route path='/profile/create' element={<PrivateRoute />}>
                <Route path='/profile/create' element={<NewRecipeModal />} />
              </Route>
              <Route path='/profile/edit/:recipeId' element={<PrivateRoute />}>
                <Route
                  path='/profile/edit/:recipeId'
                  element={<EditRecipeModal />}
                />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>

      <ToastContainer autoClose={1500} />
    </>
  );
}

export default App;

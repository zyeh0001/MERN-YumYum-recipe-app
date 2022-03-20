import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../component/Spinner';
import {
  reset,
  getRecipes,
  deleteRecipe,
  deleteFavRecipe,
} from '../features/recipe/recipeSlice';
import { getUserFav } from '../features/auth/authSlice';
import RecipeItem from '../component/recipeLayout/RecipeItem';
import { ImProfile } from 'react-icons/im';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  // const [editRecipeId, setEditRecipeId] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const navigate = useNavigate();

  const { isLoading, isSuccess, isError, message, recipes } = useSelector(
    (state) => state.recipe
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getRecipes());
    dispatch(getUserFav(user._id));
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const onDelete = (recipeId) => {
    dispatch(deleteRecipe(recipeId));
    dispatch(deleteFavRecipe(recipeId));
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Delete Successfully');
    }
  };

  const onDeleteFav = (recipeId) => {
    dispatch(deleteFavRecipe(recipeId));

    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Delete Successfully');
    }
  };

  const onEdit = (recipeId) => {
    navigate(`/profile/edit/${recipeId}`);
  };

  if (isLoading) return <Spinner />;
  return (
    <div>
      <section className='flex mt-10'>
        <div className='text-5xl font-bold flex pr-3 mb-2'>
          <ImProfile className='mr-2 inline' />
          <h1>My Profile</h1>
        </div>
        <div className='ml-2 text-gray-500'>
          <p>name: {name}</p>
          <p>email: {email}</p>
        </div>
      </section>
      <main className='mt-4'>
        <div className='flex'>
          <div className='personal-detail'>
            <h2 className='text-2xl my-4'>Your Recipe: </h2>
          </div>
          <button
            onClick={() => navigate('/profile/create')}
            className='purple-btn my-4 mx-4 transition ease-out duration-500'
          >
            Create recipe
          </button>
          {(recipes.length > 0 || user.favCollection.length > 0) && (
            <button
              onClick={() => setIsEditMode((prev) => !prev)}
              className='purple-btn ml-auto mx-4 transition ease-out duration-500'
            >
              Edit
            </button>
          )}
        </div>
        {/* show created listing */}
        {recipes.length > 0 ? (
          <div className='grid lg:grid-cols-5 md:grid-cols-2 gap-4 mt-3'>
            {recipes &&
              recipes.map((recipe) => (
                <RecipeItem
                  key={recipe._id}
                  recipe={recipe}
                  recipeId={recipe._id}
                  isEditMode={isEditMode}
                  onDelete={() => onDelete(recipe._id)}
                  onEdit={() => onEdit(recipe._id)}
                />
              ))}
          </div>
        ) : (
          <p className='text-gray-400'>Create your first recipe! </p>
        )}

        <div className='flex flex-col mb-10 mt-10'>
          <div>
            <h2 className='text-2xl my-4'>Your Favorite Collection: </h2>
          </div>
          {user.favCollection.length > 0 ? (
            <div className='grid lg:grid-cols-5 md:grid-cols-2 gap-4 mt-3'>
              {user.favCollection &&
                user.favCollection.map((collection) => (
                  <RecipeItem
                    key={collection._id}
                    recipe={collection}
                    recipeId={collection._id}
                    isEditMode={isEditMode}
                    onDelete={() => onDeleteFav(collection._id)}
                  />
                ))}
            </div>
          ) : (
            <p className='text-gray-400'>
              You don't have any collection yet...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;

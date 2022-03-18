import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../component/Spinner';
import {
  reset,
  getRecipe,
  getRecipes,
  deleteRecipe,
} from '../features/recipe/recipeSlice';
import NewRecipeModal from '../component/NewRecipeModal';
import EditRecipeModal from '../component/EditRecipeModal';
import RecipeItem from '../component/recipeLayout/RecipeItem';
import { ImProfile } from 'react-icons/im';
import { toast } from 'react-toastify';

function Profile() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [editRecipeId, setEditRecipeId] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const [refresh, setRefresh] = useState(false);
  //open/close modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setRefresh(true);
  };
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setRefresh(true);
  };

  const { isLoading, createSuccess, isSuccess, isError, message, recipes } =
    useSelector((state) => state.recipe);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess, isError, message, createSuccess, modalIsOpen]);

  useEffect(() => {
    dispatch(reset());
    if (refresh === true) {
      console.log('refresh');
      dispatch(getRecipes());
      setRefresh(false);
    } else {
      dispatch(getRecipes());
    }
  }, [refresh, dispatch]);

  const onDelete = (recipeId) => {
    dispatch(deleteRecipe(recipeId));
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Delete Successfully');
    }
  };

  const onEdit = (recipeId) => {
    setEditModalIsOpen(true);
    dispatch(getRecipe(recipeId));
    console.log(recipeId);
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
            onClick={openModal}
            className='purple-btn my-4 mx-4 transition ease-out duration-500'
          >
            Create recipe
          </button>
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className='purple-btn ml-auto mx-4 transition ease-out duration-500'
          >
            Edit
          </button>
        </div>
        {/* show created listing */}
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

        <div className='flex'>
          <div className='personal-detail'>
            <h2 className='text-2xl my-4'>Your Favorite Recipes: </h2>
          </div>
        </div>
      </main>
      {/* create new recipe modal */}
      <NewRecipeModal isOpen={modalIsOpen} onClose={closeModal} />
      {/* edit recipe modal */}
      <EditRecipeModal isOpen={editModalIsOpen} onClose={closeEditModal} />
    </div>
  );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../component/BackButton';
import Spinner from '../component/Spinner';
import {
  getRecipe,
  addToUserFav,
  getUserFav,
  deleteFavRecipe,
} from '../features/recipe/recipeSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlinePeopleOutline } from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { getUsername } from '../features/auth/authSlice';

function Recipe() {
  const [activePad, setActivePad] = useState('summary');
  const [addedFav, setAddedFav] = useState(false);
  const dispatch = useDispatch();
  const { recipe, isError, isLoading, message, isSuccess, favorite } =
    useSelector((state) => state.recipe);
  const { user, username } = useSelector((state) => state.auth);
  const { recipeId } = useParams();

  //Fetch user recipes and user fav collection
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getRecipe(recipeId));
    dispatch(getUserFav(user._id));
    //eslint-disable-next-line
  }, [isError, message, recipeId]);

  //Fetch username for recipe author
  useEffect(() => {
    if (recipe.user) {
      dispatch(getUsername(recipe.user));
    }
  }, [recipe.user, dispatch]);

  //Fetch favCollection to check is Fav or not
  useEffect(() => {
    const isAlreadyFav = checkIfFav(favorite, recipeId);
    if (isAlreadyFav) {
      setAddedFav(true);
    }
    //eslint-disable-next-line
  }, []);

  const checkIfFav = (favCollection, recipeId) => {
    let isAlreadyFav = false;
    favCollection.forEach((favItem) => {
      if (favItem._id === recipeId) {
        isAlreadyFav = true;
        return isAlreadyFav;
      }
    });
    return isAlreadyFav;
  };

  const handleFav = () => {
    if (addedFav) {
      onDeleteFav(recipeId);
    } else {
      addToFav();
    }
  };

  const addToFav = () => {
    localStorage.removeItem('favorite');
    const addItem = {
      _id: recipeId,
      user: recipe.user ? recipe.user : null,
      sourceUrl: recipe.sourceUrl ? recipe.sourceUrl : null,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      ingredients: recipe.ingredients
        ? recipe.ingredients
        : recipe.extendedIngredients,
      steps: recipe.steps ? recipe.steps : recipe.instructions,
    };
    dispatch(addToUserFav(addItem));
    dispatch(getUserFav(user._id));
    if (isSuccess) {
      toast.success('Added to Favorite');
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

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <h3 text-3xl mx-auto>
        Something went wrong...
      </h3>
    );

  return (
    <div className='mt-5 mb-7'>
      <BackButton />
      <div className='grid sm:grid-cols-2 gap-2 sm:gap-5 mt-5'>
        <div>
          <div className='flex'>
            <h1 className='text-3xl font-bold flex pr-3 mb-5 capitalize'>
              {recipe.title}
            </h1>
            {recipe.sourceUrl && (
              <button
                onClick={() => {
                  window.open(`${recipe.sourceUrl}`, '_blank');
                }}
                className='btn btn-neutral btn-outline btn-sm mt-1'
              >
                View On Site
              </button>
            )}
          </div>

          <img
            src={recipe.image}
            alt='recipe'
            className='w-5/6 h-48 sm:h-96 object-cover rounded-md'
          />
        </div>
        <div>
          <div className='mb-3 mt-5 sm:-mt-2 flex space-x-5'>
            <button
              onClick={() => setActivePad('summary')}
              className={
                activePad === 'summary'
                  ? 'btn btn-primary hover:btn-secondary'
                  : 'btn btn-primary btn-outline hover:btn-secondary'
              }
            >
              Summary
            </button>
            <button
              onClick={() => {
                setActivePad('instructions');
              }}
              className={
                activePad === 'instructions'
                  ? 'btn btn-neutral'
                  : 'btn btn-neutral btn-outline'
              }
            >
              Instructions
            </button>

            <div
              className='tooltip tooltip-error tooltip-right'
              data-tip='Add to Fav'
            >
              <button
                className='mt-3'
                onClick={() => {
                  setAddedFav((prev) => !prev);
                  handleFav();
                }}
              >
                {addedFav ? (
                  <AiFillHeart className='text-xl text-red-400' />
                ) : (
                  <AiOutlineHeart className='text-xl ' />
                )}
              </button>
            </div>
          </div>

          {/* summary */}
          {activePad === 'summary' && (
            <div className=' border-2 border-neutral shadow-sm rounded-md p-10 flex flex-col'>
              <h1 className='text-xl fond-bold mb-1'>Summary:</h1>
              <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
              <div className='flex space-x-3 mt-3'>
                <div className='badge badge-secondary badge-sm text-xs capitalize font-bold rounded-full p-2 '>
                  <AiOutlineClockCircle />{' '}
                  <span className='ml-1'>{`${recipe.readyInMinutes}m cook`}</span>
                </div>
                <div className='badge bg-purple-400 text-neutral border-none badge-md text-xs capitalize font-bold rounded-full p-2 '>
                  <MdOutlinePeopleOutline />{' '}
                  <span className='ml-1'>{`${recipe.servings} serving`}</span>
                </div>
              </div>

              <p className='mt-5'>{`Recipe From: ${
                recipe.user ? username : recipe.sourceName
              }`}</p>
            </div>
          )}

          {/* Instructions */}

          {activePad === 'instructions' && (
            <div className=' border-2 border-neutral shadow-sm rounded-md p-10 flex flex-col'>
              <h1 className='text-xl fond-bold mb-1'>Ingredients: </h1>
              <div>
                {recipe.ingredients && (
                  <ul className='grid grid-cols-2'>
                    {recipe.ingredients.map((ingredient, i) => {
                      if (ingredient === '') return null;
                      else {
                        return (
                          <li key={i} className='list-disc list-inside'>
                            {ingredient}
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
                {recipe.extendedIngredients && (
                  <ul className='grid grid-cols-2'>
                    {recipe.extendedIngredients.map((ingredient, i) => (
                      <li key={i} className='list-disc list-inside'>
                        {ingredient.original}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <hr className='border-1 border-gray-600 my-3' />

              <h1 className='text-xl fond-bold mb-1'>Steps:</h1>
              {recipe.instructions && (
                <p
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                ></p>
              )}

              {recipe.steps && (
                <ol className='flex flex-col space-y-1'>
                  {recipe.steps.map((step, i) => {
                    if (step === '') return null;
                    else {
                      return <li key={i}>{step}</li>;
                    }
                  })}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipe;

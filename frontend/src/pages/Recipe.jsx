import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../component/BackButton';
import Spinner from '../component/Spinner';
import { getRecipe } from '../features/recipe/recipeSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlinePeopleOutline } from 'react-icons/md';

function Recipe() {
  const [activePad, setActivePad] = useState('summary');
  const dispatch = useDispatch();
  const { recipe, isError, isLoading, message } = useSelector(
    (state) => state.recipe
  );
  const { recipeId } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getRecipe(recipeId));
    //eslint-disable-next-line
  }, [isError, message, recipeId]);

  if (isLoading) return <Spinner />;

  if (isError) return <h3>Something went wrong</h3>;

  return (
    <div className='mt-5 mb-7'>
      <BackButton url={recipe.sourceUrl ? '/recipe-list' : '/profile'} />
      <div className='grid sm:grid-cols-2 gap-2 sm:gap-5 mt-5'>
        <div>
          <h1 className='text-3xl font-bold flex pr-3 mb-5 capitalize'>
            {recipe.title}
          </h1>
          <img
            src={recipe.image}
            alt='recipe'
            className='w-5/6 h-48 sm:h-96 object-cover rounded-md'
          />
        </div>
        <div>
          <div className='mb-3 -mt-2'>
            <button
              onClick={() => {
                setActivePad('summary');
              }}
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
                  ? 'btn btn-neutral ml-5 '
                  : 'btn btn-neutral btn-outline ml-5'
              }
            >
              Instructions
            </button>
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
            </div>
          )}

          {/* instructions */}

          {activePad === 'instructions' && (
            <div className=' border-2 border-neutral shadow-sm rounded-md p-10 flex flex-col'>
              <h1 className='text-xl fond-bold mb-1'>Ingredients: </h1>
              <div>
                {recipe.ingredients ? (
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
                ) : (
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
              {recipe.instructions ? (
                <p
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                ></p>
              ) : (
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

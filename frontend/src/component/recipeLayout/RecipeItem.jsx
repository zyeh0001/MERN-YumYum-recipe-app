import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
// import { getUsername } from '../../features/auth/authSlice';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

function RecipeItem({ recipe, recipeId, onDelete, onEdit, isEditMode }) {
  // const { username } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (username === null) {
  //     dispatch(getUsername(recipe.user));
  //   }
  //   //eslint-disable-next-line
  // }, [recipe.user]);

  return (
    <>
      <div>
        <Link to={`/recipe/${recipeId}`}>
          <div className='card bg-base-100 shadow-md hover:shadow-lg  relative rounded-sm'>
            <img
              src={recipe.image}
              alt='recipe'
              className='w-full h-32 sm:h-48 object-cover rounded-sm'
            />

            <div className='flex flex-col m-4'>
              <h2 className='text-bold hover-change'> {recipe.title}</h2>
              {/* {recipe.user && (
                <span className='block text-gray-600 text-sm'>
                  Recipe By: {username}
                </span>
              )} */}
            </div>
            {recipe.readyInMinutes && (
              <div className='badge badge-secondary badge-sm text-xs uppercase font-bold rounded-full p-2 absolute top-0 left-0 ml-2 mt-2'>
                <AiOutlineClockCircle />{' '}
                <span className='ml-1'> {recipe.readyInMinutes} MINS</span>
              </div>
            )}
          </div>
        </Link>
        {isEditMode && (
          <div className='flex justify-center mt-2 mb-5'>
            {onDelete && (
              <AiFillDelete
                className='text-red mr-2 cursor-pointer'
                fill='rgb(231,76,60)'
                onClick={() => onDelete(recipe._id, recipe.name)}
              />
            )}
            {onEdit && (
              <AiFillEdit
                className='cursor-pointer'
                onClick={() => onEdit(recipe._id)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default RecipeItem;

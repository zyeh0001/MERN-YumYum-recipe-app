import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { searchRecipes, reset } from '../features/recipe/recipeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import RecipeItem from '../component/recipeLayout/RecipeItem';

function RecipeList() {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const { recipes, isSuccess, isError, message, isLoading } = useSelector(
    (state) => state.recipe
  );

  useEffect(() => {
    const searchText = localStorage.getItem('searchText');
    if (searchText) {
      setText(searchText);
    }
    if (text !== '') {
      dispatch(searchRecipes({ text: text, limit: limit }));
    }
    //eslint-disable-next-line
  }, [limit]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    // if ((recipes || []).length === 0 && isSuccess) {
    //   toast.error('Recipe not found');
    // }
  }, [isError, isSuccess, message, recipes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text === '') {
      toast.error('Please Enter Something');
    } else {
      dispatch(searchRecipes({ text: text, limit: limit }));
      localStorage.setItem('searchText', text);
    }
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // if (isLoading) return <Spinner />;

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-4 mb-8 gap-8 mt-5'>
        <div className='col-span-2 col-start-2'>
          <form onSubmit={handleSubmit}>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search'
                className='w-full input input-bordered input-primary input-md text-black '
                value={text}
                onChange={handleChange}
              />
              <button className='absolute top-0 right-0 text-neutral  btn-md text-lg hover:scale-125'>
                <BiSearchAlt />
              </button>
            </div>
          </form>
        </div>
        {(recipes || []).length > 0 && (
          <div className='col-span-1 col-start-4'>
            <button
              onClick={() => {
                dispatch(reset());
                setText('');
                setLimit(10);
                localStorage.removeItem('searchText');
              }}
              className='btn btn-md bg-purple-400 text-neutral hover:bg-purple-200'
            >
              Clear
            </button>
          </div>
        )}
      </div>
      {(recipes || []).length > 0 ? (
        <div className='grid lg:grid-cols-5 md:grid-cols-2 gap-4 mt-3 mb-7'>
          {recipes.map((recipe, i) => (
            <RecipeItem
              key={i}
              recipe={recipe}
              recipeId={recipe.id ? recipe.id : recipe._id}
            />
          ))}
        </div>
      ) : (
        <h3 className='text-gray-500 text-2xl text-center'>
          No recipe yet, start searching...
        </h3>
      )}
      {isLoading && <h3>Loading...</h3>}
      {(recipes || []).length > 0 && (
        <div className='flex justify-center mb-10'>
          <button
            onClick={() => {
              setLimit((prev) => prev + 10);
            }}
            className='btn btn-neutral btn-sm btn-outline'
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}

export default RecipeList;

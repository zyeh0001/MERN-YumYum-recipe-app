import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from './Spinner';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { updateRecipe } from '../features/recipe/recipeSlice';

Modal.setAppElement('#root'); //modal will be mounted on the root
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(75, 85, 99, 0.75)',
  },
  content: {
    width: '700px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
    backgroundColor: '#e5e7eb',
    padding: '50px',
    border: '10px solid rgba(147,112,219,.5)',
    height: '700px', // <-- This sets the height
    overlfow: 'scroll', // <-- This tells the modal to scroll
  },
};

function EditRecipeModal(props) {
  const { user } = useSelector((state) => state.auth);
  const [name] = useState(user.name);
  const [image, setImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    user,
    title: '',
    summary: '',
    steps: [],
    servings: 2,
    readyInMinutes: 30,
    ingredients: [],
  });

  const { title, summary, steps, servings, readyInMinutes, ingredients } =
    formData;

  const { recipe, createSuccess, isError, message } = useSelector(
    (state) => state.recipe
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(recipe).length === 0) {
      setFormData({
        ...recipe,
        ingredients: [...recipe.ingredients, ''],
        steps: [...recipe.steps, ''],
      });
    }

    if (isError) {
      toast.error(message);
    }
  }, [recipe, isError, message]);

  if (imageUploading) {
    return <Spinner />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setImageUploading(true);
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'yumyum');
        formData.append('cloud_name', 'gaga-org');
        const dataRes = await axios.post(
          'https://api.cloudinary.com/v1_1/gaga-org/image/upload',
          formData
        );
        imageUrl = dataRes.data.url;
        setImageUploading(false);
      }
      const formDataClone = {
        ...formData,
        image: imageUrl,
      };
      console.log(formDataClone);
      dispatch(updateRecipe(formDataClone));
      if (createSuccess) {
        toast.success('Update Successfully');
      }

      props.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const onMutate = (e, i) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onChangeIngredients = (e, i) => {
    const ingredientsClone = ingredients;
    console.log(ingredientsClone);
    console.log(i);
    ingredientsClone[i] = e.target.value;
    setFormData({
      ...formData,
      ingredients: ingredientsClone,
    });
  };

  const onChangeSteps = (e, i) => {
    const stepsClone = steps;
    stepsClone[i] = e.target.value;
    setFormData({
      ...formData,
      steps: stepsClone,
    });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...ingredients, ''],
    });
  };

  const handleDeleteIngredient = () => {
    setFormData({
      ...formData,
      ingredients: ingredients.slice(0, -1),
    });
  };

  const handleAddStep = () => {
    setFormData({
      ...formData,
      steps: [...steps, ''],
    });
  };

  const handleDeleteStep = () => {
    setFormData({
      ...formData,
      steps: steps.slice(0, -1),
    });
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onClose}
        style={customStyles}
        contentLabel='Add Recipe'
      >
        <div className='text-neutral'>
          <div className='flex mb-2'>
            <h2 className='text-purple-600 text-3xl mr-5 font-bold'>
              Edit Recipe
            </h2>
            <p className='mr-auto text-sm pt-3'>Author: {name}</p>
            <button
              className='btn-neutral hover:bg-purple-200 hover:text-neutral btn-sm btn-outline rounded-full cursor-pointer border-2'
              onClick={props.onClose}
            >
              X
            </button>
          </div>
          <hr className='border-2 border-gray-600 mb-5' />

          <form onSubmit={onSubmit}>
            <div className='form-group'></div>
            <div className='form-group'>
              <label htmlFor='title' className='font-bold text-lg mt-1'>
                Recipe Title:
              </label>
              <input
                name='title'
                id='title'
                placeholder='Enter recipe title'
                value={title}
                onChange={onMutate}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='summary' className='font-bold text-lg mt-1'>
                Summary:{' '}
              </label>
              <textarea
                name='summary'
                id='summary'
                placeholder='summary'
                value={summary}
                onChange={onMutate}
              ></textarea>
            </div>
            <div className='flex '>
              <div className='form-group basis-1/4 mr-5'>
                <label className='font-semibold text-lg mt-1'>Servings: </label>
                <input
                  className='border-neutral hover:border-2 rounded-lg pl-2 py-1'
                  type='number'
                  id='servings'
                  value={servings}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
              <div className='form-group basis-1/4'>
                <label className='font-semibold text-lg mt-1'>Ready In: </label>
                <input
                  className='border-neutral hover:border-2 rounded-lg pl-2 py-1'
                  type='number'
                  id='readyInMinutes'
                  value={readyInMinutes}
                  onChange={onMutate}
                  min='1'
                  max='1200'
                  required
                />
              </div>
            </div>
            <div className='form-group mt-2'>
              <label htmlFor='ingredients' className='font-bold text-lg mt-1'>
                Ingredients
              </label>
              {formData.ingredients &&
                formData.ingredients.map((ingredient, i) => (
                  <input
                    key={i}
                    type='text'
                    id='ingredients'
                    value={ingredient}
                    onChange={(e) => onChangeIngredients(e, i)}
                  />
                ))}
              <div className='mt-1 mb-5'>
                <button
                  type='button'
                  onClick={handleAddIngredient}
                  className='btn btn-sm btn-outline mr-2'
                >
                  Add Item
                </button>
                <button
                  type='button'
                  onClick={handleDeleteIngredient}
                  className='btn btn-sm btn-outline btn-error'
                >
                  Delete Item
                </button>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='steps' className='font-bold text-lg mt-1'>
                Steps
              </label>
              {formData.steps &&
                formData.steps.map((step, i) => (
                  <input
                    key={i}
                    type='text'
                    id='steps'
                    value={step}
                    onChange={(e) => onChangeSteps(e, i)}
                  />
                ))}
              <div className='mt-1 mb-5'>
                <button
                  type='button'
                  onClick={handleAddStep}
                  className='btn btn-sm btn-outline mr-2'
                >
                  Add Step
                </button>
                <button
                  type='button'
                  onClick={handleDeleteStep}
                  className='btn btn-sm btn-outline btn-error'
                >
                  Delete Step
                </button>
              </div>
            </div>
            <div className='form-group'>
              <label className='font-bold text-lg mt-1'>Images: </label>
              <p className='mb-2'>
                The image will show as the preview of recipe
              </p>
              <input
                className='btn btn-lg rounded-sm bg-purple-300 text-neutral font-bold cursor-pointer tracking-wider py-2 px-3  uppercase hover:bg-purple-200'
                type='file'
                id='image'
                onChange={(e) => setImage(e.target.files[0])}
                accept='image/*'
                required
              />
            </div>
            <hr />
            <div className='form-group mt-5'>
              <button className='btn btn-success btn-md mr-2 '>Submit</button>
              <button
                type='button'
                onClick={props.onClose}
                className='btn btn-error btn-md'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default EditRecipeModal;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice.js';
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';

function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isSuccess, isLoading, message, isError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
    //eslint-disable-next-line
  }, [isError, isSuccess, user, message]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  if (isLoading) return <Spinner />;

  return (
    <div className='container mt-10 flex flex-col items-center'>
      <section className='flex flex-col items-center'>
        <div className='text-5xl font-bold flex align-middle p-3 mb-3'>
          <FaSignInAlt className='mr-2 inline' />
          <h1>Login</h1>
        </div>
        <p className='text-2xl text-gray-500 mb-3'>Find out what to cook</p>
      </section>
      <section className='w-1/2'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              id='email'
              value={email}
              placeholder='Enter Your email'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              id='password'
              value={password}
              placeholder='Enter Your password'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-block btn-secondary'>Sign Up</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../component/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, message, isError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //redirect when register success and login
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
    //eslint-disable-next-line
  }, [user, isSuccess, message, isError, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('password do not match');
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };
  if (isLoading) return <Spinner />;

  return (
    <div className='container mt-10 flex flex-col items-center mb-10'>
      <section className='flex flex-col items-center'>
        <div className='text-5xl font-bold flex align-middle p-3 mb-2'>
          <FaUserPlus className='mr-2 inline' />
          <h1>Register</h1>
        </div>
        <p className='text-2xl text-gray-500 mb-3'>Create new account</p>
      </section>
      <section className='w-1/2'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              id='name'
              value={name}
              placeholder='Enter Your Name'
              onChange={onChange}
              required
            />
          </div>
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
            <input
              type='password'
              id='password2'
              value={password2}
              placeholder='Confirm password'
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

export default Register;

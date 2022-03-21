import React from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className='btn btn-secondary btn-sm'>
      <FaArrowCircleLeft className='mr-1' /> Back
    </button>
  );
}

export default BackButton;

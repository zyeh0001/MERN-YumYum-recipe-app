import React from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function BackButton({ url }) {
  return (
    <Link to={url} className='btn btn-secondary btn-sm'>
      <FaArrowCircleLeft className='mr-1' /> Back
    </Link>
  );
}

export default BackButton;

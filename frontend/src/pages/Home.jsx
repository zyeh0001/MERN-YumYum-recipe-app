import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='home-background flex justify-center min-h-[calc(100vh_-_195px)] absolute left-0 right-0'>
      <div className=' my-auto flex flex-col items-center'>
        <h1 className='text-3xl sm:text-3xl lg:text-5xl mb-6 font-bold text-white'>
          Amazing Recipe Finder
        </h1>
        <Link to='/recipe-list' className='btn btn-primary'>
          Search Recipe
        </Link>
      </div>
    </div>
  );
}

export default Home;

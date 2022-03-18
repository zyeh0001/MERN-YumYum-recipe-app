import { IoFastFoodOutline } from 'react-icons/io5';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  //change the color of the nav link
  const location = useLocation();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className='navbar shadow-sm bg-base-100 '>
      <div className='container mx-auto'>
        <div className='flex-none px-1 md:mx-1 text-primary'>
          <IoFastFoodOutline
            className={
              pathMatchRoute('/')
                ? 'inline pr-2 text-3xl text-primary'
                : 'inline pr-2 text-3xl text-neutral'
            }
          />
          <Link to='/' className='text-lg font-bold align-middle'>
            YumYum
          </Link>
        </div>
        <div className='flex-1 px-1 mx-1'>
          <div className='flex justify-start text-base-content '>
            <Link
              to='/'
              className={
                pathMatchRoute('/')
                  ? 'btn btn-secondary btn-sm '
                  : 'btn btn-ghost btn-sm '
              }
            >
              Home
            </Link>
            <Link
              to='/recipe-list'
              className={
                pathMatchRoute('/recipe')
                  ? 'btn btn-secondary btn-sm '
                  : 'btn btn-ghost btn-sm '
              }
            >
              Recipe
            </Link>
          </div>
        </div>
        <div className='flex-1 px-1 mx-1'>
          <div className='flex justify-end text-base-content space-x-1'>
            {user ? (
              <>
                <button
                  className='btn btn-ghost btn-sm btn-ontline'
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  <FaUser className='mr-1' />
                  Profile
                </button>
                <button
                  className='btn btn-ghost btn-sm btn-ontline'
                  onClick={onLogout}
                >
                  <FaSignOutAlt className='mr-1' />
                  SignOut
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className={
                    pathMatchRoute('/login')
                      ? 'btn btn-secondary btn-sm  btn-ontline'
                      : 'btn btn-ghost btn-sm btn-ontline'
                  }
                >
                  <FaSignInAlt className='mr-1' /> SignIn
                </Link>
                <Link
                  to='/register'
                  className={
                    pathMatchRoute('/register')
                      ? 'btn btn-secondary btn-sm  btn-ontline'
                      : 'btn btn-ghost btn-sm btn-ontline'
                  }
                >
                  <FaUser className='mr-1' />
                  SignUp
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

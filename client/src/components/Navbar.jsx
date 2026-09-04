import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaFacebook,
  FaInstagram,
  FaTwitterSquare,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useStore from "../store";
import { getInitials } from "../utils";
import Button from "./Button";
import Logo from "./Logo";
import ThemeSwitch from "./Switch";

const Avatar = ({ user, className = "w-8 h-8" }) =>
  user?.image ? (
    <img
      src={user.image}
      alt='Profile'
      className={`${className} rounded-full object-cover`}
    />
  ) : (
    <span
      className={`text-white ${className} rounded-full bg-blue-600 flex items-center justify-center`}
    >
      {getInitials(user?.name ?? "")}
    </span>
  );

const MobileMenu = ({ user, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className='flex'>
      <button
        onClick={toggleMenu}
        className='lg:hidden p-2 text-gray-600 hover:text-gray-800'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className='fixed top-0 left-0 w-full h-fit bg-white dark:bg-[#020b19] z-50 flex flex-col py-10 items-center justify-center shadow-xl gap-8'>
          <Logo />
          <ul className='flex flex-col gap-4 text-base text-black dark:text-gray-300 text-center'>
            <li onClick={toggleMenu}>
              <Link to='/'>Home</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to='/category'>Categories</Link>
            </li>
            {user?.user?.accountType === "Writer" && (
              <li onClick={toggleMenu}>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
            )}
          </ul>

          <div className='flex gap-2 items-center'>
            {user?.token ? (
              <div className='w-full flex flex-col items-center justify-center'>
                <div className='flex gap-1 items-center mb-5'>
                  <Avatar user={user?.user} />
                  <span className='font-medium text-black dark:text-gray-500'>
                    {user?.user?.name}
                  </span>
                </div>

                <button
                  className='bg-black dark:bg-rose-600 text-white px-8 py-1.5 rounded-full text-center outline-none'
                  onClick={() => {
                    toggleMenu();
                    signOut();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to='/signin' onClick={toggleMenu}>
                <Button
                  label='Sign in'
                  styles='flex items-center justify-center bg-black dark:bg-rose-600 text-white px-4 py-1.5 rounded-full'
                />
              </Link>
            )}
          </div>

          <ThemeSwitch />

          <span
            className='cursor-pointer text-xl font-semibold dark:text-white'
            onClick={toggleMenu}
          >
            <AiOutlineClose />
          </span>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, signOut } = useStore();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    setShowProfile(false);
    signOut();
  };

  return (
    <nav className='flex flex-col md:flex-row w-full py-5 items-center justify-between gap-4 md:gap-0'>
      <div className='flex gap-2 text-[20px] md:hidden lg:flex'>
        <Link to='/' className='text-red-600'>
          <FaYoutube />
        </Link>
        <Link to='/' className='text-blue-600'>
          <FaFacebook />
        </Link>
        <Link to='/' className='text-rose-600'>
          <FaInstagram />
        </Link>
        <Link to='/' className='text-blue-500'>
          <FaTwitterSquare />
        </Link>
      </div>

      <Logo />

      <div className='hidden md:flex gap-14 items-center'>
        <ul className='flex gap-8 text-base text-black dark:text-white'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/category'>Categories</Link>
          </li>
          {user?.user?.accountType === "Writer" && (
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
          )}
        </ul>

        <ThemeSwitch />

        <div className='flex gap-2 items-center cursor-pointer'>
          {user?.token ? (
            <div
              className='relative'
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <div className='flex gap-1 items-center cursor-pointer'>
                <Avatar user={user?.user} />
                <span className='font-medium text-black dark:text-gray-500'>
                  {user?.user?.name?.split(" ")[0]}
                </span>
              </div>

              {showProfile && (
                <div className='absolute bg-white dark:bg-[#2f2d30] py-6 px-6 flex flex-col shadow-2xl z-50 right-0 gap-3 rounded'>
                  <Link
                    to={`/writer/${user?.user?._id}`}
                    className='dark:text-white whitespace-nowrap'
                  >
                    Profile
                  </Link>
                  {user?.user?.accountType === "Writer" && (
                    <Link
                      to='/dashboard'
                      className='dark:text-white whitespace-nowrap'
                    >
                      Dashboard
                    </Link>
                  )}
                  <span
                    className='border-t border-slate-300 text-rose-700 pt-2'
                    onClick={handleSignOut}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to='/signin'>
              <Button
                label='Sign in'
                styles='flex items-center justify-center bg-black dark:bg-rose-600 text-white px-4 py-1.5 rounded-full'
              />
            </Link>
          )}
        </div>
      </div>

      <div className='block md:hidden'>
        <MobileMenu user={user} signOut={handleSignOut} />
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiMenuAltLeft } from 'react-icons/bi';
import { FaHome, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { scrollIntoView } from '../../utils/functions';
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder';
import './navigation.css';

/**
 * @description
 * 
 * 
 * Nav Component
 *
 * This functional component renders the navigation bar for the application, which includes:
 * - A hamburger menu that toggles the visibility of a dropdown navigation menu.
 * - A logo that navigates the user to the home page ('/') when clicked, provided the user is not already on the home page.
 * - A dropdown menu with links to different sections of the page. When a link is clicked, the corresponding section scrolls into view, and the dropdown menu closes.
 * - The menu automatically closes if the user clicks outside the menu or its toggle button (hamburger icon).
 *
 * Hooks:
 * - useState: Manages the state of the menu (open or closed) and the loading placeholders.
 * - useNavigate: Allows navigation between different routes.
 * - useLocation: Retrieves the current path to determine if the user is already on the home page.
 * - useEffect: Adds and cleans up event listeners to close the menu when clicking outside of it.
 *
 * External Dependencies:
 * - React Router's useNavigate and useLocation hooks for navigation.
 * - React Icons for icons used in the navigation menu.
 * - A custom scrollIntoView function for smooth scrolling to sections.
 * - A custom useLoadingPlaceholder hook for managing loading placeholders.
 *
 * CSS:
 * - The component uses a CSS module ('./navigation.css') for styling.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoLoaded] = useLoadingPlaceholder(1000);
  const [isMenuLoaded] = useLoadingPlaceholder(1200);
  const [isHomeLoaded] = useLoadingPlaceholder(1400);
  const [isAboutLoaded] = useLoadingPlaceholder(1600);
  const [isContactLoaded] = useLoadingPlaceholder(1800);
  const [isLoginLoaded] = useLoadingPlaceholder(2000);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClick = (selector) => {
    scrollIntoView(selector);
    toggleMenu();
  };

  const navigateToPage = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest('.dropdown-menu') &&
        !event.target.closest('.hamburger')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className='menu'>
      <div className='hamburger' onClick={toggleMenu}>
        {!isMenuLoaded ? (
          <div className='placeholder placeholder-icon'></div>
        ) : (
          <BiMenuAltLeft className='icon' />
        )}
      </div>

      <div className='logo' onClick={() => navigateToPage('/')}>
        {!isLogoLoaded ? (
          <div className='placeholder placeholder-logo'></div>
        ) : (
          <img src='/assets/images/logo.png' alt='Logo' />
        )}
      </div>

      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => navigateToPage('/')}>
            {!isHomeLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Home
                <FaHome className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => handleClick('#contact')}>
            {!isContactLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Contact <FaEnvelope className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => handleClick('#login')}>
            {!isLoginLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>
                Login
                <FaSignInAlt className='menu-icon' />
              </>
            )}
          </li>

          <li onClick={() => handleClick('#about')}>
            {!isAboutLoaded ? (
              <div className='placeholder placeholder-text'></div>
            ) : (
              <>About</>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

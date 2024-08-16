import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TbError404 } from 'react-icons/tb';
import './redirect.css';

/**
 * Component to display a "Not Found" message and redirect to an appropriate route based on history.
 *
 * @description This component shows a 404 error message and an icon indicating a page not found.
 *              It checks the browser's history for the presence of known routes ("/" or "/vacancies").
 *              After 3 seconds, it automatically redirects the user to the closest known route found in the history,
 *              or the home page if no known route is found.
 *
 * @returns {JSX.Element} A div element containing a 404 error icon, a heading, and a message 
 *                        indicating redirection to the closest known route or the home page.
 */

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Known routes in the application
    const knownRoutes = ['/', '/vacancies'];
    const currentPath = location.pathname;

    // Check the current path against known routes
    const matchedRoute = knownRoutes.find(route => currentPath.startsWith(route));

    // Redirect to matched route or default to home after 3 seconds
    const timer = setTimeout(() => {
      if (matchedRoute) {
        navigate(matchedRoute);
      } else {
        navigate('/');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className='not-found'>
      <TbError404 className='img-404' />
      <h1>tlhogela go kgotlakgotla!</h1>
      <p>Redirecting to the closest known route or the home page...</p>
    </div>
  );
}

export default NotFound;

import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/navigation/Nav';
import PropTypes from 'prop-types';

/**
 * Layout component that conditionally displays a navigation bar and handles lazy loading of child components.
 *
 * @description This component checks the current path to determine if the navigation bar should be shown. It uses React's `Suspense` to handle lazy loading of child components, displaying a fallback loading indicator while the child components are loading.
 * 
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * 
 * @returns {JSX.Element} A fragment containing the `Nav` component (if applicable) and the child components wrapped in `Suspense`.
 */
function Layout({ children }) {
  const location = useLocation();

  // List of valid paths where Nav should be shown
  const validPaths = ['/', '/post_information', '/vacancies'];

  // Check if the current path is one of the valid paths
  const shouldShowNav = validPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <Nav />}
      <Suspense fallback={<div className='loadingDiv'></div>}>
        {children}
      </Suspense>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

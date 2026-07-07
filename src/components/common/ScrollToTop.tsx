import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Resets the window scroll position to the top whenever the URL path changes.
 * This fixes the common React Router issue where navigating to a new page
 * starts at the previous page's scroll position.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page instantly
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render any visible UI
  return null;
};

export default ScrollToTop;
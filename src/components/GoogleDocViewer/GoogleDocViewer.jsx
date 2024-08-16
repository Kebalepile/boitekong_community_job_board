import React, { useState } from "react";
import PropTypes from "prop-types";
import "./googleDocViewer.css";

/**
 * GoogleDocViewer Component
 *
 * @description This component is responsible for rendering an embedded Google Drive document preview. 
 * It handles the toggling between a default view and a full-screen view. If an array of iframe URLs is provided, 
 * it renders the first one. The component is responsive and ensures that the iframe is displayed correctly across different screen sizes.
 *
 * @param {Array<string> | string} iframeUrls - The URL(s) for the Google Drive document to be previewed. 
 * Can be a single string or an array of strings.
 *
 * @returns {JSX.Element} A div containing the Google Drive document iframe and a button to toggle full-screen mode.
 */

function GoogleDocViewer({ iframeUrls }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = (e) => {
    e.stopPropagation(); // Prevent triggering the post click handler.
    setIsFullScreen((prev) => !prev);
  };

  const iframeSrc = Array.isArray(iframeUrls) ? iframeUrls[0] : iframeUrls; // Assuming you want to render the first iframe if it's an array.

  return (
    <div className={`google-doc-viewer ${isFullScreen ? 'fullscreen' : ''}`}>
      <iframe
        src={iframeSrc}
        // frameBorder="0"
        allowFullScreen
        className="google-doc-iframe"
      ></iframe>
      <button className="toggle-fullscreen" onClick={toggleFullScreen}>
        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
      </button>
    </div>
  );
}

GoogleDocViewer.propTypes = {
  iframeUrls: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default GoogleDocViewer;

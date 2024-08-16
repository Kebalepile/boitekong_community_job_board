import React, { useState } from "react";
import PropTypes from "prop-types";
import "./googleDocViewer.css";

/**
 * GoogleDocViewer Component
 *
 * @description This component is responsible for rendering an embedded Google Drive document preview.
 * It handles the toggling between a default view and a full-screen view. If an array of iframe URLs is provided,
 * it allows navigation between them using "Next" and "Previous" buttons.
 * The component is responsive and ensures that the iframe is displayed correctly across different screen sizes.
 *
 * @param {Array<string> | string} iframeUrls - The URL(s) for the Google Drive document to be previewed.
 * Can be a single string or an array of strings.
 *
 * @returns {JSX.Element} A div containing the Google Drive document iframe, navigation buttons, and a toggle button for full-screen mode.
 */

function GoogleDocViewer({ iframeUrls }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFullScreen = (e) => {
    e.stopPropagation(); // Prevent triggering the post click handler.
    setIsFullScreen((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < iframeUrls.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const iframeSrc = Array.isArray(iframeUrls) ? iframeUrls[currentIndex] : iframeUrls;

  return (
    <div className={`google-doc-viewer ${isFullScreen ? "fullscreen" : ""}`}>
      <iframe
        src={iframeSrc}
        allowFullScreen
        className="google-doc-iframe"
      ></iframe>
      <div className="navigation-buttons">
        {Array.isArray(iframeUrls) && (
          <>
            <button
              className="prev-doc-button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="next-doc-button"
              onClick={handleNext}
              disabled={currentIndex === iframeUrls.length - 1}
            >
              Next
            </button>
          </>
        )}
      </div>
      <button className="toggle-fullscreen" onClick={toggleFullScreen}>
        {isFullScreen ? "Exit Full Screen" : "Full Screen"}
      </button>
    </div>
  );
}

GoogleDocViewer.propTypes = {
  iframeUrls: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default GoogleDocViewer;

import React, { useState, useEffect } from 'react';
import usePdfIframe from '../../hooks/usePdfIframe';
import PropTypes from 'prop-types';
import './pdf_viewer.css';

/**
 * Component to render a PDF viewer within an iframe.
 *
 * @description This component displays a PDF document using an iframe. It includes a button to toggle between full and minimized views. It also shows a loading placeholder while the PDF content is being loaded.
 *
 * @param {Object} props - The component props.
 * @param {string} props.file - The URL or path of the PDF file to be displayed in the iframe.
 *
 * @returns {JSX.Element} A div element containing the PDF viewer in an iframe or a loading placeholder, with a button to toggle the view mode.
 */
const PDFViewerIframe = ({ file }) => {
  const iframeUrl = usePdfIframe(file);
  const [isFullView, setIsFullView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  const toggleView = () => setIsFullView(!isFullView);

  return (
    <div
      className={`pdf-viewer-container ${
        isFullView ? 'full-view' : 'min-view'
      }`}
    >
      {isLoading ? (
        <div className="placeholder pdf-viewer-container-placeholder"></div>
      ) : (
        <>
          <button
            className={`toggle-view-btn ${
              isFullView ? 'full-view-btn' : 'min-view-btn'
            }`}
            onClick={toggleView}
          >
            {isFullView ? 'Minimize View' : 'Full View'}
          </button>

          <iframe
            src={iframeUrl}
            className='pdf-viewer-iframe'
            title='PDF Viewer'
          />
        </>
      )}
    </div>
  );
}

PDFViewerIframe.propTypes = {
  file: PropTypes.string.isRequired
};

export default PDFViewerIframe;

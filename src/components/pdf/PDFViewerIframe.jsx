import React, { useState } from 'react';
import usePdfIframe from '../../hooks/usePdfIframe';
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder';
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
  const [isPdfContainerViewerLoaded] = useLoadingPlaceholder(5000);

  const toggleView = () => setIsFullView(!isFullView);

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      <button className="toggle-view-btn" onClick={toggleView}>
        {isFullView ? 'Minimize View' : 'Full View'}
      </button>
      {isPdfContainerViewerLoaded ? (
        iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="pdf-viewer-iframe"
            title="PDF Viewer"
          />
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <div className="placeholder pdf-viewer-container-placeholder"></div>
      )}
    </div>
  );
};

PDFViewerIframe.propTypes = {
  file: PropTypes.string.isRequired,
};

export default PDFViewerIframe;

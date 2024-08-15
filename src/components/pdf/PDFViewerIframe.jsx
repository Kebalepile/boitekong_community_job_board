import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './pdf_viewer.css';

const PDFViewerIframe = ({ pdfImages }) => {
  const [scale, setScale] = useState(1);
  const [isFullView, setIsFullView] = useState(false);
  const canvasRef = useRef(null);
  console.log(pdfImages)
  const renderPage = () => {
    const pdfImage = new Image();
    pdfImage.src = pdfImages[0]; // Display the first page initially

    pdfImage.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Adjust canvas size based on image and scale
      canvas.width = pdfImage.width * scale;
      canvas.height = pdfImage.height * scale;

      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content
      ctx.drawImage(pdfImage, 0, 0, canvas.width, canvas.height);
    };
  };

  renderPage();
  const handleZoomIn = () => setScale(scale + 0.25);
  const handleZoomOut = () => setScale(scale > 0.5 ? scale - 0.25 : scale);
  
  const toggleView = () => setIsFullView(!isFullView);

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      
      <div className="pdf-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut} disabled={scale <= 0.5}>Zoom Out</button>
        <button className="toggle-view-btn" onClick={toggleView}>
          {isFullView ? 'Minimize View' : 'Full View'}
        </button>
      </div>
      <canvas ref={canvasRef} className="pdf-viewer-canvas" />
    </div>
  );
};

PDFViewerIframe.propTypes = {
  pdfImages: PropTypes.array.isRequired,
};

export default PDFViewerIframe;

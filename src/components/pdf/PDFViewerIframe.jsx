import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './pdf_viewer.css';

const PDFViewerIframe = ({ pdfImages }) => {
  const [scale, setScale] = useState(1);
  const [isFullView, setIsFullView] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const canvasRef = useRef(null);

  const renderPage = () => {
    const pdfImage = new Image();
    pdfImage.src = pdfImages[pageNum - 1]; // Display the current page

    pdfImage.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Adjust canvas size based on image and scale
      canvas.width = pdfImage.width * scale;
      canvas.height = pdfImage.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content
      ctx.drawImage(pdfImage, 0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    renderPage();
  }, [scale, isFullView, pageNum]); // Re-render when scale, view mode, or page number changes

  const handleZoomIn = () => {
    setScale(prevScale => {
      const newScale = prevScale + 0.25;
      console.log('Zooming In:', newScale);
      return newScale;
    });
  };
  
  const handleZoomOut = () => {
    setScale(prevScale => {
      const newScale = prevScale > 0.5 ? prevScale - 0.25 : prevScale;
      console.log('Zooming Out:', newScale);
      return newScale;
    });
  };
  
  const toggleView = () => setIsFullView(!isFullView);

  const handleNextPage = () => {
    if (pageNum < pdfImages.length) setPageNum(pageNum + 1);
  };

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      <canvas ref={canvasRef} className="pdf-viewer-canvas" />
      <div className={`pdf-controls ${isFullView ? '' : 'hidden'}`}>
        <div className="zoom">
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut} disabled={scale <= 0.5}>Zoom Out</button>
        </div>
        <div className="page-info">
          <div className="pdf-pagination">
            <button onClick={handlePrevPage} disabled={pageNum <= 1}>Previous</button>
            <span>Page {pageNum} of {pdfImages.length}</span>
            <button onClick={handleNextPage} disabled={pageNum >= pdfImages.length}>Next</button>
          </div>
        </div>
      </div>
      <button className="toggle-view-btn" onClick={toggleView}>
        {isFullView ? 'Minimize View' : 'Full View'}
      </button>
    </div>
  );
};

PDFViewerIframe.propTypes = {
  pdfImages: PropTypes.array.isRequired,
};

export default PDFViewerIframe;

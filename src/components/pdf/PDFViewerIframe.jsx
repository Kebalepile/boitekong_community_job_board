import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineClose, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
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
      const dpr = window.devicePixelRatio || 1;

      const maxWidth = isFullView ? window.innerWidth : canvas.parentElement.clientWidth;
      const optimalScale = Math.min(maxWidth / pdfImage.width, 1);
      const effectiveScale = scale * optimalScale;

      const scaledWidth = pdfImage.width * effectiveScale;
      const scaledHeight = pdfImage.height * effectiveScale;

      canvas.width = scaledWidth * dpr;
      canvas.height = scaledHeight * dpr;
      canvas.style.width = `${scaledWidth}px`;
      canvas.style.height = `${scaledHeight}px`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.drawImage(pdfImage, 0, 0, scaledWidth, scaledHeight);
    };

    pdfImage.onerror = () => {
      console.error('Failed to load image:', pdfImage.src);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('Failed to load page', 10, 50);
    };
  };

  useEffect(() => {
    renderPage();
  }, [scale, isFullView, pageNum]);

  const handleZoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const handleZoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

  const handleFullView = () => setIsFullView(true);
  const handleMinimizeView = () => setIsFullView(false);

  const handleNextPage = () => {
    if (pageNum < pdfImages.length) setPageNum(pageNum + 1);
  };

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      {isFullView && (
        <div className='pdf-navbar'>
          <button className='minimize-view-btn' onClick={handleMinimizeView}>
            <AiOutlineClose />
          </button>
          <div className='zoom'>
            <button onClick={handleZoomIn}>
              <AiOutlinePlus />
            </button>
            <button onClick={handleZoomOut} disabled={scale <= 0.5}>
              <AiOutlineMinus />
            </button>
          </div>
          <div className='pdf-pagination'>
            <button onClick={handlePrevPage} disabled={pageNum <= 1}>Prev</button>
            <span>Page {pageNum} of {pdfImages.length}</span>
            <button onClick={handleNextPage} disabled={pageNum >= pdfImages.length}>Next</button>
          </div>
        </div>
      )}
      <canvas onClick={handleFullView} ref={canvasRef} className='pdf-viewer-canvas' />
    </div>
  );
};

PDFViewerIframe.propTypes = {
  pdfImages: PropTypes.array.isRequired,
};

export default PDFViewerIframe;

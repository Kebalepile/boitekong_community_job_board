import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './pdf_viewer.css'

const PDFViewerIframe = ({ pdfImages }) => {
  const [scale, setScale] = useState(1)
  const [isFullView, setIsFullView] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const canvasRef = useRef(null)

  const renderPage = () => {
    const pdfImage = new Image();
    pdfImage.src = pdfImages[pageNum - 1]; // Display the current page
  
    pdfImage.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
  
      // Calculate the dimensions with scaling and device pixel ratio
      const scaledWidth = pdfImage.width * scale;
      const scaledHeight = pdfImage.height * scale;
  
      // Set the canvas size to the scaled dimensions adjusted for device pixel ratio
      canvas.width = scaledWidth * dpr;
      canvas.height = scaledHeight * dpr;
  
      // Style the canvas to appear at the scaled size (CSS pixels)
      canvas.style.width = `${scaledWidth}px`;
      canvas.style.height = `${scaledHeight}px`;
  
      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Scale the context to match the device pixel ratio
      ctx.scale(dpr, dpr);
  
      // Draw the image onto the canvas at the correct size
      ctx.drawImage(pdfImage, 0, 0, scaledWidth, scaledHeight);
  
      // Reset scaling to ensure future drawings aren't affected
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  
    // Error handling for image loading
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
    renderPage()
    if (isFullView) {
      // Remove width and height to allow zooming in full view
      canvasRef.current.style.width = ''
      canvasRef.current.style.height = ''
    } else {
      // Set width and height to inherit when exiting full view
      canvasRef.current.style.width = 'inherit'
      canvasRef.current.style.height = 'inherit'
    }
  }, [scale, isFullView, pageNum])

  const handleZoomIn = () => {
    setScale(prevScale => prevScale + 0.25)
  }

  const handleZoomOut = () => {
    setScale(prevScale => (prevScale > 0.5 ? prevScale - 0.25 : prevScale))
  }

  const handleFullView = () => setIsFullView(true)
  const handleMinimizeView = () => setIsFullView(false)

  const handleNextPage = () => {
    if (pageNum < pdfImages.length) setPageNum(pageNum + 1)
  }

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1)
  }

  return (
    <div
      className={`pdf-viewer-container ${
        isFullView ? 'full-view' : 'min-view'
      }`}
    >
      {isFullView && (
        <div className='pdf-navbar'>
          {isFullView && (
            <button className='minimize-view-btn' onClick={handleMinimizeView}>
              close
            </button>
          )}
          <div className='zoom'>
            <button onClick={handleZoomIn}>+</button>
            <button onClick={handleZoomOut} disabled={scale <= 0.5}>
              -
            </button>
          </div>
          <div className='pdf-pagination'>
            <button onClick={handlePrevPage} disabled={pageNum <= 1}>
              Prev
            </button>
            <span>
              Page {pageNum} of {pdfImages.length}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageNum >= pdfImages.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <canvas
        onClick={handleFullView}
        ref={canvasRef}
        className='pdf-viewer-canvas'
      />
    </div>
  )
}

PDFViewerIframe.propTypes = {
  pdfImages: PropTypes.array.isRequired
}

export default PDFViewerIframe

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './pdf_viewer.css'

const PDFViewerIframe = ({ pdfImages }) => {
  const [scale, setScale] = useState(1)
  const [isFullView, setIsFullView] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const canvasRef = useRef(null)

  const renderPage = () => {
    const pdfImage = new Image()
    pdfImage.src = pdfImages[pageNum - 1] // Display the current page

    pdfImage.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      // Adjust canvas size based on image and scale
      canvas.width = pdfImage.width * scale
      canvas.height = pdfImage.height * scale

      ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear previous content
      ctx.drawImage(pdfImage, 0, 0, canvas.width, canvas.height)
    }
  }

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

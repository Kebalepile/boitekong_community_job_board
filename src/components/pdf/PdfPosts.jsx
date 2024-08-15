import React from 'react'
import PDFViewerIframe from './PDFViewerIframe'
import PropTypes from 'prop-types'
import './PdfPosts.css'

/**
 * Component to render a PDF post.
 *
 * @description This component handles the display of a PDF document within a post. It conditionally renders 
 * a PDF viewer using an iframe or a loading placeholder based on the `isLoaded` prop. When the PDF is fully loaded, 
 * indicated by `isLoaded` being true, the `PDFViewerIframe` component is displayed, rendering the PDF pages 
 * as images passed through the `pdfImages` prop. If the PDF is still loading (`isLoaded` is false), 
 * a placeholder is shown to indicate the loading state.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.pdfImages - An array of images representing the pages of the PDF to be displayed in the viewer.
 * @param {boolean} props.isLoaded - A boolean that determines the display state. 
 * If true, the PDF viewer with the PDF pages is shown; if false, a loading placeholder is displayed instead.
 * 
 * @returns {JSX.Element} A section element containing either the PDF viewer or a loading placeholder, 
 * based on the loading state of the PDF.
 */
function PdfPosts({ pdfImages, isLoaded }) {
  return (
    <section className='pdf-post'>
      {isLoaded ? (
        <div className='pdf-container'>
          <PDFViewerIframe pdfImages={pdfImages} />
        </div>
      ) : (
        <div className='placeholder pdf-container-placeholder'></div>
      )}
    </section>
  )
}

PdfPosts.propTypes = {
  pdfImages: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired,
}

export default PdfPosts

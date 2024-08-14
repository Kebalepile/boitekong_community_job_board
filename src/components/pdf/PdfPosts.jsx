import React from 'react'
import PDFViewerIframe from './PDFViewerIframe'
import PropTypes from 'prop-types'
import './PdfPosts.css'

/**
 * Component to render a PDF post.
 *
 * @description This component displays a PDF viewer or a placeholder based on the `isLoaded` prop. If `isLoaded` is true, it renders the `PDFViewerIframe` with the provided `pdfFile`. If `isLoaded` is false, it shows a placeholder indicating that the PDF is still loading.
 *
 * @param {Object} props - The component props.
 * @param {string} props.pdfFile - The URL or path of the PDF file to be displayed.
 * @param {boolean} props.isLoaded - A boolean indicating whether the PDF has finished loading. If true, the PDF viewer is displayed; otherwise, a placeholder is shown.
 * 
 * @returns {JSX.Element} A section element containing either the PDF viewer or a loading placeholder.
 */
function PdfPosts({ pdfFile, isLoaded }) {
  return (
    <section id='pdf-posts'>
      {isLoaded ? (
        <div className='pdf-container'>
          <PDFViewerIframe file={pdfFile} />
        </div>
      ) : (
        <div className='placeholder pdf-container-placeholder'></div>
      )}
    </section>
  )
}

PdfPosts.propTypes = {
  pdfFile: PropTypes.string.isRequired,
  isLoaded: PropTypes.bool.isRequired,
}

export default PdfPosts

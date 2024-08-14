import React, { useState, useEffect } from 'react'
import PDFViewerIframe from '../pdf/PDFViewerIframe'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import useRenderPosts from "../../hooks/useRenderPost"
import {formatDetails} from "../../utils/functions"
import pdfUrls from '../../assets/pdfs/pdfUrls.json'
import minopexData from '../../assets/private/minopex.json'
import sayouthData from '../../assets/private/SA-Youth.json'
import propersonnelData from '../../assets/private/Pro-Personnel.json'
import govPagePublicData from '../../assets/public/govpage-public-sector.json'
import govPagePrivateData from '../../assets/public/govpage-private-sector.json'

import './home.css'
import './posts.css'

// Constants
const POSTS_PER_PAGE = 6

export default function HomePage () {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPdfContainerLoaded] = useLoadingPlaceholder(5000)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    // Check if the modal is visible
    if (selectedPost) {
      const applyLink = document.querySelector('.modal a.btn.btn-primary');
      if (applyLink) {
        applyLink.remove(); // Remove the apply link
      }
    }
  }, [selectedPost]); // Run this effect whenever selectedPost changes

  // All data combined for pagination
  const allData = [
    ...pdfUrls.pdfUrls.map((pdfUrl, index) => ({
      type: 'pdf',
      id: `pdf-${index}`,
      url: pdfUrl
    })),
    ...minopexData.blogPosts.map((post, index) => ({...post, type: 'post', id: `minopex-${index}`})),
    ...sayouthData.blogPosts.map((post, index) => ({...post, type: 'post', id: `sayouth-${index}`})),
    ...propersonnelData.blogPosts.map((post, index) => ({...post, type: 'post', id: `propersonnel-${index}`})),
    ...govPagePublicData.blogPosts.map((post, index) => ({...post, type: 'post', id: `govpublic-${index}`})),
    ...govPagePrivateData.blogPosts.map((post, index) => ({...post, type: 'post', id: `govprivate-${index}`}))
  ]

  // Total pages based on combined data
  const totalPages = Math.ceil(allData.length / POSTS_PER_PAGE)

  // Get the posts for the current page
  const paginatedData = allData.slice(currentPage * POSTS_PER_PAGE, (currentPage + 1) * POSTS_PER_PAGE)

  // Pagination logic
  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePostClick = post => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  return (
    <div>
      {paginatedData.map(item => {
        if (item.type === 'pdf') {
          return (
            <PdfPosts
              key={item.id}
              pdfFile={item.url}
              isLoaded={isPdfContainerLoaded}
            />
          )
        } else {
          return (
            <PostItem
              key={item.id}
              post={item}
              onPostClick={handlePostClick}
            />
          )
        }
      })}

      <div className='pagination'>
        <button onClick={handlePrevClick} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className='modal' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <span className='close' onClick={handleCloseModal}>
              &times;
            </span>
            <div className='modal-body'>
              <img
                src={selectedPost.imgSrc || selectedPost.iconLink}
                alt='company logo'
              />
              <h2>{selectedPost.title || selectedPost.jobTitle}</h2>

              <div
                className='details'
                dangerouslySetInnerHTML={{
                  __html: selectedPost?.details
                    ? selectedPost.details
                    : formatDetails(selectedPost?.content || '')
                }}
              />
              {selectedPost.apply && (
                <a
                  href={selectedPost?.apply}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='apply'
                >
                  Apply
                </a>
              )}
              {selectedPost.href && (
                <a
                  href={selectedPost?.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='source-btn'
                >
                  Original Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PostItem({ post, onPostClick }) {
  return useRenderPosts([post], onPostClick)
}

function PdfPosts ({ pdfFile, isLoaded }) {
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

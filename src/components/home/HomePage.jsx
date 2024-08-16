import React, { useState, useEffect } from 'react'
import Pagination from '../pagination/Pagination'
import Posts from '../posts/Posts'
import { combineAllData, formatDetails } from '../../utils/functions'
import pdfMetadata from '../../assets/pdf_images/metadata.json'
import minopexData from '../../assets/private/minopex.json'
import sayouthData from '../../assets/private/SA-Youth.json'
import propersonnelData from '../../assets/private/Pro-Personnel.json'
import govPagePublicData from '../../assets/public/govpage-public-sector.json'
import govPagePrivateData from '../../assets/public/govpage-private-sector.json'
import './home.css'

const POSTS_PER_PAGE = 10

/**
 * HomePage component is the main page that displays a list of posts with pagination.
 * It manages the current page state, handles post clicks to open a modal, and removes the apply link from the modal if necessary.
 *
 * @component
 */
export default function HomePage () {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    if (selectedPost) {
      const applyLink = document.querySelector('.modal a.btn.btn-primary')
      if (applyLink) {
        applyLink.remove()
      }
    }
  }, [selectedPost])

  // Combine all data from different sources
  const allData = combineAllData(
    pdfMetadata,
    govPagePublicData,
    minopexData,
    sayouthData,
    govPagePrivateData,
    propersonnelData
  )

  // Calculate the total number of pages based on the combined data
  const totalPages = Math.ceil(allData.length / POSTS_PER_PAGE)

  // Get the posts for the current page
  const paginatedData = allData.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  /**
   * Handles page change for the pagination component.
   * @param {number} pageNumber - The number of the page to navigate to.
   */
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  /**
   * Handles the click event on a post item to display the modal.
   * @param {object} post - The selected post data.
   */
  const handlePostClick = post => {
    setSelectedPost(post)
  }

  /**
   * Closes the modal by setting the selectedPost state to null.
   */
  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  return (
    <div>
      <Posts paginatedData={paginatedData} onPostClick={handlePostClick} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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

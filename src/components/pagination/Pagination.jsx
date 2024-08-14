import React from 'react'
import PropTypes from 'prop-types'
import './pagination.css'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePageNumbers = () => {
    const pageNumbers = []
    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages, startPage + 3)

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className='pagination'>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {generatePageNumbers().map(page => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  )
}

// Define the prop types
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  }
  
export default Pagination

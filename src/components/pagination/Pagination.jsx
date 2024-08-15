import React from 'react';
import PropTypes from 'prop-types';
import './pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 3);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    onPageChange(page);

    // Scroll #posts into view after page change
    const postsElement = document.getElementById('posts');
    if (postsElement) {
      postsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='pagination'>
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {generatePageNumbers().map(page => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

// Define the prop types
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;

import React from 'react'
import PropTypes from 'prop-types'
import PdfPosts from '../pdf/PdfPosts'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import useRenderPosts from '../../hooks/useRenderPost'
import './posts.css'

/**
 * Posts component renders a list of posts, handling both PDF and non-PDF types.
 * It maps through the paginated data and displays each post accordingly.
 *
 * @param {Array} paginatedData - Array of post objects to be displayed on the current page.
 * @param {Function} onPostClick - Function to handle the click event on a post item.
 */
export default function Posts({ paginatedData, onPostClick }) {
  const [isPdfContainerLoaded] = useLoadingPlaceholder(5000)

  return (
    <div id="posts">
      {paginatedData.map((item) => {
        if (item.type === 'pdf') {
          return (
            <PdfPosts
              key={item.id}
              pdfImages={item.pdfImages}
              isLoaded={isPdfContainerLoaded}
            />
          )
        } else {
          return (
            <PostItem key={item.id} post={item} onPostClick={onPostClick} />
          )
        }
      })}
    </div>
  )
}

Posts.propTypes = {
  paginatedData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      pdfImages: PropTypes.array,
      imgSrc: PropTypes.string,
      iconLink: PropTypes.string,
      title: PropTypes.string,
      jobTitle: PropTypes.string,
      details: PropTypes.string,
      content: PropTypes.string,
      apply: PropTypes.string,
      href: PropTypes.string
    })
  ).isRequired,
  onPostClick: PropTypes.func.isRequired
}

/**
 * PostItem component renders a single post item using the useRenderPosts hook.
 *
 * @param {Object} post - The post object containing information to be displayed.
 * @param {Function} onPostClick - Function to handle the click event on a post item.
 */
function PostItem({ post, onPostClick }) {
  return useRenderPosts([post], onPostClick)
}

PostItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    pdfImages: PropTypes.array,
    imgSrc: PropTypes.string,
    iconLink: PropTypes.string,
    title: PropTypes.string,
    jobTitle: PropTypes.string,
    details: PropTypes.string,
    content: PropTypes.string,
    apply: PropTypes.string,
    href: PropTypes.string
  }).isRequired,
  onPostClick: PropTypes.func.isRequired
}

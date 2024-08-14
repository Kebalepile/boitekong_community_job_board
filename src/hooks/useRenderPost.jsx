import React from 'react'

/**
 * Custom hook to render a list of job posts.
 *
 * @description This hook takes an array of posts and an onClick handler. It returns a memoized section element containing a list of articles, each representing a job post with a logo, title, summary, and a "read more" button. The hook uses React's `useMemo` to avoid unnecessary re-renders when the posts or onClick handler do not change.
 *
 * @param {Array<Object>} posts - An array of post objects to be rendered. Each object should contain properties like `imgSrc`, `iconLink`, `title`, `jobTitle`, `details`, or `content`.
 * @param {function} onClick - A function to handle the click event on a post. This function will be called with the post object as its argument when the "read more" button or article is clicked.
 * 
 * @returns {JSX.Element} A memoized section element containing the rendered list of job posts, or an empty fragment if the posts array is empty.
 */
function useRenderPosts (posts, onClick) {
  const renderedPosts = React.useMemo(() => {
    if (posts.length === 0) {
      return <></>
    }

    return (
      <section>
        {posts.map((p, i) => (
          <article className='job-post' key={i} onClick={() => onClick(p)}>
            <div className='company-logo'>
              <img
                loading='lazy'
                src={p.imgSrc || p.iconLink}
                alt='company logo'
              />
            </div>
            <p className='title'>{p?.title || p?.jobTitle}</p>
            <div
              className='summary'
              dangerouslySetInnerHTML={{ __html: p?.details || p?.content }}
            />
            <button className='read-more-button' onClick={() => onClick(p)}>
              read more
            </button>
          </article>
        ))}
      </section>
    )
  }, [posts, onClick])

  return renderedPosts
}

export default useRenderPosts

import React from 'react'

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

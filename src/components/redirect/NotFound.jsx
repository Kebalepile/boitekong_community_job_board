import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbError404 } from 'react-icons/tb'
import './redirect.css'

/**
 * Component to display a "Not Found" message and redirect to the home page after a delay.
 *
 * @description This component shows a 404 error message and an icon indicating a page not found. 
 *              After 3 seconds, it automatically redirects the user to the home page.
 *
 * @returns {JSX.Element} A div element containing a 404 error icon, a heading, and a message 
 *                        indicating redirection to the home page.
 */

function NotFound () {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='not-found'>
      <TbError404 className='img-404' />
      <h1>tlhogela go kgotlakgotla!</h1>
      <p>Redirecting to home page...</p>
    </div>
  )
}

export default NotFound

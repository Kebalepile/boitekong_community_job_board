import React, { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './hooks/Layout'
import './App.css'

const Home = lazy(() => import('./components/home/Home'))
const Vacancies = lazy(() => import('./components/home/HomePage'))
const NotFound = lazy(() => import('./components/redirect/NotFound'))

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path='/vacancies'
          element={
            <Layout>
              <Vacancies />
            </Layout>
          }
        />
       
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

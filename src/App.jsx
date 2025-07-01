import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './navbar.jsx'
import Home from './home.jsx'
import './Home.css'

function App() {


  return (
    <>
      <img src="./src/images/logo.jpg" alt="Logo" className='logo' />
      <Navbar />
      <Home />
    </>
  )
}

export default App

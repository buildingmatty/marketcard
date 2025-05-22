import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './navbar.jsx'
import Home from './home.jsx'
import imgLogo from './images/logo.jpg'

function App() {
  const imgLogo = "./images/logo.jpg"

  return (
    <>
      <img src="./images/logo.jpg" alt="Logo" />
      <Navbar />
      <Home />
    </>
  )
}

export default App

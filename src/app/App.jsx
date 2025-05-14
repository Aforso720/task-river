import React from 'react'
import '../app/App.scss'
import {Routes , Route } from 'react-router'
import Header from '../widgets/Header'
import Footer from '../widgets/Footer'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Tariffs from '../pages/Tariffs/Tariffs'
import Updates from '../pages/Updates/Updates'

function App() {
  return (
   <div className='App flex justify-between flex-col items-center'>
    <Header/>
    <main className='flex justify-center items-center'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/tariffs' element={<Tariffs/>}/>
        <Route path='/education' element={null}/>
        <Route path='/updates' element={<Updates/>}/>
      </Routes>
    </main>
    <Footer/>
   </div>
  )
}

export default App

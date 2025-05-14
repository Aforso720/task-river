import React from 'react'
import './infoPage.scss'

function InfoPage({texth2 , texth3}) {
  return (
    <header className='infoPage flex flex-col justify-center items-center'>
                <h2>{texth2}</h2>
                <h3>{texth3}</h3>
    </header>
  )
}

export default InfoPage

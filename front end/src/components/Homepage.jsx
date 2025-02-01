import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Benefits from './Benefits'
import Services from './Services'
import Pricing from './Pricing'
import Roadmap from './Roadmap'
import Footer from './Footer'
import Collaboration from './Collaboration'

export const Homepage = () => {
  return (
    <div>
      <Hero />
      <Benefits />
      {/* <Collaboration /> */}
      {/* <Services /> */}
      <Pricing />
      {/* <Roadmap /> */}
    </div>
  )
}

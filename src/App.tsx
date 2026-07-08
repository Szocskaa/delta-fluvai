import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { LanguageProvider } from './i18n'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import CTABanner from './components/CTABanner'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Process from './components/Process'
import Work from './components/Work'
import Approach from './components/Approach'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const finishLoading = useCallback(() => setIsLoading(false), [])

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {isLoading && <LoadingScreen onComplete={finishLoading} />}
        </AnimatePresence>
        <ScrollProgress />
        <Nav />
        <main>
          <Hero started={!isLoading} />
          <Problem />
          <Process />
          <Work />
          <CTABanner />
          <Approach />
          <Pricing />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </LanguageProvider>
  )
}

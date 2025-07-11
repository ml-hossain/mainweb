import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import SuccessStories from './pages/SuccessStories'
import Consultation from './pages/Consultation'
import Contact from './pages/Contact'
import Universities from './pages/Universities'
import UniversityPage from './pages/UniversityPage'
import UniversitySelection from './pages/services/UniversitySelection'
import ApplicationAssistance from './pages/services/ApplicationAssistance'
import ScholarshipGuidance from './pages/services/ScholarshipGuidance'
import VisaProcessing from './pages/services/VisaProcessing'
import TestPreparation from './pages/services/TestPreparation'
import PreDepartureOrientation from './pages/services/PreDepartureOrientation'
import InterviewPreparation from './pages/services/InterviewPreparation'
import DocumentationSupport from './pages/services/DocumentationSupport'
import FloatingContactButton from './components/FloatingContactButton'
import AdminApp from './admin/AdminApp'
import ContentDemo from './pages/ContentDemo'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import SEOToolPage from './pages/SEOTool'
import SEODemo from './pages/SEODemo'
import SEOTestHelper from './components/SEOTestHelper'

// Layout component for public pages
const PublicLayout = ({ children }) => {
  const location = useLocation()
  const hideFooter = location.pathname.startsWith('/admin')
  return (
    <>
    <Navbar />
      <main className="pt-20">{children}</main>
    <FloatingContactButton />
      {!hideFooter && <Footer />}
    </>
)
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SEOTestHelper />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/success-stories" element={<PublicLayout><SuccessStories /></PublicLayout>} />
        <Route path="/consultation" element={<PublicLayout><Consultation /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/universities" element={<PublicLayout><Universities /></PublicLayout>} />
        <Route path="/universities/:slug" element={<PublicLayout><UniversityPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
            <Route path="/seo-tool" element={<SEOToolPage />} />
            <Route path="/seo-demo" element={<PublicLayout><SEODemo /></PublicLayout>} />

        {/* Services Sub-routes */}
        <Route path="/services/university-selection" element={<PublicLayout><UniversitySelection /></PublicLayout>} />
        <Route path="/services/application-assistance" element={<PublicLayout><ApplicationAssistance /></PublicLayout>} />
        <Route path="/services/scholarship-guidance" element={<PublicLayout><ScholarshipGuidance /></PublicLayout>} />
        <Route path="/services/visa-processing" element={<PublicLayout><VisaProcessing /></PublicLayout>} />
        <Route path="/services/test-preparation" element={<PublicLayout><TestPreparation /></PublicLayout>} />
        <Route path="/services/pre-departure-orientation" element={<PublicLayout><PreDepartureOrientation /></PublicLayout>} />
        <Route path="/services/interview-preparation" element={<PublicLayout><InterviewPreparation /></PublicLayout>} />
        <Route path="/services/documentation-support" element={<PublicLayout><DocumentationSupport /></PublicLayout>} />
        
        {/* Content Demo */}
        <Route path="/content-demo" element={<PublicLayout><ContentDemo /></PublicLayout>} />

        {/* Admin Panel */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  )
}

export default App

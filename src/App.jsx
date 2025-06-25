import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import SuccessStories from './pages/SuccessStories.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Consultation from './pages/Consultation.jsx'
import UniversitySelection from './pages/services/UniversitySelection.jsx'
import ApplicationAssistance from './pages/services/ApplicationAssistance.jsx'
import VisaProcessing from './pages/services/VisaProcessing.jsx'
import ScholarshipGuidance from './pages/services/ScholarshipGuidance.jsx'
import PreDepartureOrientation from './pages/services/PreDepartureOrientation.jsx'
import TestPreparation from './pages/services/TestPreparation.jsx'
import InterviewPreparation from './pages/services/InterviewPreparation.jsx'
import DocumentationSupport from './pages/services/DocumentationSupport.jsx'
import FloatingContactButton from './components/FloatingContactButton.jsx'
import AdminApp from './admin/AdminApp.jsx'

// Layout component for public pages
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      {children}
    </main>
    <FloatingContactButton />
  </div>
)

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Admin Routes - No navbar for admin */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public Routes - With navbar */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/success-stories" element={<PublicLayout><SuccessStories /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/consultation" element={<PublicLayout><Consultation /></PublicLayout>} />
        <Route path="/services/university-selection" element={<PublicLayout><UniversitySelection /></PublicLayout>} />
        <Route path="/services/application-assistance" element={<PublicLayout><ApplicationAssistance /></PublicLayout>} />
        <Route path="/services/visa-processing" element={<PublicLayout><VisaProcessing /></PublicLayout>} />
        <Route path="/services/scholarship-guidance" element={<PublicLayout><ScholarshipGuidance /></PublicLayout>} />
        <Route path="/services/pre-departure-orientation" element={<PublicLayout><PreDepartureOrientation /></PublicLayout>} />
        <Route path="/services/test-preparation" element={<PublicLayout><TestPreparation /></PublicLayout>} />
        <Route path="/services/interview-preparation" element={<PublicLayout><InterviewPreparation /></PublicLayout>} />
        <Route path="/services/documentation-support" element={<PublicLayout><DocumentationSupport /></PublicLayout>} />
      </Routes>
    </Router>
  )
}

export default App

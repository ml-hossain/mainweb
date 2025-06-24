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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/services/university-selection" element={<UniversitySelection />} />
            <Route path="/services/application-assistance" element={<ApplicationAssistance />} />
            <Route path="/services/visa-processing" element={<VisaProcessing />} />
            <Route path="/services/scholarship-guidance" element={<ScholarshipGuidance />} />
            <Route path="/services/pre-departure-orientation" element={<PreDepartureOrientation />} />
            <Route path="/services/test-preparation" element={<TestPreparation />} />
            <Route path="/services/interview-preparation" element={<InterviewPreparation />} />
            <Route path="/services/documentation-support" element={<DocumentationSupport />} />
          </Routes>
        </main>
        <FloatingContactButton />
      </div>
    </Router>
  )
}

export default App

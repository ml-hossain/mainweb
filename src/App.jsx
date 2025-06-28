import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import SuccessStories from './pages/SuccessStories.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Consultation from './pages/Consultation.jsx'
import Universities from './pages/Universities.jsx'
import UniversityDetail from './pages/UniversityDetail.jsx'
import UniversitySelection from './pages/services/UniversitySelection.jsx'
import ApplicationAssistance from './pages/services/ApplicationAssistance.jsx'
import VisaProcessing from './pages/services/VisaProcessing.jsx'
import ScholarshipGuidance from './pages/services/ScholarshipGuidance.jsx'
import PreDepartureOrientation from './pages/services/PreDepartureOrientation.jsx'
import TestPreparation from './pages/services/TestPreparation.jsx'
import InterviewPreparation from './pages/services/InterviewPreparation.jsx'
import DocumentationSupport from './pages/services/DocumentationSupport.jsx'
import FloatingContactButton from './components/FloatingContactButton.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import { Suspense, lazy } from 'react'

// Lazy load admin app
const AdminApp = lazy(() => import('./admin/AdminApp'))

// Layout component for public pages
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <FloatingContactButton />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Admin Routes - Lazy loaded */}
        <Route 
          path="/admin/*" 
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <AdminApp />
            </Suspense>
          } 
        />

        {/* Public Routes - With navbar */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/success-stories" element={<PublicLayout><SuccessStories /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/consultation" element={<PublicLayout><Consultation /></PublicLayout>} />
        <Route path="/universities" element={<PublicLayout><Universities /></PublicLayout>} />
        <Route path="/universities/:id" element={<PublicLayout><UniversityDetail /></PublicLayout>} />
        <Route path="/services/university-selection" element={<PublicLayout><UniversitySelection /></PublicLayout>} />
        <Route path="/services/application-assistance" element={<PublicLayout><ApplicationAssistance /></PublicLayout>} />
        <Route path="/services/visa-processing" element={<PublicLayout><VisaProcessing /></PublicLayout>} />
        <Route path="/services/scholarship-guidance" element={<PublicLayout><ScholarshipGuidance /></PublicLayout>} />
        <Route path="/services/pre-departure-orientation" element={<PublicLayout><PreDepartureOrientation /></PublicLayout>} />
        <Route path="/services/test-preparation" element={<PublicLayout><TestPreparation /></PublicLayout>} />
        <Route path="/services/interview-preparation" element={<PublicLayout><InterviewPreparation /></PublicLayout>} />
        <Route path="/services/documentation-support" element={<PublicLayout><DocumentationSupport /></PublicLayout>} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App

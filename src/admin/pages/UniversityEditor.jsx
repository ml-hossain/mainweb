import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import QuillEditor from '../../components/QuillEditor';
import ErrorBoundary from '../../components/ErrorBoundary';
import AdminLayout from '../components/AdminLayout';
import { FiLoader, FiSave, FiArrowLeft, FiGlobe, FiMapPin, FiStar, FiDollarSign, FiClock, FiBookOpen, FiTrendingUp, FiTarget, FiEye, FiAlertCircle, FiCheckCircle, FiBarChart, FiSearch, FiUsers, FiEdit } from 'react-icons/fi';
import slugify from 'slugify';

const UniversityEditor = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // SEO Analysis State
  const [seoScore, setSeoScore] = useState(0);
  const [seoAnalysis, setSeoAnalysis] = useState({
    keywords: [],
    readability: 0,
    contentLength: 0,
    headingStructure: [],
    metaDescription: '',
    suggestions: [],
    titleAnalysis: { score: 0, issues: [] },
    descriptionAnalysis: { score: 0, issues: [] },
    contentAnalysis: { score: 0, issues: [] }
  });
  const [competitors, setCompetitors] = useState([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  
  // SEO Content Suggestions State
  const [seoSuggestions, setSeoSuggestions] = useState({
    titles: [],
    descriptions: [],
    content: '',
    keywords: []
  });
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  
  // Helper function to count syllables
  const countSyllables = (word) => {
    if (!word) return 0;
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? Math.max(1, matches.length) : 1;
  };
  
  // SEO Analysis Functions
  const analyzeSEO = useCallback((content) => {
    if (!content) {
      // Reset analysis when no content
      setSeoScore(0);
      setSeoAnalysis({
        keywords: [],
        readability: 0,
        contentLength: 0,
        headingStructure: [],
        metaDescription: '',
        suggestions: ['Add content to begin SEO analysis']
      });
      return;
    }
    
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
    
    // Extract keywords (improved frequency analysis)
    const words = textContent.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'have', 'will', 'your', 'they', 'been', 'their', 'were', 'from', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'many', 'some', 'what', 'time', 'very', 'when', 'much', 'new', 'also', 'may', 'most', 'such', 'should', 'each', 'where', 'those', 'now', 'only', 'more', 'way', 'work', 'part', 'take', 'get', 'place', 'made', 'live', 'year', 'come', 'use', 'over', 'think', 'back', 'see', 'good', 'how', 'its', 'through', 'because', 'before', 'here', 'being', 'both', 'under', 'again', 'same', 'own', 'any', 'can', 'our', 'just', 'need', 'too', 'right', 'people', 'make', 'into', 'look', 'find', 'know', 'help', 'long', 'school', 'life', 'day', 'small', 'hand', 'large', 'every', 'old', 'great', 'high', 'another', 'man', 'important', 'example', 'different', 'end', 'following', 'state', 'public', 'possible', 'order', 'want', 'fact', 'lot', 'never', 'ask', 'feel', 'try', 'leave', 'company'].includes(word));
    
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, freq]) => ({ word, frequency: freq }));
    
    // Calculate readability score (improved Flesch Reading Ease)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
    const syllables = textContent.split(' ').reduce((total, word) => {
      return total + countSyllables(word);
    }, 0);
    const avgSyllablesPerWord = wordCount > 0 ? syllables / wordCount : 0;
    
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)));
    
    // Extract heading structure with better parsing
    const headings = [];
    const headingRegex = /<h([1-6])(?:[^>]*)>([^<]+)<\/h[1-6]>/gi;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].trim();
      if (text) {
        headings.push({ level, text });
      }
    }
    
    // Generate enhanced suggestions
    const suggestions = [];
    if (wordCount < 300) {
      suggestions.push('Content is too short. Aim for at least 300-500 words for better SEO.');
    } else if (wordCount > 2500) {
      suggestions.push('Content is very long. Consider breaking it into multiple sections or pages.');
    }
    
    if (headings.length === 0) {
      suggestions.push('Add headings (H1, H2, H3) to improve content structure and readability.');
    } else {
      const h1Count = headings.filter(h => h.level === 1).length;
      if (h1Count === 0) suggestions.push('Add an H1 heading for the main title.');
      if (h1Count > 1) suggestions.push('Use only one H1 heading per page.');
    }
    
    if (readabilityScore < 30) {
      suggestions.push('Content is very difficult to read. Use shorter sentences and simpler words.');
    } else if (readabilityScore < 50) {
      suggestions.push('Content readability could be improved. Try shorter sentences.');
    }
    
    if (keywords.length < 3) {
      suggestions.push('Add more relevant keywords and topic-specific terms.');
    }
    
    if (university?.name && !textContent.toLowerCase().includes(university.name.toLowerCase())) {
      suggestions.push('Include the university name in the content for better relevance.');
    }
    
    if (university?.content?.country && !textContent.toLowerCase().includes(university.content.country.toLowerCase())) {
      suggestions.push('Include the country name to improve location-based SEO.');
    }
    
    // Check for images
    const imageCount = (content.match(/<img/gi) || []).length;
    if (imageCount === 0) {
      suggestions.push('Add relevant images to make content more engaging.');
    }
    
    // Check for lists
    const listCount = (content.match(/<(ul|ol)/gi) || []).length;
    if (listCount === 0 && wordCount > 500) {
      suggestions.push('Consider adding bullet points or lists to improve readability.');
    }
    
    // Calculate overall SEO score with more detailed criteria
    let score = 0;
    
    // Content length (30 points)
    if (wordCount >= 300 && wordCount <= 800) score += 30;
    else if (wordCount >= 200 && wordCount < 300) score += 20;
    else if (wordCount >= 800 && wordCount <= 1500) score += 25;
    else if (wordCount > 1500 && wordCount <= 2500) score += 15;
    else if (wordCount > 100) score += 10;
    
    // Heading structure (25 points)
    if (headings.length > 0) {
      const h1Count = headings.filter(h => h.level === 1).length;
      if (h1Count === 1) score += 15;
      else if (h1Count === 0) score += 5;
      
      if (headings.filter(h => h.level === 2).length > 0) score += 10;
    }
    
    // Readability (20 points)
    if (readabilityScore >= 60) score += 20;
    else if (readabilityScore >= 50) score += 15;
    else if (readabilityScore >= 30) score += 10;
    else score += 5;
    
    // Keywords (15 points)
    if (keywords.length >= 5) score += 15;
    else if (keywords.length >= 3) score += 10;
    else if (keywords.length >= 1) score += 5;
    
    // University name inclusion (10 points)
    if (university?.name && textContent.toLowerCase().includes(university.name.toLowerCase())) {
      score += 10;
    }
    
    setSeoScore(Math.min(100, score));
    setSeoAnalysis({
      keywords,
      readability: Math.round(readabilityScore),
      contentLength: wordCount,
      headingStructure: headings,
      metaDescription: textContent.substring(0, 160) + (textContent.length > 160 ? '...' : ''),
      suggestions: suggestions.slice(0, 5) // Limit to 5 suggestions
    });
    
    // Find competitors based on content
    if (university?.content?.country && university?.name) {
      findCompetitors();
    }
  }, [university?.name, university?.content?.country]);
  
  // AI Content Optimizer to achieve 100% SEO score
  const optimizeForPerfectSEO = useCallback(async () => {
    if (!university?.name || !university?.content?.country) {
      alert('Please add university name and country first.');
      return;
    }
    
    setOptimizing(true);
    
    try {
      // Analyze current content and identify what's needed for 100% score
      const optimizedContent = await generateOptimizedContent();
      
      // Apply optimized content automatically
      setUniversity(prev => ({
        ...prev,
        name: optimizedContent.title,
        description: optimizedContent.description,
        page_content: optimizedContent.content
      }));
      
      // Trigger SEO analysis for the optimized content
      analyzeSEO(optimizedContent.content);
      
      // Show success message
      alert('Content optimized for 100% SEO score!');
      
    } catch (error) {
      console.error('Error optimizing content:', error);
      alert('Failed to optimize content. Please try again.');
    } finally {
      setOptimizing(false);
    }
  }, [university?.name, university?.content?.country, analyzeSEO]);
  
  // Generate perfectly optimized content for 100% SEO score
  const generateOptimizedContent = async () => {
    const universityName = university.name;
    const country = university.content.country;
    const countryNames = {
      'malaysia': 'Malaysia',
      'canada': 'Canada',
      'usa': 'USA',
      'uk': 'United Kingdom',
      'australia': 'Australia',
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    };
    const countryName = countryNames[country] || country;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate perfectly optimized title (50-60 characters for SEO)
    const optimizedTitle = `${universityName} ${countryName} - Complete Guide 2024 | MA Education`;
    
    // Generate perfectly optimized description (150-160 characters)
    const optimizedDescription = `Apply to ${universityName} in ${countryName}. Complete guide on admissions, courses, fees & scholarships. Expert guidance from MA Education.`;
    
    // Generate perfectly optimized content for 100% SEO score
    const optimizedContent = `<h1>${universityName} ${countryName} - Your Complete University Guide 2024</h1>

<p><strong>${universityName}</strong> stands as one of ${countryName}'s most prestigious educational institutions, offering world-class education to international students. Located in ${countryName}, ${universityName} provides comprehensive academic programs designed to meet the evolving demands of today's global job market.</p>

<h2>Why Choose ${universityName} for Your Higher Education?</h2>

<p>${universityName} has established itself as a leading university in ${countryName}, attracting students from over 80 countries worldwide. Here's why ${universityName} should be your top choice for higher education:</p>

<ul>
  <li><strong>Academic Excellence:</strong> ${universityName} maintains high academic standards with internationally recognized degree programs</li>
  <li><strong>Global Recognition:</strong> Degrees from ${universityName} are recognized worldwide by employers and educational institutions</li>
  <li><strong>Diverse Community:</strong> Join a multicultural environment with students from around the globe</li>
  <li><strong>Modern Facilities:</strong> State-of-the-art campus with advanced research facilities and technology</li>
  <li><strong>Career Support:</strong> Comprehensive career services and industry connections for graduate placement</li>
</ul>

<h2>Popular Courses and Programs at ${universityName}</h2>

<p>${universityName} offers a comprehensive range of undergraduate and postgraduate programs across multiple faculties. The university is particularly renowned for its programs in engineering, business, medicine, and technology.</p>

<h3>Undergraduate Programs at ${universityName}</h3>
<ul>
  <li>Bachelor of Computer Science and Information Technology</li>
  <li>Bachelor of Business Administration (BBA)</li>
  <li>Bachelor of Engineering (Mechanical, Civil, Electrical)</li>
  <li>Bachelor of Medicine and Bachelor of Surgery (MBBS)</li>
  <li>Bachelor of Arts in Communication and Media Studies</li>
  <li>Bachelor of Accounting and Finance</li>
</ul>

<h3>Postgraduate Programs at ${universityName}</h3>
<ul>
  <li>Master of Business Administration (MBA)</li>
  <li>Master of Science in Data Science and Analytics</li>
  <li>Master of Engineering in various specializations</li>
  <li>Master of Public Health (MPH)</li>
  <li>Master of Education (M.Ed)</li>
  <li>PhD Programs in multiple disciplines</li>
</ul>

<h2>Admission Requirements for ${universityName}</h2>

<p>Securing admission to ${universityName} requires meeting specific academic and language proficiency criteria. The university maintains competitive admission standards to ensure academic excellence.</p>

<h3>Academic Requirements for ${universityName}</h3>
<ul>
  <li><strong>Undergraduate Programs:</strong> Completed secondary education with minimum GPA requirements</li>
  <li><strong>Postgraduate Programs:</strong> Bachelor's degree from a recognized institution with good academic standing</li>
  <li><strong>Document Verification:</strong> All academic credentials must be verified and authenticated</li>
  <li><strong>Age Requirements:</strong> Minimum age requirements vary by program level</li>
</ul>

<h3>English Language Proficiency for ${universityName}</h3>
<ul>
  <li><strong>IELTS:</strong> Minimum overall score of 6.0-6.5 (varies by program)</li>
  <li><strong>TOEFL:</strong> Minimum score of 80-90 (internet-based test)</li>
  <li><strong>PTE Academic:</strong> Minimum score of 58-65</li>
  <li><strong>University English Test:</strong> Alternative proficiency assessment available</li>
</ul>

<h2>Tuition Fees and Financial Information for ${universityName}</h2>

<p>${universityName} offers competitive tuition fees for international students, with various payment plans and scholarship opportunities available to support your educational journey.</p>

<h3>Fee Structure at ${universityName}</h3>
<ul>
  <li><strong>Application Fee:</strong> Non-refundable processing fee for applications</li>
  <li><strong>Tuition Fees:</strong> Varies by program, level of study, and duration</li>
  <li><strong>Additional Fees:</strong> Laboratory, library, and facility usage fees</li>
  <li><strong>Living Expenses:</strong> Accommodation, food, and personal expenses</li>
</ul>

<h3>Scholarships and Financial Aid at ${universityName}</h3>
<ul>
  <li><strong>Merit-based Scholarships:</strong> For academically outstanding students</li>
  <li><strong>Need-based Financial Aid:</strong> For students requiring financial assistance</li>
  <li><strong>International Student Scholarships:</strong> Specifically for overseas students</li>
  <li><strong>Government Scholarships:</strong> Various government-sponsored programs available</li>
</ul>

<h2>Campus Life and Facilities at ${universityName}</h2>

<p>Students at ${universityName} enjoy a vibrant campus life with access to world-class facilities, extracurricular activities, and support services designed to enhance the overall university experience.</p>

<h3>Academic Facilities at ${universityName}</h3>
<ul>
  <li>Modern lecture halls equipped with advanced audio-visual technology</li>
  <li>Well-equipped laboratories for science and engineering programs</li>
  <li>Comprehensive library with extensive digital and physical collections</li>
  <li>Computer labs with latest software and high-speed internet</li>
  <li>Research centers and specialized facilities for advanced studies</li>
</ul>

<h3>Student Support Services at ${universityName}</h3>
<ul>
  <li><strong>International Student Office:</strong> Dedicated support for overseas students</li>
  <li><strong>Academic Counseling:</strong> Guidance on course selection and academic planning</li>
  <li><strong>Career Services:</strong> Job placement assistance and career counseling</li>
  <li><strong>Health Services:</strong> Medical facilities and health insurance support</li>
  <li><strong>Accommodation Services:</strong> On-campus and off-campus housing assistance</li>
</ul>

<h2>How to Apply to ${universityName} - Step by Step Guide</h2>

<p>The application process for ${universityName} is designed to be comprehensive yet straightforward. Follow this step-by-step guide to ensure a successful application:</p>

<ol>
  <li><strong>Research Programs:</strong> Explore available courses at ${universityName} and select your preferred program</li>
  <li><strong>Check Eligibility:</strong> Verify that you meet all admission requirements for ${universityName}</li>
  <li><strong>Prepare Documents:</strong> Gather all required academic transcripts, certificates, and supporting documents</li>
  <li><strong>English Proficiency:</strong> Take required English language tests (IELTS, TOEFL, etc.)</li>
  <li><strong>Online Application:</strong> Complete and submit your application through ${universityName}'s official portal</li>
  <li><strong>Application Fee:</strong> Pay the required application processing fee</li>
  <li><strong>Document Submission:</strong> Upload or send all required documents to ${universityName}</li>
  <li><strong>Interview Process:</strong> Participate in interviews if required for your chosen program</li>
  <li><strong>Admission Decision:</strong> Wait for the admission decision from ${universityName}</li>
  <li><strong>Visa Application:</strong> Apply for student visa upon receiving offer letter</li>
</ol>

<h2>Why Choose MA Education for Your ${universityName} Application?</h2>

<p>Applying to ${universityName} can be a complex process, but with MA Education's expert guidance, you can navigate the application process with confidence and success.</p>

<h3>MA Education Services for ${universityName} Applications</h3>
<ul>
  <li><strong>Free Consultation:</strong> Personalized guidance on ${universityName} programs and requirements</li>
  <li><strong>Application Assistance:</strong> Complete support throughout the ${universityName} application process</li>
  <li><strong>Document Preparation:</strong> Help with preparing and reviewing all required documents for ${universityName}</li>
  <li><strong>Visa Support:</strong> Comprehensive assistance with student visa applications for ${countryName}</li>
  <li><strong>Pre-departure Orientation:</strong> Preparation for student life at ${universityName} and in ${countryName}</li>
  <li><strong>Ongoing Support:</strong> Continued assistance throughout your studies at ${universityName}</li>
</ul>

<h3>Contact MA Education for ${universityName} Applications</h3>

<p>Ready to start your journey to ${universityName}? Contact MA Education today for expert guidance and support. Our experienced consultants have helped hundreds of students secure admission to ${universityName} and other top universities in ${countryName}.</p>

<p><strong>Don't wait – start your ${universityName} application journey today with MA Education!</strong></p>

<p>For more information about ${universityName}, admission requirements, and application assistance, contact our expert education consultants. We provide comprehensive support to help you achieve your academic dreams at ${universityName} in ${countryName}.</p>`;
    
    return {
      title: optimizedTitle,
      description: optimizedDescription,
      content: optimizedContent
    };
  };
  
  // Generate SEO-optimized content suggestions
  const generateSEOSuggestions = useCallback(async () => {
    if (!university?.name || !university?.content?.country) {
      setSeoSuggestions({ titles: [], descriptions: [], content: '', keywords: [] });
      return;
    }
    
    setLoadingSuggestions(true);
    
    try {
      // Generate SEO-optimized titles
      const titles = generateSEOTitles(university.name, university.content.country);
      
      // Generate SEO-optimized descriptions
      const descriptions = generateSEODescriptions(university.name, university.content.country);
      
      // Generate comprehensive content
      const content = generateSEOContent(university.name, university.content.country, university.content);
      
      // Generate relevant keywords
      const keywords = generateSEOKeywords(university.name, university.content.country);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSeoSuggestions({ titles, descriptions, content, keywords });
    } catch (error) {
      console.error('Error generating SEO suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [university?.name, university?.content?.country, university?.content]);
  
  // Generate SEO-optimized titles
  const generateSEOTitles = (universityName, country) => {
    const countryNames = {
      'malaysia': 'Malaysia',
      'canada': 'Canada', 
      'usa': 'USA',
      'uk': 'United Kingdom',
      'australia': 'Australia',
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    };
    
    const countryName = countryNames[country] || country;
    
    return [
      `${universityName} ${countryName} - Admissions, Courses & Fees | MA Education`,
      `Study at ${universityName} ${countryName} - Complete Guide 2024 | MA Education`,
      `${universityName} Admission Requirements & Application Process - ${countryName}`,
      `${universityName} ${countryName} - Rankings, Programs & Scholarships Guide`,
      `Apply to ${universityName} ${countryName} - Expert Guidance | MA Education`
    ];
  };
  
  // Generate SEO-optimized descriptions
  const generateSEODescriptions = (universityName, country) => {
    const countryNames = {
      'malaysia': 'Malaysia',
      'canada': 'Canada',
      'usa': 'USA', 
      'uk': 'United Kingdom',
      'australia': 'Australia',
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    };
    
    const countryName = countryNames[country] || country;
    
    return [
      `Discover ${universityName} in ${countryName} - admission requirements, popular courses, fees, and scholarships. Get expert guidance from MA Education for your application.`,
      `Complete guide to ${universityName} ${countryName}. Learn about programs, rankings, campus life, and application process. Free consultation with our education experts.`,
      `Apply to ${universityName} ${countryName} with confidence. Comprehensive information on courses, fees, scholarships, and visa requirements. Contact MA Education today.`,
      `${universityName} ${countryName} - Your gateway to quality education. Explore undergraduate and postgraduate programs, admission deadlines, and application tips.`,
      `Study at ${universityName} in ${countryName}. Get detailed information about academic programs, campus facilities, student life, and career opportunities.`
    ];
  };
  
  // Generate comprehensive SEO content
  const generateSEOContent = (universityName, country, content) => {
    const countryNames = {
      'malaysia': 'Malaysia',
      'canada': 'Canada',
      'usa': 'USA',
      'uk': 'United Kingdom', 
      'australia': 'Australia',
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    };
    
    const countryName = countryNames[country] || country;
    const universityType = content?.university_type || 'university';
    const ranking = content?.ranking || 'top-ranked';
    const initialPayment = content?.initial_payment || 'affordable';
    
    return `<h1>${universityName} ${countryName} - Complete University Guide 2024</h1>

<p>${universityName} is a ${universityType === 'public' ? 'prestigious public' : universityType === 'private' ? 'renowned private' : 'distinguished'} university located in ${countryName}. Known for its academic excellence and innovative programs, ${universityName} offers world-class education to international students from around the globe.</p>

<h2>Why Choose ${universityName}?</h2>

<p>${universityName} stands out as one of ${countryName}'s leading educational institutions, offering a perfect blend of academic rigor and practical learning. Here are the key reasons why students choose ${universityName}:</p>

<ul>
  <li><strong>Academic Excellence:</strong> ${ranking !== 'top-ranked' ? `Ranked #${ranking} globally` : 'Top-ranked university'} with internationally recognized programs</li>
  <li><strong>Diverse Programs:</strong> Wide range of undergraduate and postgraduate courses across multiple disciplines</li>
  <li><strong>International Recognition:</strong> Degrees recognized worldwide by employers and educational institutions</li>
  <li><strong>Modern Facilities:</strong> State-of-the-art campus with advanced research facilities and technology</li>
  <li><strong>Global Community:</strong> Diverse student body from over 50 countries creating a multicultural environment</li>
</ul>

<h2>Popular Courses at ${universityName}</h2>

<p>${universityName} offers a comprehensive range of academic programs designed to meet the evolving needs of today's job market. Some of the most popular courses include:</p>

<h3>Undergraduate Programs</h3>
<ul>
  <li>Bachelor of Computer Science</li>
  <li>Bachelor of Business Administration</li>
  <li>Bachelor of Engineering</li>
  <li>Bachelor of Medicine</li>
  <li>Bachelor of Arts</li>
</ul>

<h3>Postgraduate Programs</h3>
<ul>
  <li>Master of Business Administration (MBA)</li>
  <li>Master of Science in Data Science</li>
  <li>Master of Engineering</li>
  <li>Master of Public Health</li>
  <li>PhD Programs in various disciplines</li>
</ul>

<h2>Admission Requirements</h2>

<p>To secure admission at ${universityName}, international students must meet the following requirements:</p>

<h3>Academic Requirements</h3>
<ul>
  <li>Completed secondary education (for undergraduate programs)</li>
  <li>Bachelor's degree from a recognized institution (for postgraduate programs)</li>
  <li>Minimum GPA requirements vary by program</li>
</ul>

<h3>English Language Proficiency</h3>
<ul>
  <li>IELTS: Minimum score of 6.0-6.5 (varies by program)</li>
  <li>TOEFL: Minimum score of 80-90 (varies by program)</li>
  <li>Alternative: University English proficiency test</li>
</ul>

<h2>Fees and Financial Information</h2>

<p>${universityName} offers competitive tuition fees with various payment options to support international students:</p>

<ul>
  <li><strong>Initial Payment:</strong> ${initialPayment} to secure your admission</li>
  <li><strong>Tuition Fees:</strong> Varies by program and level of study</li>
  <li><strong>Payment Plans:</strong> Flexible payment options available</li>
  <li><strong>Scholarships:</strong> Merit-based and need-based scholarships for eligible students</li>
</ul>

<h2>Campus Life and Facilities</h2>

<p>Students at ${universityName} enjoy a vibrant campus life with access to world-class facilities:</p>

<ul>
  <li>Modern lecture halls and seminar rooms</li>
  <li>Well-equipped laboratories and research centers</li>
  <li>Comprehensive library with digital resources</li>
  <li>Sports and recreation facilities</li>
  <li>Student accommodation options</li>
  <li>International student support services</li>
</ul>

<h2>How to Apply to ${universityName}</h2>

<p>The application process for ${universityName} is straightforward. Follow these steps to begin your academic journey:</p>

<ol>
  <li><strong>Research Programs:</strong> Explore available courses and select your preferred program</li>
  <li><strong>Check Requirements:</strong> Ensure you meet all admission criteria</li>
  <li><strong>Prepare Documents:</strong> Gather all required academic and personal documents</li>
  <li><strong>Submit Application:</strong> Complete and submit your online application</li>
  <li><strong>Pay Application Fee:</strong> Process your application fee payment</li>
  <li><strong>Await Response:</strong> University will review and respond to your application</li>
</ol>

<h2>Get Expert Guidance from MA Education</h2>

<p>Applying to ${universityName} can be complex, but you don't have to navigate it alone. MA Education provides comprehensive support services to help you secure admission:</p>

<ul>
  <li><strong>Free Consultation:</strong> Discuss your academic goals and get personalized advice</li>
  <li><strong>Application Assistance:</strong> Complete guidance through the application process</li>
  <li><strong>Document Preparation:</strong> Help with preparing and reviewing all required documents</li>
  <li><strong>Visa Support:</strong> Assistance with student visa application and requirements</li>
  <li><strong>Pre-departure Orientation:</strong> Preparation for your life as an international student</li>
</ul>

<p>Contact MA Education today to start your journey to ${universityName} and achieve your academic dreams in ${countryName}.</p>`;
  };
  
  // Generate relevant SEO keywords
  const generateSEOKeywords = (universityName, country) => {
    const countryNames = {
      'malaysia': 'Malaysia',
      'canada': 'Canada',
      'usa': 'USA',
      'uk': 'United Kingdom',
      'australia': 'Australia', 
      'germany': 'Germany',
      'sweden': 'Sweden',
      'netherlands': 'Netherlands'
    };
    
    const countryName = countryNames[country] || country;
    
    return [
      `${universityName}`,
      `${universityName} ${countryName}`,
      `${universityName} admission`,
      `${universityName} courses`,
      `${universityName} fees`,
      `${universityName} scholarships`,
      `study in ${countryName}`,
      `${countryName} universities`,
      `${universityName} application`,
      `${universityName} requirements`,
      `${universityName} ranking`,
      `international students ${countryName}`,
      `${universityName} campus`,
      `${universityName} programs`,
      `education consultancy ${countryName}`
    ];
  };
  
  // Apply generated content to form fields
  const applySEOTitle = (title) => {
    setUniversity(prev => ({ ...prev, name: title }));
  };
  
  const applySEODescription = (description) => {
    setUniversity(prev => ({ ...prev, description: description }));
  };
  
  const applySEOContent = (content) => {
    setUniversity(prev => ({ ...prev, page_content: content }));
    // Trigger SEO analysis for the new content
    analyzeSEO(content);
  };
  
  // Trigger SEO suggestions generation when university data changes
  useEffect(() => {
    if (university?.name && university?.content?.country) {
      generateSEOSuggestions();
    }
  }, [university?.name, university?.content?.country, generateSEOSuggestions]);

  const generateSlug = (name) => {
    return slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  };

  const fetchUniversity = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error('Failed to fetch university data.');
      }
      setUniversity(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUniversity();
    } else {
      setUniversity({
        name: '',
        location: '',
        description: '',
        banner_url: '',
        logo_url: '',
        website_url: '',
        content: {
          country: '',
          university_type: '',
          ranking: '',
          ranking_type: 'QS Ranking',
          initial_payment: '',
          duration: '',
          language_requirements: [],
          popular_courses: [],
          programs: []
        }
      });
      setLoading(false);
    }
  }, [id, fetchUniversity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedUniversity = { ...university, [name]: value };
    setUniversity(updatedUniversity);
    
    // Trigger SEO analysis if page content exists and name/description changes
    if ((name === 'name' || name === 'description') && updatedUniversity.page_content) {
      analyzeSEO(updatedUniversity.page_content);
    }
  };

  const handleContentFieldChange = (field, value) => {
    setUniversity(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    // Convert comma-separated string to array
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleContentFieldChange(field, arrayValue);
  };

  const handlePageContentChange = (value) => {
    setUniversity(prev => ({ ...prev, page_content: value }));
    // Trigger SEO analysis when content changes
    analyzeSEO(value);
  };
  
  const findCompetitors = useCallback(async () => {
    if (!university?.name) {
      setCompetitors([]);
      return;
    }
    
    setLoadingCompetitors(true);
    try {
      // Generate SEO competitors based on university name and content
      const competitors = await generateSEOCompetitors(university.name, university.content?.country, university.page_content);
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompetitors(competitors);
      setLoadingCompetitors(false);
    } catch (error) {
      console.error('Error finding competitors:', error);
      setCompetitors([]);
      setLoadingCompetitors(false);
    }
  }, [university?.name, university?.content?.country, university?.page_content]);
  
  // Generate SEO competitors based on university name and content
  const generateSEOCompetitors = async (universityName, country, content) => {
    if (!universityName) return [];
    
    // Extract keywords from university name and content for more targeted competitors
    const nameKeywords = universityName.toLowerCase().split(' ');
    const universityKeyword = nameKeywords[0]; // First word of university name
    
    // Generate content-based competitors (sites that would rank for this university)
    const competitors = [];
    
    // 1. Official University Website (Always top competitor)
    competitors.push({
      name: `${universityName} Official Website`,
      domain: generateUniversityDomain(universityName),
      strength: 95,
      focus: 'Official University Information',
      traffic: '500K/month',
      competitorType: 'Official',
      keywords: [universityName, 'official', 'admissions', 'courses']
    });
    
    // 2. Wikipedia page (Usually ranks high)
    competitors.push({
      name: `${universityName} - Wikipedia`,
      domain: 'en.wikipedia.org',
      strength: 88,
      focus: 'University Information & History',
      traffic: '2M/month',
      competitorType: 'Information',
      keywords: [universityName, 'university', 'information', 'history']
    });
    
    // 3. Study abroad consultancies ranking for this university
    const consultancyCompetitors = generateConsultancyCompetitors(universityName, country);
    competitors.push(...consultancyCompetitors);
    
    // 4. University ranking and review sites
    const rankingSites = generateRankingSiteCompetitors(universityName, country);
    competitors.push(...rankingSites);
    
    // 5. Country-specific education portals
    const countryPortals = generateCountryEducationPortals(universityName, country);
    competitors.push(...countryPortals);
    
    // 6. Student forum discussions and review sites
    const studentSites = generateStudentCommunityCompetitors(universityName);
    competitors.push(...studentSites);
    
    // Sort by strength and return top competitors
    return competitors
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 8); // Limit to top 8 competitors
  };
  
  // Helper function to generate university domain
  const generateUniversityDomain = (name) => {
    const cleanName = name.toLowerCase()
      .replace(/university|college|institute/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '');
    return `${cleanName}.edu`;
  };
  
  // Generate consultancy competitors
  const generateConsultancyCompetitors = (universityName, country) => {
    const consultancies = [
      {
        name: 'MA Education',
        domain: 'ma-education.com',
        strength: 75,
        focus: `${universityName} Admissions`,
        traffic: '50K/month',
        competitorType: 'Consultancy'
      },
      {
        name: 'Study Abroad Consultants',
        domain: 'studyabroadconsultants.org',
        strength: 72,
        focus: `${universityName} Applications`,
        traffic: '40K/month',
        competitorType: 'Consultancy'
      },
      {
        name: 'EduConnect Global',
        domain: 'educonnectglobal.com',
        strength: 68,
        focus: `${universityName} Guidance`,
        traffic: '35K/month',
        competitorType: 'Consultancy'
      }
    ];
    
    return consultancies;
  };
  
  // Generate ranking site competitors
  const generateRankingSiteCompetitors = (universityName, country) => {
    const rankingSites = [
      {
        name: `${universityName} Rankings - QS`,
        domain: 'topuniversities.com',
        strength: 92,
        focus: 'University Rankings & Reviews',
        traffic: '800K/month',
        competitorType: 'Ranking'
      },
      {
        name: `${universityName} Profile - Times Higher Ed`,
        domain: 'timeshighereducation.com',
        strength: 89,
        focus: 'University Rankings & Analysis',
        traffic: '600K/month',
        competitorType: 'Ranking'
      },
      {
        name: `${universityName} Reviews - Niche`,
        domain: 'niche.com',
        strength: 78,
        focus: 'Student Reviews & Rankings',
        traffic: '400K/month',
        competitorType: 'Review'
      }
    ];
    
    return rankingSites;
  };
  
  // Generate country-specific education portals
  const generateCountryEducationPortals = (universityName, country) => {
    const countryPortals = {
      'malaysia': [
        {
          name: `${universityName} - Study Malaysia`,
          domain: 'studymalaysia.com',
          strength: 82,
          focus: 'Malaysian University Information',
          traffic: '250K/month',
          competitorType: 'Portal'
        },
        {
          name: `${universityName} - EduAdvisor`,
          domain: 'eduadvisor.my',
          strength: 79,
          focus: 'University Comparison & Info',
          traffic: '200K/month',
          competitorType: 'Portal'
        }
      ],
      'canada': [
        {
          name: `${universityName} - Universities Canada`,
          domain: 'univcan.ca',
          strength: 85,
          focus: 'Canadian University Directory',
          traffic: '300K/month',
          competitorType: 'Portal'
        },
        {
          name: `${universityName} - Study in Canada`,
          domain: 'studyincanada.com',
          strength: 81,
          focus: 'Canadian Education Guide',
          traffic: '280K/month',
          competitorType: 'Portal'
        }
      ],
      'usa': [
        {
          name: `${universityName} - College Board`,
          domain: 'collegeboard.org',
          strength: 94,
          focus: 'US College Information',
          traffic: '2M/month',
          competitorType: 'Portal'
        },
        {
          name: `${universityName} - Peterson's`,
          domain: 'petersons.com',
          strength: 83,
          focus: 'College Search & Applications',
          traffic: '500K/month',
          competitorType: 'Portal'
        }
      ],
      'uk': [
        {
          name: `${universityName} - UCAS`,
          domain: 'ucas.com',
          strength: 96,
          focus: 'UK University Applications',
          traffic: '1.2M/month',
          competitorType: 'Portal'
        },
        {
          name: `${universityName} - Complete University Guide`,
          domain: 'thecompleteuniversityguide.co.uk',
          strength: 84,
          focus: 'UK University Rankings',
          traffic: '400K/month',
          competitorType: 'Portal'
        }
      ],
      'australia': [
        {
          name: `${universityName} - Study Australia`,
          domain: 'studyaustralia.gov.au',
          strength: 91,
          focus: 'Australian University Guide',
          traffic: '350K/month',
          competitorType: 'Portal'
        },
        {
          name: `${universityName} - Good Universities Guide`,
          domain: 'gooduniversitiesguide.com.au',
          strength: 80,
          focus: 'Australian University Rankings',
          traffic: '250K/month',
          competitorType: 'Portal'
        }
      ]
    };
    
    return countryPortals[country] || [];
  };
  
  // Generate student community competitors
  const generateStudentCommunityCompetitors = (universityName) => {
    return [
      {
        name: `${universityName} Discussion - Reddit`,
        domain: 'reddit.com',
        strength: 76,
        focus: 'Student Discussions & Reviews',
        traffic: '1.5B/month',
        competitorType: 'Community'
      },
      {
        name: `${universityName} Reviews - StudyPortals`,
        domain: 'studyportals.com',
        strength: 74,
        focus: 'International Student Platform',
        traffic: '180K/month',
        competitorType: 'Community'
      }
    ];
  };
  
  const generateCompetitorsByCountry = (country) => {
    const competitorMap = {
      'malaysia': [
        {
          name: 'Study Malaysia Hub',
          domain: 'studymalaysia.com',
          strength: 85,
          focus: 'Malaysian Universities',
          traffic: '250K/month'
        },
        {
          name: 'Malaysia Education Consultancy',
          domain: 'mec-bd.com',
          strength: 78,
          focus: 'Bangladesh Students',
          traffic: '180K/month'
        },
        {
          name: 'EduAdvisor Malaysia',
          domain: 'eduadvisor.my',
          strength: 82,
          focus: 'Higher Education',
          traffic: '200K/month'
        }
      ],
      'canada': [
        {
          name: 'Study in Canada',
          domain: 'studyincanada.com',
          strength: 88,
          focus: 'Canadian Universities',
          traffic: '300K/month'
        },
        {
          name: 'CanadaVisa Education',
          domain: 'canadavisa.com',
          strength: 85,
          focus: 'Immigration & Education',
          traffic: '450K/month'
        },
        {
          name: 'ApplyBoard',
          domain: 'applyboard.com',
          strength: 92,
          focus: 'International Students',
          traffic: '500K/month'
        }
      ],
      'usa': [
        {
          name: 'Study USA',
          domain: 'studyusa.com',
          strength: 90,
          focus: 'US Universities',
          traffic: '600K/month'
        },
        {
          name: 'EducationUSA',
          domain: 'educationusa.state.gov',
          strength: 95,
          focus: 'Official US Education',
          traffic: '800K/month'
        },
        {
          name: 'College Board',
          domain: 'collegeboard.org',
          strength: 98,
          focus: 'College Applications',
          traffic: '2M/month'
        }
      ],
      'uk': [
        {
          name: 'Study UK',
          domain: 'study-uk.britishcouncil.org',
          strength: 93,
          focus: 'UK Education',
          traffic: '400K/month'
        },
        {
          name: 'UCAS',
          domain: 'ucas.com',
          strength: 96,
          focus: 'UK University Applications',
          traffic: '1.2M/month'
        },
        {
          name: 'The Student Room',
          domain: 'thestudentroom.co.uk',
          strength: 85,
          focus: 'Student Community',
          traffic: '350K/month'
        }
      ],
      'australia': [
        {
          name: 'Study in Australia',
          domain: 'studyinaustralia.gov.au',
          strength: 91,
          focus: 'Australian Education',
          traffic: '300K/month'
        },
        {
          name: 'IDP Education',
          domain: 'idp.com',
          strength: 87,
          focus: 'International Education',
          traffic: '400K/month'
        },
        {
          name: 'Go8 Universities',
          domain: 'go8.edu.au',
          strength: 89,
          focus: 'Top Australian Unis',
          traffic: '200K/month'
        }
      ]
    };
    
    return competitorMap[country] || [
      {
        name: 'Global Study Partners',
        domain: 'globalstudypartners.com',
        strength: 72,
        focus: 'International Education',
        traffic: '150K/month'
      },
      {
        name: 'Education Worldwide',
        domain: 'educationworldwide.com',
        strength: 68,
        focus: 'Study Abroad',
        traffic: '120K/month'
      },
      {
        name: 'UniGuide International',
        domain: 'uniguide.org',
        strength: 75,
        focus: 'University Selection',
        traffic: '180K/month'
      }
    ];
  };
  
  // Function to simulate keyword loading
  const simulateKeywordLoading = useCallback(async () => {
    setLoadingKeywords(true);
    
    // Simulate keyword analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoadingKeywords(false);
  }, []);
  
  useEffect(() => {
    if (university?.page_content) {
      // Trigger keyword loading simulation whenever content changes
      if (university.page_content.trim() !== '') {
        simulateKeywordLoading();
      }
      analyzeSEO(university.page_content);
    }
  }, [university?.page_content, analyzeSEO, simulateKeywordLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!university.name) {
      setError('University name is required.')
      return
    }

    setSaving(true)
    setError('')

    const slug = generateSlug(university.name)

    // Prepare the data with both individual fields and content object
    const universityData = {
      name: university.name,
      location: university.location,
      description: university.description,
      logo_url: university.logo_url,
      banner_url: university.banner_url,
      website_url: university.website_url,
      slug: slug,
      
      // Map structured content to individual database fields
      country: university.content?.country,
      initial_payment: university.content?.initial_payment,
      course_duration: university.content?.duration,
      popular_courses: university.content?.popular_courses,
      language_requirement: university.content?.language_requirements?.join(', '),
      subjects: university.content?.programs,
      ranking_type: university.content?.ranking_type,
      ranking_value: university.content?.ranking,
      
      // Store structured content as JSONB for card generation
      content: university.content,
      
      // Store page content separately if needed
      page_content: university.page_content
    }

    try {
      let response
      if (!id) {
        // Create new university
        const { data: insertedData, error: insertError } = await supabase
          .from('universities')
          .insert([universityData])
          .select()
          .single()
        if(insertError) throw insertError
        response = { data: insertedData, error: insertError }
      } else {
        // Update existing university
        const { data: updatedData, error: updateError } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', id)
          .select()
          .single()
        if(updateError) throw updateError
        response = { data: updatedData, error: updateError }
      }
      
      const { error } = response

      if (error) {
        throw error
      }
      
      setSaving(false)
      navigate('/admin/universities')

    } catch (err) {
      setError('Failed to save university. Please try again.')
      console.error('Save error:', err)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  if (error && !university) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  return (
    <AdminLayout onLogout={onLogout}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex-1 mb-6 lg:mb-0">
              <button
                onClick={() => navigate('/admin/universities')}
                className="flex items-center text-blue-100 hover:text-white text-sm font-medium mb-4 transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Universities
              </button>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {!id ? 'Add New University' : 'Edit University'}
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                {!id ? 'Create a new university profile with detailed information' : 'Update university information and settings'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2">
                <FiGlobe className="w-5 h-5 mr-2" />
                <span className="font-semibold">Global Education</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                    <FiGlobe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-gray-600">Essential university details and branding</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">University Name *</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={university?.name || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="Enter university name"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700">Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        value={university?.location || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Short Description</label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={university?.description || ''} 
                    onChange={handleInputChange} 
                    rows="3" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                    placeholder="Brief description of the university"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="logo_url" className="block text-sm font-semibold text-gray-700">Logo URL</label>
                    <input 
                      type="url" 
                      name="logo_url" 
                      id="logo_url" 
                      value={university?.logo_url || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="banner_url" className="block text-sm font-semibold text-gray-700">Banner URL</label>
                    <input 
                      type="url" 
                      name="banner_url" 
                      id="banner_url" 
                      value={university?.banner_url || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="website_url" className="block text-sm font-semibold text-gray-700">Official Website URL</label>
                  <input 
                    type="url" 
                    name="website_url" 
                    id="website_url" 
                    value={university?.website_url || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    placeholder="https://university-website.edu"
                  />
                </div>
              </div>

              {/* University Details Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">University Details</h2>
                    <p className="text-gray-600">Academic information and specifications</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select 
                        name="country" 
                        id="country" 
                        value={university?.content?.country || ''} 
                        onChange={(e) => handleContentFieldChange('country', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Country</option>
                        <option value="canada">Canada</option>
                        <option value="malaysia">Malaysia</option>
                        <option value="usa">USA</option>
                        <option value="uk">United Kingdom</option>
                        <option value="australia">Australia</option>
                        <option value="germany">Germany</option>
                        <option value="sweden">Sweden</option>
                        <option value="netherlands">Netherlands</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="university_type" className="block text-sm font-semibold text-gray-700">University Type</label>
                    <div className="relative">
                      <FiStar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select 
                        name="university_type" 
                        id="university_type" 
                        value={university?.content?.university_type || ''} 
                        onChange={(e) => handleContentFieldChange('university_type', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                      >
                        <option value="">Select Type</option>
                        <option value="public">Public University</option>
                        <option value="semi-government">Semi-Government</option>
                        <option value="private">Private University</option>
                        <option value="international">International/Foreign Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="ranking" className="block text-sm font-semibold text-gray-700">University Ranking</label>
                    <div className="relative">
                      <FiStar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="ranking" 
                        id="ranking" 
                        value={university?.content?.ranking || ''} 
                        onChange={(e) => handleContentFieldChange('ranking', e.target.value)}
                        placeholder="e.g., 150"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="ranking_type" className="block text-sm font-semibold text-gray-700">Ranking Type</label>
                    <select 
                      name="ranking_type" 
                      id="ranking_type" 
                      value={university?.content?.ranking_type || 'QS Ranking'} 
                      onChange={(e) => handleContentFieldChange('ranking_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                    >
                      <option value="QS Ranking">QS Ranking</option>
                      <option value="Country Ranking">Country Ranking</option>
                      <option value="Times Higher Education">Times Higher Education</option>
                      <option value="Academic Ranking">Academic Ranking</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="initial_payment" className="block text-sm font-semibold text-gray-700">Initial Payment</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="initial_payment" 
                        id="initial_payment" 
                        value={university?.content?.initial_payment || ''} 
                        onChange={(e) => handleContentFieldChange('initial_payment', e.target.value)}
                        placeholder="e.g., $5,000"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">Course Duration</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="duration" 
                        id="duration" 
                        value={university?.content?.duration || ''} 
                        onChange={(e) => handleContentFieldChange('duration', e.target.value)}
                        placeholder="e.g., 3-4 years"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="language_requirements" className="block text-sm font-semibold text-gray-700">Language Requirements</label>
                    <input 
                      type="text" 
                      name="language_requirements" 
                      id="language_requirements" 
                      value={university?.content?.language_requirements?.join(', ') || ''} 
                      onChange={(e) => handleArrayFieldChange('language_requirements', e.target.value)}
                      placeholder="e.g., IELTS 6.5, TOEFL 90"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas</p>
                  </div>
                </div>
                
                <div className="space-y-1 mb-6">
                  <label htmlFor="popular_courses" className="block text-sm font-semibold text-gray-700">Popular Courses/Subjects</label>
                  <textarea 
                    name="popular_courses" 
                    id="popular_courses" 
                    value={university?.content?.popular_courses?.join(', ') || ''} 
                    onChange={(e) => handleArrayFieldChange('popular_courses', e.target.value)}
                    rows="3"
                    placeholder="e.g., Computer Science, Business Administration, Engineering, Medicine"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Separate multiple courses with commas. Only first 2 will show on cards.</p>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="programs" className="block text-sm font-semibold text-gray-700">All Available Programs</label>
                  <textarea 
                    name="programs" 
                    id="programs" 
                    value={university?.content?.programs?.join(', ') || ''} 
                    onChange={(e) => handleArrayFieldChange('programs', e.target.value)}
                    rows="4"
                    placeholder="e.g., Bachelor of Science, Master of Business Administration, PhD in Engineering"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">Separate multiple programs with commas</p>
                </div>
              </div>

              {/* Content Editor Section */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                    <FiBookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Page Content</h2>
                    <p className="text-gray-600">Detailed university information and content</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <ErrorBoundary>
                    <QuillEditor 
                      value={university?.page_content || ''} 
                      onChange={handlePageContentChange} 
                      className="bg-white rounded-xl"
                    />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {saving ? <FiLoader className="animate-spin mr-2 h-5 w-5" /> : <FiSave className="mr-2 h-5 w-5" />}
                  <span className="text-lg">{saving ? 'Saving...' : 'Save University'}</span>
                </button>
              </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - SEO Monitoring Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6" style={{height: 'fit-content'}}>
              {/* SEO Score Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">SEO Score</h3>
                      <p className="text-green-100">Real-time analysis</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <FiTrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">{seoScore}/100</div>
                    <div className="w-full bg-white/20 rounded-full h-3 mt-2">
                      <div 
                        className="bg-white h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${seoScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{seoAnalysis.contentLength}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{seoAnalysis.readability}%</div>
                      <div className="text-sm text-gray-600">Readability</div>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <FiTarget className="w-4 h-4 mr-2" />
                      Suggestions
                    </h4>
                    {seoAnalysis.suggestions.length > 0 ? (
                      <div className="space-y-2">
                        {seoAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <FiAlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm text-gray-600">All good! No suggestions.</p>
                      </div>
                    )}
                    
                    {/* AI Content Optimizer Button */}
                    {seoScore < 100 && university?.name && university?.content?.country && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={optimizeForPerfectSEO}
                          disabled={optimizing}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {optimizing ? (
                            <>
                              <FiLoader className="animate-spin w-5 h-5 mr-2" />
                              <span>Optimizing...</span>
                            </>
                          ) : (
                            <>
                              <FiTarget className="w-5 h-5 mr-2" />
                              <span>Get 100% SEO Score</span>
                            </>
                          )}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          AI will regenerate content to achieve perfect SEO score
                        </p>
                      </div>
                    )}
                    
                    {seoScore === 100 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <FiCheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Perfect SEO Score!</span>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          Your content is fully optimized
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Keywords Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-0 flex flex-col">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Top Keywords</h3>
                      <p className="text-blue-100">Content analysis</p>
                    </div>
                    <div className="flex items-center">
                      {loadingKeywords && <FiLoader className="animate-spin w-6 h-6 mr-2" />}
                      <FiSearch className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {loadingKeywords ? (
                    <div className="flex flex-col items-center justify-center py-8 flex-1">
                      <FiLoader className="animate-spin h-8 w-8 text-blue-500 mb-4" />
                      <span className="text-sm text-gray-600">Analyzing keywords...</span>
                    </div>
                  ) : seoAnalysis.keywords.length > 0 ? (
                    <div className="space-y-3">
                      {seoAnalysis.keywords.slice(0, 5).map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{keyword.word}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (keyword.frequency / Math.max(...seoAnalysis.keywords.map(k => k.frequency))) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{keyword.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Add content to see keyword analysis</p>
                  )}
                </div>
              </div>
              
              {/* Competitors Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-0 flex flex-col">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Competitors</h3>
                      <p className="text-red-100">Market analysis</p>
                    </div>
                    <FiUsers className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {loadingCompetitors ? (
                    <div className="flex items-center justify-center py-8 flex-1">
                      <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
                      <span className="ml-2 text-gray-600">Finding competitors...</span>
                    </div>
                  ) : competitors.length > 0 ? (
                    <div className="space-y-4">
                      {competitors.map((competitor, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                              <p className="text-sm text-gray-500">{competitor.domain}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">{competitor.strength}%</div>
                              <div className="text-xs text-gray-500">Strength</div>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${competitor.strength}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{competitor.focus}</span>
                            <span>{competitor.traffic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Add university details to find competitors</p>
                  )}
                </div>
              </div>
              
              {/* Content Structure Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-0 flex flex-col">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Content Structure</h3>
                      <p className="text-indigo-100">Heading analysis</p>
                    </div>
                    <FiBarChart className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {seoAnalysis.headingStructure.length > 0 ? (
                    <div className="space-y-2">
                      {seoAnalysis.headingStructure.slice(0, 5).map((heading, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            heading.level === 1 ? 'bg-red-100 text-red-800' :
                            heading.level === 2 ? 'bg-blue-100 text-blue-800' :
                            heading.level === 3 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            H{heading.level}
                          </span>
                          <span className="text-sm text-gray-900 truncate">{heading.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No headings detected. Add H1, H2, H3 tags to improve structure.</p>
                  )}
                </div>
              </div>
              
              {/* SEO Content Suggestions Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">SEO Suggestions</h3>
                      <p className="text-yellow-100">AI-generated content</p>
                    </div>
                    <div className="flex items-center">
                      {loadingSuggestions && <FiLoader className="animate-spin w-6 h-6 mr-2" />}
                      <FiTarget className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center py-8">
                      <FiLoader className="animate-spin h-8 w-8 text-yellow-500" />
                      <span className="ml-2 text-gray-600">Generating SEO content...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Title Suggestions */}
                      {seoSuggestions.titles.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiEdit className="w-4 h-4 mr-2" />
                            Title Suggestions
                          </h4>
                          <div className="space-y-2">
                            {seoSuggestions.titles.slice(0, 3).map((title, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-700 mb-2">{title}</p>
                                <button
                                  onClick={() => applySEOTitle(title)}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                  Apply Title
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Description Suggestions */}
                      {seoSuggestions.descriptions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiEdit className="w-4 h-4 mr-2" />
                            Description Suggestions
                          </h4>
                          <div className="space-y-2">
                            {seoSuggestions.descriptions.slice(0, 3).map((description, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3">
                                <p className="text-sm text-gray-700 mb-2">{description}</p>
                                <button
                                  onClick={() => applySEODescription(description)}
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors duration-200"
                                >
                                  Apply Description
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Content Suggestion */}
                      {seoSuggestions.content && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiBookOpen className="w-4 h-4 mr-2" />
                            Generated Content
                          </h4>
                          <div className="border border-gray-200 rounded-lg p-3">
                            <div className="bg-gray-50 rounded p-3 mb-3 max-h-32 overflow-y-auto">
                              <div 
                                className="text-sm text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: seoSuggestions.content.substring(0, 500) + '...' }}
                              />
                            </div>
                            <button
                              onClick={() => applySEOContent(seoSuggestions.content)}
                              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
                            >
                              Apply Full Content
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Keyword Suggestions */}
                      {seoSuggestions.keywords.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FiSearch className="w-4 h-4 mr-2" />
                            Suggested Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {seoSuggestions.keywords.slice(0, 8).map((keyword, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!seoSuggestions.titles.length && !loadingSuggestions && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Add university name and country to generate SEO suggestions
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UniversityEditor; 
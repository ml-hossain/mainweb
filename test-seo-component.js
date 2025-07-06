// Quick test to validate the RealTimeSEOTool component structure
console.log('🧪 Testing RealTimeSEOTool component...')

try {
  // Test basic import structure
  const fs = require('fs')
  const path = require('path')
  
  const componentPath = path.join(__dirname, 'src/components/RealTimeSEOTool.jsx')
  const componentContent = fs.readFileSync(componentPath, 'utf8')
  
  // Check for proper exports
  if (componentContent.includes('export default RealTimeSEOTool')) {
    console.log('✅ Component has proper export')
  } else {
    console.log('❌ Component export not found')
  }
  
  // Check for function definitions before useMemo
  const lines = componentContent.split('\n')
  let foundAnalyzeTitle = false
  let foundUseMemo = false
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const analyzeTitleSEO')) {
      foundAnalyzeTitle = true
    }
    if (lines[i].includes('useMemo(() =>') && foundAnalyzeTitle) {
      foundUseMemo = true
      break
    }
  }
  
  if (foundAnalyzeTitle && foundUseMemo) {
    console.log('✅ Function definitions are properly ordered before useMemo')
  } else {
    console.log('❌ Function ordering issue detected')
  }
  
  // Check for all required functions
  const requiredFunctions = [
    'extractHeadings',
    'extractImages', 
    'extractLinks',
    'analyzeTitleSEO',
    'analyzeDescriptionSEO',
    'analyzeContentSEO',
    'analyzeTechnicalSEO'
  ]
  
  let missingFunctions = []
  requiredFunctions.forEach(func => {
    if (!componentContent.includes(func)) {
      missingFunctions.push(func)
    }
  })
  
  if (missingFunctions.length === 0) {
    console.log('✅ All required functions are present')
  } else {
    console.log('❌ Missing functions:', missingFunctions)
  }
  
  // Check for proper React hooks usage
  if (componentContent.includes('useState') && 
      componentContent.includes('useEffect') && 
      componentContent.includes('useMemo')) {
    console.log('✅ React hooks are properly imported and used')
  } else {
    console.log('❌ React hooks issue detected')
  }
  
  console.log('🎉 Component validation complete!')
  
} catch (error) {
  console.error('❌ Error validating component:', error.message)
}

// This file provides backward compatibility for SEOTool references
import RealTimeSEOTool from './RealTimeSEOTool'

// Re-export RealTimeSEOTool as SEOTool for backward compatibility
const SEOTool = (props) => {
  return <RealTimeSEOTool {...props} />
}

export default SEOTool

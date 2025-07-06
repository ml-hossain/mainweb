/**
 * Content Generator
 * 
 * Generates SEO-optimized content based on title, keywords, and context
 * Adapts content based on whether it's for blog or university context
 */

class ContentGenerator {
  constructor() {
    this.templates = {
      blog: {
        metaDescription: this.generateBlogMetaDescription,
        mainContent: this.generateBlogMainContent,
        tags: this.generateBlogTags,
        title: this.generateBlogTitle,
      },
      university: {
        shortDescription: this.generateUniversityShortDescription,
        mainContent: this.generateUniversityMainContent,
        title: this.generateUniversityTitle,
      },
    };
  }

  // Main content generation method
  async generate({ title, keywords, context, fields, competitors }) {
    const generatedContent = {};
    
    if (!title || !keywords || keywords.length === 0) {
      throw new Error('Title and keywords are required for content generation');
    }

    const templates = this.templates[context] || this.templates.blog;
    
    // Generate content for each requested field
    for (const field of fields) {
      if (templates[field]) {
        try {
          generatedContent[field] = await templates[field].call(this, {
            title,
            keywords,
            context,
            competitors,
          });
        } catch (error) {
          console.error(`Error generating ${field}:`, error);
          generatedContent[field] = `Error generating ${field}: ${error.message}`;
        }
      }
    }

    return generatedContent;
  }

  // Blog content generators
  generateBlogMetaDescription({ title, keywords, competitors }) {
    const primaryKeyword = keywords[0];
    const secondaryKeywords = keywords.slice(1, 3);
    
    const templates = [
      `Discover everything about ${primaryKeyword} in our comprehensive guide. Learn ${secondaryKeywords.join(', ')} and get expert insights. Read more!`,
      `Complete guide to ${primaryKeyword}. Explore ${secondaryKeywords.join(', ')} with practical tips and strategies. Start your journey today!`,
      `Master ${primaryKeyword} with our detailed tutorial. Covers ${secondaryKeywords.join(', ')} and real-world applications. Get started now!`,
    ];
    
    let description = templates[Math.floor(Math.random() * templates.length)];
    
    // Ensure it's within optimal length (150-160 characters)
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    
    return description;
  }

  generateBlogMainContent({ title, keywords, competitors }) {
    const primaryKeyword = keywords[0];
    const secondaryKeywords = keywords.slice(1, 4);
    
    const competitorInsights = competitors.length > 0 
      ? `Based on our analysis of top-ranking content, we've identified key areas that make content successful in this space.`
      : 'Our research shows that comprehensive coverage of this topic is essential for success.';
    
    return `
# ${title}

## Introduction

Welcome to our comprehensive guide on ${primaryKeyword}. In this detailed article, we'll explore everything you need to know about ${primaryKeyword}, including ${secondaryKeywords.join(', ')}.

${competitorInsights}

## What is ${primaryKeyword}?

${primaryKeyword} is a crucial aspect that many people are looking to understand better. Whether you're a beginner or looking to enhance your existing knowledge, this guide will provide valuable insights.

## Key Benefits of ${primaryKeyword}

Understanding ${primaryKeyword} offers several advantages:

- **Improved Knowledge**: Gain comprehensive understanding of the subject
- **Practical Application**: Learn how to apply these concepts in real scenarios
- **Expert Insights**: Benefit from research-backed information
- **Long-term Value**: Build foundational knowledge that lasts

## Deep Dive into ${secondaryKeywords[0] || 'Key Concepts'}

${secondaryKeywords[0] ? `Let's explore ${secondaryKeywords[0]} in detail. This aspect is particularly important because it forms the foundation of understanding ${primaryKeyword}.` : 'Understanding the core concepts is essential for mastering this topic.'}

### Essential Elements

1. **Foundation Building**: Start with the basics
2. **Progressive Learning**: Build upon existing knowledge
3. **Practical Implementation**: Apply what you learn
4. **Continuous Improvement**: Keep updating your knowledge

## Advanced Strategies

For those looking to take their understanding further, consider these advanced approaches:

- Research the latest trends in ${primaryKeyword}
- Connect with experts in the field
- Practice regular implementation
- Stay updated with industry developments

## Common Mistakes to Avoid

When dealing with ${primaryKeyword}, be aware of these common pitfalls:

- Overlooking fundamental concepts
- Rushing through the learning process
- Ignoring practical application
- Failing to stay updated

## Conclusion

${primaryKeyword} is an essential topic that requires careful attention and understanding. By following the strategies outlined in this guide, you'll be well-equipped to succeed in your journey.

Remember to focus on ${secondaryKeywords.join(', ')} as you continue to develop your expertise. The key to success lies in consistent learning and practical application.

## Next Steps

Ready to move forward? Here's what you should do next:

1. Review the key concepts covered
2. Start implementing the strategies
3. Seek additional resources if needed
4. Connect with others in the field

For more information about ${primaryKeyword}, continue exploring our comprehensive resources and guides.
    `.trim();
  }

  generateBlogTags({ keywords, context }) {
    const baseTags = [...keywords];
    
    // Add context-specific tags
    if (context === 'blog') {
      baseTags.push('guide', 'tutorial', 'tips', 'howto');
    }
    
    // Add some SEO-friendly tags
    baseTags.push('2024', 'complete guide', 'best practices');
    
    return baseTags.slice(0, 10); // Limit to 10 tags
  }

  generateBlogTitle({ title, keywords }) {
    const primaryKeyword = keywords[0];
    
    if (title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return title;
    }
    
    const templates = [
      `Ultimate Guide to ${primaryKeyword}: ${title}`,
      `Complete ${primaryKeyword} Guide: ${title}`,
      `${primaryKeyword} Explained: ${title}`,
      `Master ${primaryKeyword}: ${title}`,
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // University content generators
  generateUniversityShortDescription({ title, keywords, competitors }) {
    const primaryKeyword = keywords[0];
    
    const templates = [
      `Explore ${primaryKeyword} at this prestigious institution. Discover world-class programs, expert faculty, and exceptional opportunities for international students.`,
      `Experience excellence in ${primaryKeyword} education. Join a diverse community of learners and unlock your potential at this renowned university.`,
      `Pursue your dreams in ${primaryKeyword} with comprehensive programs designed for success. Apply now and start your journey to academic excellence.`,
    ];
    
    let description = templates[Math.floor(Math.random() * templates.length)];
    
    // Ensure it's within optimal length (150-200 characters for university descriptions)
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    
    return description;
  }

  generateUniversityMainContent({ title, keywords, competitors }) {
    const primaryKeyword = keywords[0];
    const secondaryKeywords = keywords.slice(1, 3);
    
    return `
# ${title}

## Overview

Welcome to our comprehensive overview of ${primaryKeyword} programs and opportunities. This institution stands as a beacon of excellence in higher education, offering world-class programs that prepare students for global success.

## Academic Excellence

Our ${primaryKeyword} programs are designed to provide students with:

### Core Strengths
- **World-Class Faculty**: Learn from renowned experts and industry leaders
- **Cutting-Edge Curriculum**: Stay ahead with the latest developments in ${primaryKeyword}
- **Research Opportunities**: Engage in groundbreaking research projects
- **Industry Connections**: Build networks with leading organizations

### Program Highlights

**Undergraduate Programs**
- Comprehensive foundation in ${primaryKeyword}
- Hands-on learning experiences
- Internship opportunities
- Global exchange programs

**Graduate Programs**
- Advanced specialization options
- Research-focused curriculum
- Industry partnerships
- Career advancement opportunities

## Campus Life and Facilities

### State-of-the-Art Facilities
- Modern laboratories and research centers
- Extensive library resources
- Technology-enabled classrooms
- Student recreation facilities

### Student Support Services
- Academic advising and mentoring
- Career counseling and placement
- International student support
- Scholarship and financial aid

## Admission Requirements

### Undergraduate Admission
- Academic transcripts and certificates
- English proficiency requirements
- Personal statement and essays
- Letters of recommendation

### Graduate Admission
- Bachelor's degree from accredited institution
- Relevant work experience (preferred)
- Research proposal (for research programs)
- Interview process

## International Students

We welcome students from around the world to join our diverse community:

### Support Services
- Visa and immigration assistance
- Orientation programs
- Cultural integration activities
- Housing assistance

### Scholarships and Financial Aid
- Merit-based scholarships
- Need-based financial assistance
- Research assistantships
- Work-study opportunities

## Career Outcomes

Our graduates excel in various fields:

### Career Paths
- Industry leadership roles
- Research and development
- Entrepreneurship and innovation
- Public sector and non-profit organizations

### Alumni Network
- Global network of successful professionals
- Mentorship opportunities
- Career advancement support
- Lifelong learning resources

## Research and Innovation

### Research Centers
- Cutting-edge research facilities
- Collaborative research projects
- Industry partnerships
- Publication opportunities

### Innovation Hub
- Startup incubation programs
- Technology transfer initiatives
- Patent and intellectual property support
- Entrepreneurship development

## Application Process

### How to Apply
1. **Complete Online Application**: Submit through our portal
2. **Submit Documents**: Provide all required materials
3. **Application Review**: Our team evaluates applications
4. **Interview Process**: Selected candidates participate in interviews
5. **Admission Decision**: Receive notification of admission status

### Important Dates
- Application Deadline: [Insert Date]
- Document Submission: [Insert Date]
- Interview Period: [Insert Date]
- Admission Notification: [Insert Date]

## Contact Information

Ready to start your journey? Contact us today:

- **Admissions Office**: [Contact Details]
- **International Office**: [Contact Details]
- **Academic Departments**: [Contact Details]
- **Student Services**: [Contact Details]

## Conclusion

Choosing the right institution for your ${primaryKeyword} education is a crucial decision. Our commitment to academic excellence, research innovation, and student success makes us the ideal choice for your educational journey.

Join our community of learners, researchers, and innovators. Apply today and take the first step toward achieving your academic and career goals.

For more information about our programs and admission process, visit our website or contact our admissions team.
    `.trim();
  }

  generateUniversityTitle({ title, keywords }) {
    const primaryKeyword = keywords[0];
    
    if (title.toLowerCase().includes('university') || title.toLowerCase().includes('college')) {
      return title;
    }
    
    const templates = [
      `${title} | Premier University for ${primaryKeyword}`,
      `Study ${primaryKeyword} at ${title}`,
      `${title} - Excellence in ${primaryKeyword} Education`,
      `${primaryKeyword} Programs | ${title}`,
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Utility methods
  formatKeywordsForContent(keywords) {
    return keywords.map(keyword => keyword.toLowerCase()).join(', ');
  }

  generateCallToAction(context, primaryKeyword) {
    if (context === 'blog') {
      return `Ready to learn more about ${primaryKeyword}? Explore our comprehensive resources and start your journey today!`;
    } else {
      return `Ready to pursue your education in ${primaryKeyword}? Apply now and join our community of excellence!`;
    }
  }

  optimizeContentLength(content, targetLength = 800) {
    const words = content.split(/\s+/);
    
    if (words.length < targetLength * 0.8) {
      // Content is too short, add more sections
      return content + '\n\n## Additional Resources\n\nFor more comprehensive information, explore our related articles and resources.';
    } else if (words.length > targetLength * 1.5) {
      // Content is too long, trim it
      return words.slice(0, targetLength).join(' ') + '...';
    }
    
    return content;
  }
}

export const contentGenerator = new ContentGenerator();

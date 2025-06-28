// This file defines the schema for our Supabase tables
// Use this as a reference when creating tables in Supabase

/*
Table: content_blocks
- Used for managing all editable content on the website
{
  id: uuid (primary key)
  page: string (e.g., 'home', 'about', 'services')
  section: string (e.g., 'hero', 'features', 'testimonials')
  identifier: string (unique identifier for the content block)
  content: jsonb (stores content in different formats: text, html, image_url, etc.)
  type: string (text, rich_text, image, video, etc.)
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
  metadata: jsonb (optional additional data)
}

Table: universities
{
  id: uuid (primary key)
  name: string
  logo_url: string
  banner_image_url: string
  country: string
  description: text
  detailed_description: text
  ranking: integer
  ranking_type: string
  website_url: string
  contact_info: jsonb
  programs: jsonb[] (array of program objects)
  fees_structure: jsonb (detailed fee information)
  admission_requirements: jsonb
  language_requirements: jsonb
  facilities: jsonb[]
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
  is_featured: boolean
  seo_metadata: jsonb
}

Table: programs
{
  id: uuid (primary key)
  university_id: uuid (foreign key)
  name: string
  type: string (bachelor, master, etc.)
  duration: string
  description: text
  tuition_fee: numeric
  currency: string
  admission_requirements: jsonb
  language_requirements: jsonb
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
}

Table: services
{
  id: uuid (primary key)
  name: string
  slug: string
  icon: string
  short_description: text
  detailed_description: text
  features: jsonb[]
  pricing: jsonb
  faqs: jsonb[]
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
  display_order: integer
}

Table: consultations
{
  id: uuid (primary key)
  student_name: string
  email: string
  phone: string
  preferred_date: timestamp
  alternate_date: timestamp
  service_type: string
  message: text
  status: string
  assigned_to: uuid
  notes: text
  created_at: timestamp
  updated_at: timestamp
}

Table: success_stories
{
  id: uuid (primary key)
  student_name: string
  university: string
  program: string
  year: integer
  story: text
  image_url: string
  testimonial: text
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
}

Table: admin_users
{
  id: uuid (primary key)
  email: string
  role: string
  permissions: jsonb
  last_login: timestamp
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
}

Table: media_library
{
  id: uuid (primary key)
  file_name: string
  file_type: string
  file_size: integer
  url: string
  alt_text: string
  caption: string
  tags: string[]
  uploaded_by: uuid
  created_at: timestamp
  metadata: jsonb
}

Table: seo_settings
{
  id: uuid (primary key)
  page_path: string
  title: string
  description: text
  keywords: string[]
  og_image: string
  created_at: timestamp
  updated_at: timestamp
}
*/

export const CONTENT_TYPES = {
  TEXT: 'text',
  RICH_TEXT: 'rich_text',
  IMAGE: 'image',
  VIDEO: 'video',
  HTML: 'html',
  JSON: 'json'
}

export const SERVICE_TYPES = {
  UNIVERSITY_SELECTION: 'university_selection',
  APPLICATION_ASSISTANCE: 'application_assistance',
  VISA_PROCESSING: 'visa_processing',
  SCHOLARSHIP_GUIDANCE: 'scholarship_guidance',
  TEST_PREPARATION: 'test_preparation',
  INTERVIEW_PREPARATION: 'interview_preparation',
  DOCUMENTATION_SUPPORT: 'documentation_support',
  PRE_DEPARTURE: 'pre_departure_orientation'
}

export const CONSULTATION_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}

/**
 * @typedef {Object} AdminUser
 * @property {string} id - UUID of the user
 * @property {string} email - User's email address
 * @property {'admin' | 'editor'} role - User's role
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} Page
 * @property {string} id - UUID of the page
 * @property {string} slug - URL-friendly identifier
 * @property {string} title - Page title
 * @property {Object} content - JSON content of the page
 * @property {string} [meta_description] - SEO meta description
 * @property {string} [meta_keywords] - SEO meta keywords
 * @property {boolean} published - Publication status
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} Section
 * @property {string} id - UUID of the section
 * @property {string} name - Section identifier
 * @property {Object} content - JSON content of the section
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} University
 * @property {string} id - UUID of the university
 * @property {string} name - University name
 * @property {string} [description] - University description
 * @property {string} [logo_url] - URL to university logo
 * @property {string} [website_url] - University website URL
 * @property {string} [location] - University location
 * @property {boolean} featured - Featured status
 * @property {Object} content - Additional JSON content
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} Program
 * @property {string} id - UUID of the program
 * @property {string} university_id - UUID of associated university
 * @property {string} name - Program name
 * @property {string} [description] - Program description
 * @property {string} [duration] - Program duration
 * @property {Object} fees - Program fees structure
 * @property {string} [requirements] - Program requirements
 * @property {Object} content - Additional JSON content
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} Service
 * @property {string} id - UUID of the service
 * @property {string} [category_id] - UUID of associated category
 * @property {string} title - Service title
 * @property {string} [description] - Service description
 * @property {string} [icon] - Service icon identifier
 * @property {Object} content - Additional JSON content
 * @property {boolean} featured - Featured status
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} ServiceCategory
 * @property {string} id - UUID of the category
 * @property {string} name - Category name
 * @property {string} [description] - Category description
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} id - UUID of the testimonial
 * @property {string} name - Author name
 * @property {string} [avatar_url] - URL to author avatar
 * @property {string} content - Testimonial content
 * @property {string} [university] - Associated university
 * @property {string} [program] - Associated program
 * @property {boolean} featured - Featured status
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} ContactRequest
 * @property {string} id - UUID of the contact request
 * @property {string} name - Contact name
 * @property {string} email - Contact email
 * @property {string} [phone] - Contact phone
 * @property {string} message - Contact message
 * @property {'pending' | 'contacted' | 'resolved'} status - Request status
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} id - UUID of the navigation item
 * @property {string} title - Navigation item title
 * @property {string} [url] - URL for the navigation item
 * @property {string} [parent_id] - UUID of parent item
 * @property {number} order - Display order
 * @property {boolean} visible - Visibility status
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

/**
 * @typedef {Object} Settings
 * @property {string} id - UUID of the setting
 * @property {string} key - Setting key
 * @property {any} value - Setting value
 * @property {string} [description] - Setting description
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {string} created_by - UUID of creator
 * @property {string} updated_by - UUID of last editor
 */

export const Database = {
  Tables: {
    admin_users: 'admin_users',
    pages: 'pages',
    sections: 'sections',
    universities: 'universities',
    programs: 'programs',
    services: 'services',
    service_categories: 'service_categories',
    testimonials: 'testimonials',
    contact_requests: 'contact_requests',
    navigation_items: 'navigation_items',
    settings: 'settings'
  }
};

export {};
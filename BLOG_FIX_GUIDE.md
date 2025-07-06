# Blog Posts Database Fix

## Issue
The blog posts are not showing because the database might be missing the required table or data.

## Solution Steps

### 1. Create the Blog Posts Table
Run the migration file to create the blog_posts table:

```sql
-- Go to your Supabase dashboard > SQL Editor and run:
-- Or use the migration file: migrations/create_blog_posts_table.sql
```

### 2. Insert Sample Blog Posts
Use the sample data file to populate the database:

```sql
-- Run the file: insert_sample_blog_posts.sql
-- This will create 3 sample blog posts for testing
```

### 3. Alternative: Use Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to Database > Tables
3. If blog_posts table doesn't exist, create it with these columns:
   - id (uuid, primary key, default: gen_random_uuid())
   - title (varchar)
   - slug (varchar, unique)
   - excerpt (text)
   - content (text)
   - author (varchar)
   - category (varchar)
   - tags (text[])
   - meta_title (varchar)
   - meta_description (text)
   - featured (boolean, default: false)
   - published (boolean, default: false)
   - reading_time (integer, default: 0)
   - created_at (timestamp, default: now())
   - updated_at (timestamp, default: now())

### 4. Manual Data Entry
You can also add blog posts manually using the Admin Panel:
1. Go to `/admin` in your app
2. Navigate to Blog Manager
3. Click "Add New Post"
4. Fill in the details and publish

## Fixed Issues
✅ Database query fallbacks for missing columns
✅ Proper error handling for published/featured columns
✅ Date field compatibility (published_at/created_at)
✅ Robust blog post fetching
✅ Related posts functionality

## Testing
After running the SQL scripts, you should be able to:
- View blog posts on `/blog` page
- Click on individual blog posts to view details
- See related posts at the bottom of each article
- Navigate between posts

The app will now gracefully handle missing database columns and provide fallback behavior.

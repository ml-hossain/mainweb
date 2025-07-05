# Blog Database Setup Instructions

To fix the blog page error and set up the blog management system, you need to create the `blog_posts` table in your Supabase database.

## Quick Fix (For Existing blog_posts Table)

**If you're getting "column featured does not exist" error:**

1. **Go to your Supabase Dashboard**
   - Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to "SQL Editor" in the sidebar

2. **Run the Update Migration**
   - Copy the entire contents of `/home/czhossain/mainweb/migrations/update_blog_posts_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

## Fresh Setup (For New Installation)

**If you don't have a blog_posts table yet:**

1. **Go to your Supabase Dashboard**
   - Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to "SQL Editor" in the sidebar

2. **Run the Full Migration**
   - Copy the entire contents of `/home/czhossain/mainweb/migrations/create_blog_posts_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

## Verify the Setup

- Go to "Table Editor" in the sidebar
- You should see a `blog_posts` table with all required columns
- The blog page at `http://localhost:3003/blog` should now work

## What This Creates

- **blog_posts table** with all necessary fields for blog management
- **Indexes** for better performance
- **Sample blog posts** for testing
- **Auto-updating timestamps** via triggers

## Sample Data Included

The migration includes 3 sample blog posts:
1. "Complete Guide to Study Abroad in 2024" (Featured)
2. "Top 10 Universities in Canada for International Students" (Featured)
3. "IELTS vs TOEFL: Which English Test Should You Take?"

## Admin Panel Access

After setup, you can access:
- **Blog Management**: `/admin/blog`
- **Create New Post**: `/admin/blog/new`
- **Edit Posts**: `/admin/blog/edit/:id`

## Table Schema

```sql
blog_posts (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(100),
    category VARCHAR(100),
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Features Available After Setup

✅ **Blog Page** - Public blog listing with search and filters  
✅ **Blog Management** - Admin panel for managing posts  
✅ **Blog Editor** - Rich text editor with SEO tools  
✅ **SEO Optimization** - Advanced SEO tool with Bangladesh market focus  
✅ **Responsive Design** - Mobile-friendly throughout  
✅ **Real-time Features** - Live search, filtering, and analytics  

## Troubleshooting

If you still see errors after setup:
1. **Check Supabase connection** - Verify your `.env` file has correct Supabase credentials
2. **Clear browser cache** - Hard refresh the page (Ctrl+F5 / Cmd+Shift+R)
3. **Check table permissions** - Ensure the table is publicly readable for published posts
4. **Verify data** - Check if sample posts were inserted correctly

## Next Steps

1. Set up the database table (above)
2. Access `/admin/blog` to manage posts
3. Create your first blog post
4. Customize the SEO settings for Bangladesh market
5. Publish and test the public blog page

The blog system is now fully integrated with your existing admin panel and uses the same authentication system as the university management.

-- Create admin_users table with RLS policies
create table admin_users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_users
alter table admin_users enable row level security;

-- RLS policies for admin_users
create policy "Admin users can view all users"
  on admin_users for select
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

create policy "Admin users can insert users"
  on admin_users for insert
  with check (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

create policy "Admin users can update users"
  on admin_users for update
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

create policy "Admin users can delete users"
  on admin_users for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create pages table for content management
create table pages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content jsonb not null default '{}',
  meta_description text,
  meta_keywords text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on pages
alter table pages enable row level security;

-- RLS policies for pages
create policy "Authenticated users can view published pages"
  on pages for select
  using (published = true or auth.uid() in (select id from admin_users));

create policy "Admin and editors can insert pages"
  on pages for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update pages"
  on pages for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete pages"
  on pages for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create sections table for homepage and other dynamic sections
create table sections (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  content jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on sections
alter table sections enable row level security;

-- RLS policies for sections
create policy "Anyone can view sections"
  on sections for select
  to public
  using (true);

create policy "Admin and editors can insert sections"
  on sections for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update sections"
  on sections for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete sections"
  on sections for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create universities table
create table universities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo_url text,
  website_url text,
  location text,
  featured boolean default false,
  content jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on universities
alter table universities enable row level security;

-- RLS policies for universities
create policy "Anyone can view universities"
  on universities for select
  to public
  using (true);

create policy "Admin and editors can insert universities"
  on universities for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update universities"
  on universities for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete universities"
  on universities for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create programs table
create table programs (
  id uuid default gen_random_uuid() primary key,
  university_id uuid references universities on delete cascade not null,
  name text not null,
  description text,
  duration text,
  fees jsonb not null default '{}',
  requirements text,
  content jsonb not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on programs
alter table programs enable row level security;

-- RLS policies for programs
create policy "Anyone can view programs"
  on programs for select
  to public
  using (true);

create policy "Admin and editors can insert programs"
  on programs for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update programs"
  on programs for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete programs"
  on programs for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create services table
create table services (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references service_categories on delete set null,
  title text not null,
  description text,
  icon text,
  content jsonb not null default '{}',
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Create service_categories table
create table service_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on services and service_categories
alter table services enable row level security;
alter table service_categories enable row level security;

-- RLS policies for services
create policy "Anyone can view services"
  on services for select
  to public
  using (true);

create policy "Admin and editors can insert services"
  on services for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update services"
  on services for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete services"
  on services for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- RLS policies for service_categories
create policy "Anyone can view service categories"
  on service_categories for select
  to public
  using (true);

create policy "Admin and editors can insert service categories"
  on service_categories for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update service categories"
  on service_categories for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete service categories"
  on service_categories for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create testimonials table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  content text not null,
  image_url text,
  rating integer check (rating >= 1 and rating <= 5),
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on testimonials
alter table testimonials enable row level security;

-- RLS policies for testimonials
create policy "Anyone can view testimonials"
  on testimonials for select
  to public
  using (true);

create policy "Admin and editors can insert testimonials"
  on testimonials for insert
  with check (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update testimonials"
  on testimonials for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete testimonials"
  on testimonials for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create contact_requests table
create table contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contact_requests
alter table contact_requests enable row level security;

-- RLS policies for contact_requests
create policy "Anyone can insert contact requests"
  on contact_requests for insert
  to public
  with check (true);

create policy "Admin and editors can view contact requests"
  on contact_requests for select
  using (auth.uid() in (select id from admin_users));

create policy "Admin and editors can update contact requests"
  on contact_requests for update
  using (auth.uid() in (select id from admin_users));

create policy "Only admins can delete contact requests"
  on contact_requests for delete
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create navigation table for menu management
create table navigation (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references navigation(id) on delete cascade,
  url text not null,
  order_index integer not null default 0,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on navigation
alter table navigation enable row level security;

-- RLS policies for navigation
create policy "Anyone can view navigation"
  on navigation for select
  to public
  using (true);

create policy "Only admins can manage navigation"
  on navigation for all
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create settings table for global website settings
create table settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null
);

-- Enable RLS on settings
alter table settings enable row level security;

-- RLS policies for settings
create policy "Anyone can view settings"
  on settings for select
  to public
  using (true);

create policy "Only admins can manage settings"
  on settings for all
  using (auth.uid() in (select au.id from admin_users au where au.role = 'admin'));

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_admin_users_updated_at
  before update on admin_users
  for each row
  execute function update_updated_at_column();

create trigger update_pages_updated_at
  before update on pages
  for each row
  execute function update_updated_at_column();

create trigger update_sections_updated_at
  before update on sections
  for each row
  execute function update_updated_at_column();

create trigger update_universities_updated_at
  before update on universities
  for each row
  execute function update_updated_at_column();

create trigger update_programs_updated_at
  before update on programs
  for each row
  execute function update_updated_at_column();

create trigger update_services_updated_at
  before update on services
  for each row
  execute function update_updated_at_column();

create trigger update_service_categories_updated_at
  before update on service_categories
  for each row
  execute function update_updated_at_column();

create trigger update_testimonials_updated_at
  before update on testimonials
  for each row
  execute function update_updated_at_column();

create trigger update_contact_requests_updated_at
  before update on contact_requests
  for each row
  execute function update_updated_at_column();

create trigger update_navigation_updated_at
  before update on navigation
  for each row
  execute function update_updated_at_column();

create trigger update_settings_updated_at
  before update on settings
  for each row
  execute function update_updated_at_column();

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES navigation_items(id),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for navigation_items
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to navigation_items"
    ON navigation_items FOR SELECT
    USING (true);

CREATE POLICY "Allow admin update access to navigation_items"
    ON navigation_items FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM admin_users WHERE role = 'admin'
        )
    );

-- Create trigger for navigation_items
CREATE TRIGGER update_navigation_items_updated_at
    BEFORE UPDATE ON navigation_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
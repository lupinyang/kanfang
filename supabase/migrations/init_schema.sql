-- Create properties table
create table properties (
  id uuid default gen_random_uuid() primary key,
  administrative_district text not null,
  plate text,
  address text not null,
  floor text,
  area numeric not null,
  age integer,
  total_price numeric not null,
  unit_price numeric not null,
  estimated_rent numeric,
  decoration text check (decoration in ('毛坯', '简装', '精装', '豪装')),
  decoration_images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create facilities table (related to properties)
-- Using JSONB to store facilities is easier given the dynamic structure, 
-- but a separate table is cleaner for relational queries. 
-- However, given the requirement "view all data", a JSONB column in properties 
-- or a simple related table is fine. Let's use a related table for better queryability.
create table property_facilities (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete cascade not null,
  type text not null check (type in ('subway', 'medical', 'school', 'business')),
  name text not null,
  distance text, -- Keep as text to allow flexible input or convert to number if strictly meters
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index properties_district_idx on properties(administrative_district);
create index properties_total_price_idx on properties(total_price);
create index properties_area_idx on properties(area);

-- Enable RLS (Row Level Security) - allowing public access for demo purposes
-- In production, you'd restrict this to authenticated users
alter table properties enable row level security;
alter table property_facilities enable row level security;

create policy "Allow public read access" on properties for select using (true);
create policy "Allow public insert access" on properties for insert with check (true);
create policy "Allow public update access" on properties for update using (true);
create policy "Allow public delete access" on properties for delete using (true);

create policy "Allow public read access" on property_facilities for select using (true);
create policy "Allow public insert access" on property_facilities for insert with check (true);
create policy "Allow public update access" on property_facilities for update using (true);
create policy "Allow public delete access" on property_facilities for delete using (true);

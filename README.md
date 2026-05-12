# Secco Take-Home Leads Page

## Overview
This nextjs app provides a leads page for users to input their name, email, company, source, and a message to a supabase database. These leads can then be viewed on the /leads page. The user inputs are validated client-side, then POSTed to a server endpoint where the data is input into the database and forwarded to a Secco webhook endpoint. 

## Supabase Leads Table

```sql 
CREATE TABLE leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  company text,
  hear_about_us text NOT NULL CHECK (
    hear_about_us IN ('Google', 'Referral', 'Social', 'Other')
  ),
  message text,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
); 
```

### RLS Policy

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

Allowing anon users to insert is not necessary, since inserting can be done on the server with the proper credentials.

## To Run Locally
First, there needs to be a hosted supabase database with a leads table that is created with the SQL code above. Next, the following environment variables must be defined in a .env file.

### .env file 
```
SUPABASE_SERVICE_ROLE_KEY=************
SUPABASE_URL=**********
WEBHOOK_URL=**********
```
The supabase URL and role key can be found on the deployed supabase dashboard. Once the .env file and supabase database are set up, the web app can be run locally using
```
npm run dev
```
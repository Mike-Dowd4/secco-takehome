# Secco Take-Home Leads Page


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
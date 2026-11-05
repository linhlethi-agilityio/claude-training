CREATE TYPE finance_type AS ENUM ('income', 'expense');

CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  name varchar NOT NULL,
  image_url varchar,
  type finance_type NOT NULL
);

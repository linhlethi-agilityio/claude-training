CREATE TABLE IF NOT EXISTS wallets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name varchar NOT NULL,
  currency varchar NOT NULL,
  balance bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION get_total_balance(user_id_input uuid)
RETURNS bigint AS $$
  SELECT COALESCE(SUM(balance), 0) FROM wallets WHERE user_id = user_id_input;
$$ LANGUAGE sql;

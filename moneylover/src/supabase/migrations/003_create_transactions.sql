CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  wallet_id uuid REFERENCES wallets(id) NOT NULL,
  type finance_type NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  amount bigint NOT NULL,
  note text DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

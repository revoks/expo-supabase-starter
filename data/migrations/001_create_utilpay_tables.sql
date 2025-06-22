-- Create accounts table for properties
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  address TEXT NOT NULL,
  contract_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_accounts table for utility services
CREATE TABLE service_accounts (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  account_number TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('electricity', 'water', 'gas', 'internet', 'heating', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE payment_methods (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('visa', 'mastercard', 'amex')),
  last_four TEXT NOT NULL,
  expiry_month TEXT NOT NULL,
  expiry_year TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bills table
CREATE TABLE bills (
  id BIGSERIAL PRIMARY KEY,
  service_account_id BIGINT REFERENCES service_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method_id BIGINT REFERENCES payment_methods(id),
  provider TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_service_accounts_account_id ON service_accounts(account_id);
CREATE INDEX idx_service_accounts_type ON service_accounts(type);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_primary ON payment_methods(is_primary);
CREATE INDEX idx_bills_service_account_id ON bills(service_account_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- Enable Row Level Security (RLS)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" ON accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for service_accounts
CREATE POLICY "Users can view service accounts for their properties" ON service_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM accounts 
      WHERE accounts.id = service_accounts.account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert service accounts for their properties" ON service_accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts 
      WHERE accounts.id = service_accounts.account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update service accounts for their properties" ON service_accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM accounts 
      WHERE accounts.id = service_accounts.account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete service accounts for their properties" ON service_accounts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM accounts 
      WHERE accounts.id = service_accounts.account_id 
      AND accounts.user_id = auth.uid()
    )
  );

-- Create RLS policies for payment_methods
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for bills
CREATE POLICY "Users can view bills for their service accounts" ON bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM service_accounts 
      JOIN accounts ON accounts.id = service_accounts.account_id
      WHERE service_accounts.id = bills.service_account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert bills for their service accounts" ON bills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_accounts 
      JOIN accounts ON accounts.id = service_accounts.account_id
      WHERE service_accounts.id = bills.service_account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update bills for their service accounts" ON bills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM service_accounts 
      JOIN accounts ON accounts.id = service_accounts.account_id
      WHERE service_accounts.id = bills.service_account_id 
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete bills for their service accounts" ON bills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM service_accounts 
      JOIN accounts ON accounts.id = service_accounts.account_id
      WHERE service_accounts.id = bills.service_account_id 
      AND accounts.user_id = auth.uid()
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_accounts_updated_at BEFORE UPDATE ON service_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
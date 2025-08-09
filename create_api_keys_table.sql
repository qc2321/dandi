-- Create api_keys table from scratch
-- This script should be run in your Supabase SQL editor

-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,  -- Made nullable for testing flexibility
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    usage INTEGER DEFAULT 0,
    limit_count INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to users table (nullable)
ALTER TABLE api_keys 
ADD CONSTRAINT fk_api_keys_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(value);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for development (more permissive)
CREATE POLICY "Allow all operations for development" ON api_keys
    FOR ALL USING (true) WITH CHECK (true);

-- Alternative: More specific policy that allows operations with or without user_id
-- Uncomment the following if you want more specific control:
-- CREATE POLICY "Allow operations for authenticated users or service role" ON api_keys
--     FOR ALL USING (
--         auth.role() = 'authenticated' OR 
--         auth.role() = 'service_role' OR 
--         user_id IS NULL
--     ) WITH CHECK (
--         auth.role() = 'authenticated' OR 
--         auth.role() = 'service_role' OR 
--         user_id IS NULL
--     );

-- Create trigger function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for api_keys table
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_api_keys_updated_at();

-- Add comments for documentation
COMMENT ON TABLE api_keys IS 'Stores API keys for authenticated users with rate limiting';
COMMENT ON COLUMN api_keys.id IS 'Unique identifier for the API key';
COMMENT ON COLUMN api_keys.user_id IS 'Foreign key reference to the users table (nullable for testing)';
COMMENT ON COLUMN api_keys.name IS 'User-defined name for the API key';
COMMENT ON COLUMN api_keys.value IS 'The actual API key value';
COMMENT ON COLUMN api_keys.usage IS 'Current usage count for the API key';
COMMENT ON COLUMN api_keys.limit_count IS 'Maximum allowed usage count for the API key';
COMMENT ON COLUMN api_keys.created_at IS 'Timestamp when the API key was created';
COMMENT ON COLUMN api_keys.updated_at IS 'Timestamp when the API key was last updated';

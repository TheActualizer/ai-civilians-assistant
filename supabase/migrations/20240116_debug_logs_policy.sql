-- Enable RLS
ALTER TABLE debug_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting debug logs
CREATE POLICY "Enable insert for authenticated users only" 
ON debug_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running database migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
    
    if (error) {
      // Try running the SQL directly through the REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql })
      });
      
      if (!response.ok) {
        // Alternative: Execute statements one by one
        const statements = sql.split(';').filter(s => s.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            // Note: Supabase JS client doesn't directly support raw SQL execution
            // You'll need to run this through the Supabase dashboard
          }
        }
        
        console.log('\n⚠️  Could not execute migration automatically.');
        console.log('Please run the migration manually through the Supabase dashboard:');
        console.log('1. Go to https://axgyrbqwfmumzrkidkdv.supabase.co');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Paste the contents of supabase/migrations/001_initial_schema.sql');
        console.log('4. Click "Run"');
        return;
      }
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    console.log('\n⚠️  Please run the migration manually through the Supabase dashboard.');
  }
}

runMigration();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const employees = [
  'Adison Allen',
  'Amberly Allen', 
  'Ameen Elassi',
  'Angela Kramer',
  'Ann Halsey',
  'Brandee Health',
  'Britany Hipp',
  'Brittny Martell',
  'Buford Eeds',
  'Damarcus Bowers',
  'Daquan Aaron',
  'Darrien Murphy',
  'Emily Hansen',
  'Gabby Stapleton',
  'George Sanchez',
  'Jaffer Al Yasari',
  'Jeanne Johnson',
  'Jenine Loving Drake',
  'Jerrica Epps',
  'John Loftin',
  'Jovanny Perales',
  'Kelly Henderson',
  'Kristi Smith',
  'Laura Sherman',
  'Mario Aranda',
  'Marvin Gonzalez',
  'Megan Brainard',
  'Nick Baldwin',
  'Peter Bartlett',
  'Randy Enish',
  'Rani Kliebert',
  'Sean Hansen',
  'Shauna Pirotte',
  'Sunne Dugas',
  'Susie Ashcraft',
  'Tammi Sobities'
];

async function importEmployees() {
  console.log(`Importing ${employees.length} employees...`);
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert(employees.map(name => ({ name })))
      .select();
    
    if (error) {
      console.error('Error importing employees:', error);
      return;
    }
    
    console.log(`✅ Successfully imported ${data.length} employees!`);
  } catch (err) {
    console.error('Import failed:', err);
  }
}

importEmployees();
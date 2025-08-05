const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Session dates (Fridays)  
const sessionDates = {
  'Movie': '2024-07-18', // Oldest (first session)
  'Anywhere in the World': '2024-07-25', // Middle  
  'Childhood Toy': '2024-08-01' // Most recent
};

async function updateSessionDates() {
  try {
    console.log('Fetching existing sessions...');
    const { data: sessions, error: fetchError } = await supabase
      .from('sessions')
      .select('*');
    
    if (fetchError) throw fetchError;
    
    for (const session of sessions) {
      const question = session.question;
      const targetDate = sessionDates[question];
      
      if (targetDate) {
        // Set to Friday at 2 PM (typical meeting time)
        const dateTime = new Date(`${targetDate}T14:00:00.000Z`);
        
        console.log(`Updating "${question}" to ${dateTime.toISOString()}`);
        
        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            created_at: dateTime.toISOString(),
            completed_at: dateTime.toISOString()
          })
          .eq('id', session.id);
        
        if (updateError) {
          console.error('Error updating session date:', updateError);
        }
      }
    }
    
    console.log('\n✅ Session dates updated successfully!');
  } catch (error) {
    console.error('Date update failed:', error);
  }
}

updateSessionDates();
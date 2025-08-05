const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSessions() {
  try {
    console.log('Fetching existing sessions...');
    const { data: sessions, error: fetchError } = await supabase
      .from('sessions')
      .select('*');
    
    if (fetchError) throw fetchError;
    
    for (const session of sessions) {
      let question = session.question;
      let asked_by = null;
      
      // Extract asker from question format "Question (Asker)"
      const match = question.match(/^(.+?)\s*\(([^)]+)\)$/);
      if (match) {
        question = match[1].trim();
        asked_by = match[2].trim();
        
        console.log(`Updating session: "${question}" -> asked by: ${asked_by}`);
        
        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            question: question,
            asked_by: asked_by
          })
          .eq('id', session.id);
        
        if (updateError) {
          console.error('Error updating session:', updateError);
        }
      }
    }
    
    console.log('\n✅ Sessions updated successfully!');
  } catch (error) {
    console.error('Update failed:', error);
  }
}

updateSessions();
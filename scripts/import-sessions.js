const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Session data from the PDF
const sessions = [
  {
    question: 'Movie',
    asked_by: 'Laura',
    answers: [
      { name: 'Adison Allen', answer: 'The Game' },
      { name: 'Amberly Allen', answer: 'Mary Poppins and 300' },
      { name: 'Ameen Elassi', answer: 'The Longest Yard' },
      { name: 'Angela Kramer', answer: 'The Princess Bride' },
      { name: 'Ann Halsey', answer: 'The Goonies' },
      { name: 'Brandee Health', answer: 'The Blind Side' },
      { name: 'Britany Hipp', answer: 'The Greatest Showman' },
      { name: 'Brittny Martell', answer: 'The Secret Life of Walter Mitty' },
      { name: 'Buford Eeds', answer: 'Forrest Gump' },
      { name: 'Damarcus Bowers', answer: 'This is the End' },
      { name: 'Daquan Aaron', answer: 'Diary of a Mad Black Woman' },
      { name: 'Darrien Murphy', answer: 'Freedom Writers' },
      { name: 'Emily Hansen', answer: 'The Princess Bride' },
      { name: 'Gabby Stapleton', answer: 'Bridesmaids' },
      { name: 'George Sanchez', answer: 'Life or the Top Gun movies' },
      { name: 'Jaffer Al Yasari', answer: 'Step Brothers' },
      { name: 'Jeanne Johnson', answer: 'Meet Joe Black and With Honors' },
      { name: 'Jenine Loving Drake', answer: '300' },
      { name: 'Jerrica Epps', answer: 'Bad Boys: Ride or Die' },
      { name: 'John Loftin', answer: 'Anchorman' },
      { name: 'Jovanny Perales', answer: 'The Mask' },
      { name: 'Kelly Henderson', answer: 'Something Borrowed' },
      { name: 'Kristi Smith', answer: 'Gone With The Wind' },
      { name: 'Laura Sherman', answer: 'Overboard' },
      { name: 'Mario Aranda', answer: 'The Martian' },
      { name: 'Marvin Gonzalez', answer: 'Old School Interstellar' },
      { name: 'Megan Brainard', answer: 'Titanic' },
      { name: 'Nick Baldwin', answer: 'Avengers: End Game' },
      { name: 'Peter Bartlett', answer: 'The Shawshank Redemption' },
      { name: 'Randy Enish', answer: 'Coco' },
      { name: 'Rani Kliebert', answer: 'Ever After' },
      { name: 'Sean Hansen', answer: 'The Deer Hunter' },
      { name: 'Shauna Pirotte', answer: 'How to Lose a Guy in 10 Days' },
      { name: 'Sunne Dugas', answer: 'Chicago' },
      { name: 'Susie Ashcraft', answer: 'Harry Potter' },
      { name: 'Tammi Sobities', answer: 'Pretty in Pink' }
    ]
  },
  {
    question: 'Anywhere in the World',
    asked_by: 'Angela',
    answers: [
      { name: 'Adison Allen', answer: 'Antartica' },
      { name: 'Amberly Allen', answer: 'Tokyo' },
      { name: 'Ameen Elassi', answer: 'Australia' },
      { name: 'Angela Kramer', answer: 'Indonesia' },
      { name: 'Ann Halsey', answer: 'Canary Islands' },
      { name: 'Brandee Health', answer: 'Argentia' },
      { name: 'Britany Hipp', answer: 'Africa' },
      { name: 'Brittny Martell', answer: 'Denmark' },
      { name: 'Buford Eeds', answer: 'Tokyo/Osaka' },
      { name: 'Damarcus Bowers', answer: 'Iceland/Europe' },
      { name: 'Daquan Aaron', answer: 'Shung Ching China' },
      { name: 'Darrien Murphy', answer: 'Norway' },
      { name: 'Emily Hansen', answer: 'Brazil' },
      { name: 'Gabby Stapleton', answer: null }, // No answer recorded
      { name: 'George Sanchez', answer: 'Brazil' },
      { name: 'Jaffer Al Yasari', answer: null }, // No answer recorded
      { name: 'Jeanne Johnson', answer: 'Galapagos' },
      { name: 'Jenine Loving Drake', answer: 'Mt Rushmore' },
      { name: 'Jerrica Epps', answer: 'Bora Bora' },
      { name: 'John Loftin', answer: 'Switerland' },
      { name: 'Jovanny Perales', answer: 'Switerland' },
      { name: 'Kelly Henderson', answer: 'Greece' },
      { name: 'Kristi Smith', answer: 'Italy' },
      { name: 'Laura Sherman', answer: 'New Zealand' },
      { name: 'Mario Aranda', answer: 'Istanbul' },
      { name: 'Marvin Gonzalez', answer: 'Argentia' },
      { name: 'Megan Brainard', answer: 'Australia' },
      { name: 'Nick Baldwin', answer: 'Dubai' },
      { name: 'Peter Bartlett', answer: 'Canadian Rockies' },
      { name: 'Randy Enish', answer: 'Cost Rica' },
      { name: 'Rani Kliebert', answer: 'Ireland' },
      { name: 'Sean Hansen', answer: 'Ireland' },
      { name: 'Shauna Pirotte', answer: 'Italy' },
      { name: 'Sunne Dugas', answer: 'Cicily Polermo' },
      { name: 'Susie Ashcraft', answer: 'Amsterdam' },
      { name: 'Tammi Sobities', answer: 'Rio' }
    ]
  },
  {
    question: 'Childhood Toy',
    asked_by: 'Kelly',
    answers: [
      { name: 'Adison Allen', answer: 'Knex set/Legos' },
      { name: 'Amberly Allen', answer: 'GI Joes' },
      { name: 'Ameen Elassi', answer: 'Nintendo DS' },
      { name: 'Angela Kramer', answer: 'Pinky the Bear' },
      { name: 'Ann Halsey', answer: 'Playground at the beach' },
      { name: 'Brandee Health', answer: 'Cabbage Patch doll Poppins' },
      { name: 'Britany Hipp', answer: 'White bear and wardrobe' },
      { name: 'Brittny Martell', answer: 'Power Rangers/Nintedo 64' },
      { name: 'Buford Eeds', answer: 'Dirt bike' },
      { name: 'Damarcus Bowers', answer: 'Sports & video games' },
      { name: 'Daquan Aaron', answer: 'Wrestling figures & Transformers' },
      { name: 'Darrien Murphy', answer: 'Bop-It' },
      { name: 'Emily Hansen', answer: 'Teddy Ruskpin' },
      { name: 'Gabby Stapleton', answer: null }, // No answer recorded
      { name: 'George Sanchez', answer: null }, // No answer recorded
      { name: 'Jaffer Al Yasari', answer: null }, // No answer recorded
      { name: 'Jeanne Johnson', answer: 'Odd Ogg' },
      { name: 'Jenine Loving Drake', answer: 'Dump truck found at the park' },
      { name: 'Jerrica Epps', answer: 'Giga Pet' },
      { name: 'John Loftin', answer: 'Super Nintendo/Sega tossup' },
      { name: 'Jovanny Perales', answer: 'Nintendo 64' },
      { name: 'Kelly Henderson', answer: 'Dollhouse built by Grandpa' },
      { name: 'Kristi Smith', answer: 'Mrs. Beasly doll/Green Machine/Hippity Hop' },
      { name: 'Laura Sherman', answer: 'Chrissy doll' },
      { name: 'Mario Aranda', answer: '10-speed bike/Hungry Hungry Hippo' },
      { name: 'Marvin Gonzalez', answer: 'Nintendo 64' },
      { name: 'Megan Brainard', answer: 'Polly Pockets/Water Babies' },
      { name: 'Nick Baldwin', answer: 'Baseball glove/Xbox' },
      { name: 'Peter Bartlett', answer: 'John Deere tractor' },
      { name: 'Randy Enish', answer: 'Pennyboard' },
      { name: 'Rani Kliebert', answer: 'Dance shoes/Mancala' },
      { name: 'Sean Hansen', answer: 'Baseball glove/guitar' },
      { name: 'Shauna Pirotte', answer: 'Toolbox Caboodle' },
      { name: 'Sunne Dugas', answer: 'Moonshoes/Skip-It' },
      { name: 'Susie Ashcraft', answer: 'Polly Pockets' },
      { name: 'Tammi Sobities', answer: 'Easy Bake Oven/Pogo Stick' }
    ]
  }
];

async function importSessions() {
  try {
    console.log('Fetching employees from database...');
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');
    
    if (empError) throw empError;
    
    // Create a map of employee names to IDs
    const employeeMap = {};
    employees.forEach(emp => {
      employeeMap[emp.name] = emp.id;
    });

    for (const sessionData of sessions) {
      console.log(`\nImporting session: "${sessionData.question}" (asked by ${sessionData.asked_by})`);
      
      // Create the session (without asked_by for now since column may not exist)
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          question: `${sessionData.question} (${sessionData.asked_by})`,
          completed_at: new Date().toISOString() // Mark as completed since these are past sessions
        })
        .select()
        .single();
      
      if (sessionError) {
        console.error('Error creating session:', sessionError);
        continue;
      }
      
      console.log(`Created session with ID: ${session.id}`);
      
      // Prepare answers for batch insert
      const answersToInsert = [];
      for (const answerData of sessionData.answers) {
        const employeeId = employeeMap[answerData.name];
        if (!employeeId) {
          console.warn(`Employee not found: ${answerData.name}`);
          continue;
        }
        
        answersToInsert.push({
          session_id: session.id,
          employee_id: employeeId,
          answer: answerData.answer
        });
      }
      
      // Batch insert answers
      if (answersToInsert.length > 0) {
        const { error: answersError } = await supabase
          .from('answers')
          .insert(answersToInsert);
        
        if (answersError) {
          console.error('Error inserting answers:', answersError);
        } else {
          console.log(`Inserted ${answersToInsert.length} answers`);
        }
      }
    }
    
    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importSessions();
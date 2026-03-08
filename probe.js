import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vapvmlwrtwiiuxxutufg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcHZtbHdydHdpaXV4eHV0dWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NjMzMTgsImV4cCI6MjA4MjAzOTMxOH0.WK3KKEZ_AVwdaIDqd1ZW_GhjYg4jUSCWyPZYlWAffO4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function probe() {
  console.log('Probing students table...');
  const { data, error } = await supabase
    .from('students')
    .insert([
      {
        id: 'probe-id-123',
        email: 'probe@example.com',
        name: 'Probe',
        role: 'User',
        status: 'Pending',
        avatar: 'test'
      }
    ])
    .select();
  
  if (error) {
    console.error('Trigger Simulation Error:', error);
  } else {
    console.log('Insert succeeded!', data);
    // Cleanup if it succeeds
    await supabase.from('students').delete().eq('id', 'probe-id-123');
  }
}

probe();

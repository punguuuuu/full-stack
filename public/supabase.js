import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ikcjdcmqkrfxixdlkrmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrY2pkY21xa3JmeGl4ZGxrcm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDE3MzEsImV4cCI6MjA2MTM3NzczMX0.7flXo90-Ezb1x7_Nxviiy-g09Ql8mysZ_LSH584XW-w';
export const supabase = createClient(supabaseUrl, supabaseKey);
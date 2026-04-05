import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oripiayjtizlfukeyjlq.supabase.co"
const supabaseKey = "sb_publishable_EKAS9ao5wS4N8f6psRbZ4A_JuFzL8lT"

export const supabase = createClient(supabaseUrl, supabaseKey)
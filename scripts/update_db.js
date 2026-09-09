import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role key to bypass RLS/Auth easily

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Please add SUPABASE_SERVICE_ROLE_KEY to .env.local to run this script.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log("Setting up users...")
  
  // 1. Create Moon
  const { data: moonData, error: moonError } = await supabase.auth.admin.createUser({
    email: 'moon@gamehub.com',
    password: 'athxrvxaa',
    email_confirm: true,
    user_metadata: { role: 'developer', full_name: 'moon' }
  })
  
  if (moonError) console.log("Moon creation error (might exist):", moonError.message)
  const moonId = moonData?.user?.id

  // 2. Create Pushkqr
  const { data: pushData, error: pushError } = await supabase.auth.admin.createUser({
    email: 'pushkqr@gamehub.com',
    password: 'pushkar@123',
    email_confirm: true,
    user_metadata: { role: 'developer', full_name: 'Pushkqr' }
  })
  
  if (pushError) console.log("Pushkqr creation error (might exist):", pushError.message)
  const pushId = pushData?.user?.id

  console.log("Updating projects...")

  // 3. Delete Brahmin Simulator
  await supabase.from('projects').delete().ilike('title', '%Brahmin%')

  // 4. Update Cigarette Counter
  if (moonId) {
    await supabase.from('projects')
      .update({ 
        link: 'https://cigg-tracker.onrender.com',
        developer_id: moonId 
      })
      .ilike('title', '%Cigarette%')
  }

  // 5. Add Stonk Royale
  if (pushId) {
    await supabase.from('projects').insert([
      {
        title: 'Stonk Royale',
        tagline: 'Trade stocks like a battle royale.',
        overview: 'Experience the thrill of the stock market in a fast-paced, competitive environment.',
        icon: '📈',
        link: 'https://stonkroyale.me/',
        developer_id: pushId
      }
    ])
  }

  console.log("Database update complete!")
}

seed()

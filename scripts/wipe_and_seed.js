const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing keys.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  console.log("Wiping all existing auth users...")
  const { data: { users } } = await supabase.auth.admin.listUsers()
  for (const u of users) {
    await supabase.auth.admin.deleteUser(u.id)
  }

  console.log("Creating 5 new users...")
  
  // 1. Super Admin
  const { data: admin } = await supabase.auth.admin.createUser({
    email: 'gobu105@gamehub.com',
    password: 'Jatin@joshi105',
    email_confirm: true,
    user_metadata: { role: 'super_admin', full_name: 'Gobu105' }
  })

  // 2. Dev 1 (Pushkqr)
  const { data: dev1 } = await supabase.auth.admin.createUser({
    email: 'pushkqr@gamehub.com',
    password: 'pushkar@123',
    email_confirm: true,
    user_metadata: { role: 'developer', full_name: 'Pushkqr' }
  })

  // 3. Dev 2 (moon)
  const { data: dev2 } = await supabase.auth.admin.createUser({
    email: 'moon@gamehub.com',
    password: 'athxrvxaa',
    email_confirm: true,
    user_metadata: { role: 'developer', full_name: 'moon' }
  })

  // 4. User 1
  const { data: user1 } = await supabase.auth.admin.createUser({
    email: 'gamer1@gamehub.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'user', full_name: 'ProGamer1' }
  })

  // 5. User 2
  const { data: user2 } = await supabase.auth.admin.createUser({
    email: 'gamer2@gamehub.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { role: 'user', full_name: 'NoobMaster' }
  })

  console.log("Creating Projects...")
  
  const dev1Id = dev1?.user?.id
  const dev2Id = dev2?.user?.id

  const { data: stonk } = await supabase.from('projects').insert([
    {
      title: 'Stonk Royale',
      tagline: 'Trade stocks like a battle royale.',
      overview: 'Experience the thrill of the stock market in a fast-paced, competitive environment.',
      icon: '📈',
      link: 'https://stonkroyale.me/',
      developer_id: dev1Id
    }
  ]).select().single()

  const { data: cigg } = await supabase.from('projects').insert([
    {
      title: 'Cigarette Counter',
      tagline: 'Track your smoking habits.',
      overview: 'A simple app designed to help you monitor and eventually reduce your daily cigarette intake.',
      icon: '🚬',
      link: 'https://cigg-tracker.onrender.com',
      developer_id: dev2Id
    }
  ]).select().single()

  console.log("Creating Feedback...")
  
  if (stonk && user1) {
    await supabase.from('comments').insert({
      project_id: stonk.id,
      user_id: user1.user.id,
      user_name: 'ProGamer1',
      text: 'Great app! The UI is amazing.',
      rating: 5,
      is_bug_report: false
    })
  }

  if (cigg && user2) {
    await supabase.from('comments').insert({
      project_id: cigg.id,
      user_id: user2.user.id,
      user_name: 'NoobMaster',
      text: 'Found a small bug when trying to reset the counter.',
      is_bug_report: true,
      status: 'Open'
    })
  }

  console.log("All done!")
}

run()

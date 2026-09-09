const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Please add SUPABASE_SERVICE_ROLE_KEY to .env.local to run this script.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log("1. Wiping old data...")
  
  // Wipe all projects and comments
  await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Wipe all users
  const { data: { users } } = await supabase.auth.admin.listUsers()
  for (const u of users) {
    await supabase.auth.admin.deleteUser(u.id)
  }

  console.log("2. Creating the 5 new accounts...")

  // Accounts to create
  const accounts = [
    { email: 'gobu105@gamehub.local', password: 'Jatin@joshi105', role: 'super_admin', username: 'Gobu105' },
    { email: 'pushkqr@gamehub.local', password: 'pushkar@123', role: 'developer', username: 'pushkqr' },
    { email: 'athxrvxaa@gamehub.local', password: 'athxrvxaa', role: 'developer', username: 'athxrvxaa' },
    { email: 'player1@gamehub.local', password: 'password123', role: 'user', username: 'player1' },
    { email: 'player2@gamehub.local', password: 'password123', role: 'user', username: 'player2' },
  ]

  const userIds = {}

  for (const acc of accounts) {
    const { data } = await supabase.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: { role: acc.role, username: acc.username }
    })
    if (data?.user) {
      userIds[acc.username] = data.user.id
      console.log(`Created ${acc.username}`)
    }
  }

  console.log("3. Adding Projects...")

  if (userIds['pushkqr']) {
    await supabase.from('projects').insert([
      {
        id: 'stonk-royale',
        title: 'Stonk Royale',
        tagline: 'Trade stocks like a battle royale.',
        overview: 'Experience the thrill of the stock market in a fast-paced, competitive environment.',
        icon: '📈',
        link: 'https://stonkroyale.me/',
        developer_id: userIds['pushkqr']
      }
    ])
  }

  if (userIds['athxrvxaa']) {
    await supabase.from('projects').insert([
      {
        id: 'cigarette-counter',
        title: 'Cigarette Counter',
        tagline: 'Track your smoking habits.',
        overview: 'A simple app designed to help you monitor and eventually reduce your daily cigarette intake.',
        icon: '🚬',
        link: 'https://cigg-tracker.onrender.com',
        developer_id: userIds['athxrvxaa']
      }
    ])
  }

  console.log("4. Adding Mock Feedback...")
  
  if (userIds['player1'] && userIds['player2']) {
    await supabase.from('comments').insert([
      {
        project_id: 'stonk-royale',
        user_id: userIds['player1'],
        user_name: 'player1',
        text: 'This game is crazy! Lost all my virtual money in 5 minutes.',
        rating: 5,
        is_bug_report: false
      },
      {
        project_id: 'cigarette-counter',
        user_id: userIds['player2'],
        user_name: 'player2',
        text: 'The counter resets if I refresh the page too fast.',
        is_bug_report: true,
        status: 'Open'
      }
    ])
  }

  console.log("Database reset and seeded successfully!")
}

seed()

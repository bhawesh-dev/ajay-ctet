import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req) {
  const body = await req.json()
  const { name, phone, email } = body

  // check if user exists
  const { data: existingUser } = await supabaseAdmin
  .from('users')
  .select('*')
  .or(`phone.eq.${phone},email.eq.${email}`)
  .maybeSingle()

let user

if (existingUser) {
  user = existingUser
} else {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{ name, phone, email }])
    .select()
    .single()

  user = data
}

  return Response.json({ message: 'Apply success', user })
}
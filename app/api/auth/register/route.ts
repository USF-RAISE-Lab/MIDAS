import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {


  const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey!);

  try {
    const { email, username, password } = await request.json();
    // TODO: Validation

    const hashedPassword = await hash(password, 10);

    const { data, error } = await supabase
      .rpc('insert_user', {
        _email: email,
        _is_admin: true,
        _name: username,
        _password: hashedPassword,
        _school_id: 0
      })
    if (error) console.error(error)
    else console.log(data)

  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "SUCCESS" });
}

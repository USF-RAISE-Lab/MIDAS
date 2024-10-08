// lib/auth.ts
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { createClient } from "@supabase/supabase-js";
import { JWT } from "next-auth/jwt";

// Initialize Supabase client
const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

interface CustomToken extends JWT {
  username?: string;
  is_admin?: boolean;
  school_id?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    username: string;
    is_admin: boolean;
    school_id: string;
  };
}

export const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/',
  },

  callbacks: {
    jwt: async ({ token, user }: { token: any, user: any }) => {
      if (user) {
        const { data, error } = await supabase.rpc('get_user_from_id', {
          _id: user.id
        });

        if (error) {
          console.error("JWT callback - error:", error);
        } else {
          console.log("JWT callback - user data:", data);

          (token as CustomToken).username = data.name;
          (token as CustomToken).is_admin = data.is_admin;
          (token as CustomToken).school_id = data.school_id;
        }
      }

      return token;
    },

    session: async ({ session, token }: { session: any, token: any }) => {
      const customToken = token as CustomToken;
      const customSession = session as CustomSession;

      customSession.user.username = customToken.username!;
      customSession.user.is_admin = customToken.is_admin!;
      customSession.user.school_id = customToken.school_id!;

      return customSession;
    }
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        username: {},
        password: {}
      },

      async authorize(credentials, req) {
        const { data, error } = await supabase.rpc('get_user_from_username', {
          _username: credentials?.username,
        });

        if (error) {
          console.error(error);
          return null;
        }

        const user = data;

        const passwordCorrect = await compare(credentials!.password || '', user.password);

        if (passwordCorrect) {
          // Return an object that includes all properties required by NextAuth's User type
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username, // Add this
            is_admin: user.is_admin,  // Add this
            school_id: user.school_id // Add this
          };
        }

        return null;
      }
    })
  ]
};


import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { createClient } from "@supabase/supabase-js";
import { JWT } from "next-auth/jwt";
import useCurrentUser from "@/hooks/useCurrentUser";

// Update this when switching databases if needed
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

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/',
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      // Log the user object
      // console.log("JWT callback - user:", user);

      if (user) {
        const { data, error } = await supabase
          .rpc('get_user_from_id', {
            _id: user.id
          })

        if (error) {
          console.error("JWT callback - error:", error);
        } else {
          console.log("JWT callback - user data:", data);

          (token as CustomToken).username = data.name;
          (token as CustomToken).is_admin = data.is_admin;
          (token as CustomToken).school_id = data.school_id;
        }
      }

      // Log the token object
      // console.log("JWT callback - token:", token);

      return token;
    },
    session: async ({ session, token }) => {
      const customToken = token as CustomToken;
      const customSession = session as CustomSession;

      // Log the custom token object
      // console.log("Session callback - token:", customToken);

      customSession.user.username = customToken.username!;
      customSession.user.is_admin = customToken.is_admin!;
      customSession.user.school_id = customToken.school_id!;



      // Log the custom session object
      // console.log("Session callback - session:", customSession);

      return customSession;
    }
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: {},//{ label: "Email", type: "text" },
        username: {}, //{ label: "Username", type: "text" },
        password: {}//{ label: "Password", type: "password" }

      },

      async authorize(credentials, req) {
        // TODO: Validate email, username, and password

        // const currentUser = useCurrentUser()

        // console.log({currentUser})


        // Call Supabase database function to get the user associated with this username
        const { data, error } = await supabase.rpc('get_user_from_username', {
          _username: credentials?.username,
        });
        if (error) console.error(error);
        else console.log('Got user');

        const user = data;
        console.log({ user });

        // Compare encrypted password in db to inputted password
        const passwordCorrect = await compare(
          credentials!.password || '',
          user.password,
        );

        console.log(credentials);

        if (passwordCorrect) {
          console.log("User password is correct. Logging in.")

          // currentUser.setId(user.id);
          // currentUser.setUsername(user.name);
          // currentUser.setEmail(user.email);
          // currentUser.setIsAdmin(user.is_admin);
          // currentUser.setSchoolId(user.school_id);

          // console.log('Printing current user ', currentUser);
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }

        // console.log(credentials);


        console.log("Password was incorrect or another issue occured during login.")
        return null as any;
      }
    })
  ]
});


export { handler as GET, handler as POST };

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"



export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       authorization: {
        params: {
       prompt: "consent"

        }
      },
    }),
    Twitter({
   // eslint-disable-next-line turbo/no-undeclared-env-vars
   clientId: process.env.AUTH_TWITTER_ID!,
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
      version: "2.0" 
    })
   
  ],
  secret: process.env.AUTH_SECRET!,

})


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { db } from "@/lib/firebase";

export default NextAuth({
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // console.log(user)
      // console.log("======== jwt callbacks buka ==========")
      // console.log(user.providerId)
      // console.log("======== jwt callbacks tutup ==========")
      if(user){
        token.clinicId = user.clinicId
        token.name = user.name
        token.email = user.email
        token.clinicId = user.clinicId
        token.id = user.id
        token.isVerified = user.isVerified
        token.role = user.role
      }
      return token;
    },
    async session({ session, user, token }): Promise<Session> {
      console.log("======== session callbacks ==========");
      if(token && session.user){
        session.user.clinicId = token.clinicId
        session.user.name = token.name
        session.user.email = token.email
        session.user.clinicId = token.clinicId
        session.user.id = token.id
        session.user.isVerified = token.isVerified
        session.user.role = token.role
      }
      return session;
    },
    async signIn({ user }): Promise<boolean> {
      // console.log("======== sign in callbacks ==========")
      // console.log(user.email)
      return true;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || "",
          (credentials as any).password || ""
        )
          .then((userCredential) => {
            if (!userCredential.user) return null;
            console.log("halo masuk sini");
            const userData = {
              clinicId: "1",
              email: userCredential.user.email,
              id: userCredential.user.uid,
              image: userCredential.user.photoURL,
              isVerified: userCredential.user.emailVerified,
              name: userCredential.user.displayName,
              role: "admin",
            };
            return userData;
          })
          .catch((error) => {
            console.log("terjadi kesalahan");
            console.log(error);
          });
      },
    }),
  ],
});
// export default NextAuth(authOptions);

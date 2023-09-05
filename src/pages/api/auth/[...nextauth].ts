import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default NextAuth({
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
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
    async redirect({url, baseUrl}): Promise<string>{
      return url
    }
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
          .then( async (userCredential) => {
            if (!userCredential.user) return null;
            const userSnap = await getDoc(doc(db, "user", userCredential.user.uid))
            if(!userSnap.exists()) return null
            const userSnapData = userSnap.data()
            // ! BUAT DATA DIBAWAH POKOKNYA YANG WAJIB AMBIL DARI DB ITU CLINIC ID AJA
            const userData = {
              clinicId: userSnapData.clinic_id,
              email: userCredential.user.email,
              id: userCredential.user.uid,
              image: userSnapData.photoURL,
              isVerified: userCredential.user.emailVerified,
              name: userCredential.user.displayName,
              role: userSnapData.role,
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

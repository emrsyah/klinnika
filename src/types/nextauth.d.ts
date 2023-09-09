// nextauth.d.ts

import { Role } from "@/constant/role";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser extends DefaultUser {
  role: Role;
  isVerified: boolean,
  id: string;
  clinicId: string;
}

declare module "next-auth" {
  interface User extends IUser {}

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser  {}
}

// interface IUser extends DefaultUser {
//   role?: Role;
//   id: string;
//   outlet_id: number;
// }
// declare module "next-auth" {
//   interface User extends IUser {}
//   interface Session {
//     user?: User;
//   }
// }
// declare module "next-auth/jwt" {
//   interface JWT extends IUser {}
// }

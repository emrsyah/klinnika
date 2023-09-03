// nextauth.d.ts

export enum Role {
  admin = "admin",
  cashier = "cashier",
  inventary = "cashier",
}

declare module "next-auth" {
  interface User {
    role: Role;
    id: number;
    clinicId: number;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: number;
    clinicId: number;
  }
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

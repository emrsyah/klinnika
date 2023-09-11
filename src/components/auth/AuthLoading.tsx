"use client";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/AppIcon";

const HOME_ROUTE = "/test";
/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */

// TODOS - CEK: https://smy.hashnode.dev/authenticated-protected-role-based-routing-using-nextjs-and-hoc
// TODOS - CEK: https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/
// TODOS - CEK: https://reacthustle.com/blog/nextjs-setup-role-based-authentication

const AuthLoading = ({ children }: { children: React.ReactNode }) => {
  const { push } = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      //   toast.error("Please login first");
      push(HOME_ROUTE);
    },
  });

  const isUser = !!session?.user;

  return (
    <>
      {isUser ? (
        children
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <AppIcon />
          <span className="text-lg font-bold">Loading...</span>
          <Loader2 className="animate-spin text-2xl" />
        </div>
      )}
    </>
  );
};

export default AuthLoading;

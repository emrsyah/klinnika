"use client";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/nextauth";

const HOME_ROUTE = "/";
/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */

const AuthLoading = ({
  children,
  role,
  isPublic = false
}: {
  children: React.ReactNode;
  role: Role;
  isPublic?: boolean
}) => {
  const { push, back } = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      //   toast.error("Please login first");
      push(HOME_ROUTE);
    },
  });

  const isUser = !!session?.user;
  const user = session?.user;
  if (isUser) {
    if (user) {
      if (role === user.role) {
        setIsLoading(false)
      } else{
        back()
      }
    }
  }

  return (
    <>
      {isLoading && !isPublic ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
          <h1>Klinnika</h1>
          <span className="text-lg font-bold">Loading...</span>
          <Loader2 className="animate-spin text-2xl" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthLoading;

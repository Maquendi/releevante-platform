"use client";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: Record<string, any>;
}) {
  const accessId = searchParams?.access_id;
  const { loginClientId } = useAuth();
  useEffect(() => {
    if(accessId){
      loginClientId.mutate(accessId);
    }
  }, [accessId])
  
  return (
    <div className="h-screen grid place-content-center absolute backdrop-blur-sm   inset-0">
      {loginClientId.isPending && <p>Loading...</p>}
      {loginClientId.isSuccess && <p>Redirecting...</p>}
      {loginClientId.isError && (
        <>
          <p className="text-2xl font-medium mb-3">
            An error has occurred, signin in.
          </p>
          <Button
            className=" rounded-2xl w-fit m-auto hover:text-primary"
            onClick={() => loginClientId.mutate(accessId)}
          >
            Try again
          </Button>
        </>
      )}
    </div>
  );
}

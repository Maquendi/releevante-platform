"use server";

import LoginForm from "@/components/login";

export default async function LoginPage() {
  return (
    <>
      <div>
        <h2>Please Login</h2>
        <hr />
        <LoginForm />
        <hr />
      </div>
    </>
  );
}

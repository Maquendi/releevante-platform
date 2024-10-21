"use client";

import doLogin from "@/actions/user-actions";

export default function LoginForm() {

  return (
    <>
      <div className="Homepage">
        <form className="login-form" action={doLogin}>
          <div>
            <span>Enter Pin</span>
          </div>
          <hr />
          <div>
            <input
              id="userpin"
              name="userpin"
              type="text"
              required
              placeholder="enter las four digit of cellphone"
            />
          </div>
          <div>
            <button type="submit">Log in</button>
          </div>
        </form>
      </div>
    </>
  );
}

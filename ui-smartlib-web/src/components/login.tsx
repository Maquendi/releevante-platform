"use client";

import doLogin from "@/actions/user-actions";
import { useLocale } from "next-intl";
import { useFormState } from "react-dom";

export default function LoginForm() {

  //const [state, action] = useFormState(doLogin, undefined);
  //const router = useRouter();

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

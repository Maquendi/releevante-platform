'use client'

import { signinAction } from "./action";


const signin = () => {
  return (
    <div className="grid place-content-center bg-slate-400 min-h-screen">
      <div className="p-4 rounded-md bg-white">
        <h2 className="text-4xl text-black mb-5">Sign in</h2>
        <form action={signinAction} className="space-y-2">
          <div>
            <label className="text-black block">Passcode</label>
            <input className="border-1 p-2 text-black bg-blue-50 w-full outline-1" name="passcode" type="number"></input>
          </div>
          <button type="submit" className="text-black w-full p-3 bg-blue-200">Login</button>
        </form>
      </div>
    </div>
  );
};

export default signin;

'use client'
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/authContext"
import { cleanAuthError } from "@/helper/firebaseErrors";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signinWithEmailPass, signInError } = useAuth();
  const [processing,setProcessing]=useState<boolean>(false)
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setProcessing(true)
      signinWithEmailPass(email, password);
    } catch (error) {
      console.log(error);
    }
    finally{
      setProcessing(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F8]">
      {/* Left Section for Logo - Only on md and above */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#0A66C2]">
        <Image
          src="/assets/OneTeamlogoFinal.jpeg"
          alt="Organization Logo"
          width={200}
          height={200}
        />
      </div>

      {/* Right Section for Login */}
      <div className="flex w-full h-screen md:w-1/2 items-center justify-center p-6">
        <div className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl rounded-2xl p-8 w-full max-w-md">
          {/* Logo on small screens */}
          <div className="flex justify-center md:hidden mb-4">
            <Image
              src="/assets/OneTeamlogoFinal.jpeg"
              alt="Organization Logo"
              width={100}
              height={100}
            />
          </div>
          <h2 className="text-2xl font-bold text-[#0A66C2] mb-6 text-center">Login</h2>
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A66C2]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A66C2]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                required
              />
            </div>
            {
              signInError && <p className="text-right text-[12px] font-medium text-red-500">{cleanAuthError(signInError)}</p>
            }
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-[#34A853] text-white font-semibold hover:bg-green-600 transition"
            >
              {
                processing ? <p>Logging In ...</p>: <p>Login</p>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

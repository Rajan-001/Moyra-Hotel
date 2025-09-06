
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiTwitterXFill } from "react-icons/ri";


export default function Login({setSignUpModal,setLoginModal}:{
  setSignUpModal: (value: boolean) => void;
  setLoginModal: (value: boolean) => void;
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,SetName]=useState("")
  const router=useRouter()
  async function handleLogin() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/signin`, {
        method: "POST",
         credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password}),
      });

      const data = await res.json();
        console.log(res.ok)
      if (!res.ok) {
        alert(data.error || "SignIn failed");
        return;
      }
      else{
        router.push("/dashboard")
      }

     
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white/30 backdrop-blur-sm">
      <div className="relative w-[420px] min-h-[480px] bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 rounded-3xl shadow-2xl p-8 text-white">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-white  bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-white text-sm">Login to your account</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-white text-sm font-semibold mb-2">Username</label>
          <input 
            onChange={(e) => SetName(e.target.value)} 
            type="text" 
            placeholder="Enter your Username" 
            className="w-full p-3 border-2 border-slate-200 text-slate-900 rounded-xl text-base 
                       bg-white focus:border-amber-500 focus:bg-white transform 
                       transition-all duration-300 focus:translate-y-[-2px] focus:shadow-lg 
                       placeholder:text-slate-400 outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <label className="block text-white text-sm font-semibold mb-2">Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border-2 border-slate-200 text-slate-900 rounded-xl text-base 
                       bg-white focus:border-amber-500 focus:bg-white transform 
                       transition-all duration-300 focus:translate-y-[-2px] focus:shadow-lg 
                       placeholder:text-slate-400 outline-none"
          />
          <button className="absolute right-3 top-2/3 -translate-y-1/2 text-white hover:text-indigo-500">
            👁️
          </button>
        </div>

        {/* Login Button */}
        <button  
          onClick={handleLogin} 
          className="relative w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 
                     text-white p-4 rounded-xl font-semibold shadow-md hover:shadow-2xl 
                     transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                     active:translate-y-0 overflow-hidden group"
        >
          {/* Glow Ring Effect */}
          {/* <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-300"></span> */}
          
          {/* Shimmer Effect */}
          <span className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent 
                           transform skew-x-[-20deg] group-hover:animate-shimmer"></span>

          {/* Button Text */}
          <span className="relative z-10">✨ Login</span>
        </button>

        {/* Divider */}
        <div className="relative text-center my-8 text-white text-sm">
          <span className="bg-yellow-600 px-4 py-2 relative z-10 rounded-lg">Or login with</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-900 -z-10"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white text-slate-600 font-medium hover:border-indigo-500 hover:bg-white transform hover:-translate-y-1 hover:shadow-lg transition">
             <FcGoogle className="w-5 h-5" /> Google 
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-xl bg-white text-slate-600 font-medium hover:border-indigo-500 hover:bg-white transform hover:-translate-y-1 hover:shadow-lg transition">
             <RiTwitterXFill className="w-5 h-5"/> X 
          </button>
        </div>

        {/* Signup Redirect */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            Don’t have an account?
            <span onClick={()=>{setSignUpModal(true);setLoginModal(false);}} className="text-yellow-600 font-semibold cursor-pointer hover:text-white ml-2">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

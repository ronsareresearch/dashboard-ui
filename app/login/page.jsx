"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// import axios from "axios"
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
// import Link from "next/link"
import { API_BASE_URL } from "../constant/constant"
import { authApi } from "@/app/lib/apis";
import Image from "next/image"

export default function Login() {
  const router = useRouter()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const res = await authApi.post(
      `${API_BASE_URL}/login`,
      {
        email: formData.email,
        password: formData.password,
      },
    );

    if (res.data?.success || res.status === 200) {
      router.push("/dashboard/home"); // redirect after login
    } else {
      setError("Login failed.");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(err?.response?.data?.detail || "Invalid credentials.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex flex-col lg:flex-row h-screen justify-center">
      {/* Left side with welcome message */}
      <div className="hidden lg:flex items-center justify-center lg:w-[60%] relative bg-[#b8cabc] overflow-hidden">
        {/* <div className="absolute inset-0 bg-black/20" /> */}
        {/* <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" /> */}
        {/* <div className="absolute top-20 left-20 w-72 h-72 bg-[#dfe6e9]/20 rounded-full blur-3xl animate-pulse" /> */}
        {/* <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" /> */}
        <div className="z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          {/* <Sparkles className="w-16 h-16 text-black/70 mb-4" /> */}
          <Image src="/login_img.png" alt="Logo" width={500} height={500} className="h-[400px] w-[400px] object-contain pb-4" />

          <h1 className="text-5xl font-bold mb-4 bg-black/80 bg-clip-text text-transparent">
            Welcome to the Future
          </h1>
          <p className="text-xl text-black/70 leading-relaxed max-w-md mb-8">
            Powering Automation Workflows with cutting-edge technology and seamless integration.
          </p>
          <div className="grid grid-cols-1 gap-4 text-sm text-black/70 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Advanced workflow automation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex items-center justify-center w-full lg:w-[40%] bg-[#f9fffb] px-6 py-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sign In
            </h1>
            <p className="text-gray-600 text-base mt-2">Access your automation dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 pl-10 border border-gray-200 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfe6e9]"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 pl-10 pr-10 border text-black border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfe6e9]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-md bg-black hover:from-[#dfe6e9] hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* <div className="mt-8 text-center text-gray-600">
            Don’t have an account?{' '}
            <Link href="/register" className="font-medium text-[#dfe6e9] hover:text-[#dfe6e9]">
              Create one
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  )
}

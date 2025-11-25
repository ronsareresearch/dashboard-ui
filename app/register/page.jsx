"use client"

import { useState, ChangeEvent, FormEvent } from "react"
// import axios from "axios"
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
// import { useRouter } from "next/navigation"
import Link from "next/link"
import CryptoJS from "crypto-js"
// import { API } from "@/app/constant/constant"
import toast, { Toaster } from "react-hot-toast"

export default function Register() {
  // const router = useRouter()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = formData

      const data = JSON.stringify({ email, password })
      const encryptedData = CryptoJS.AES.encrypt(data, "codesanjay").toString()

      localStorage.setItem("register_data", encryptedData)

      // await axios.post(`${API}/send-otp`, { email })

      // router.push("/verify-otp")
      toast.success("coming soon.", { duration: 4000, position: "top-right" })
    } catch (err) {
      console.error("OTP send error:", err)

      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Error initiating OTP verification."

      toast.error(message, { duration: 4000, position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen justify-center">
      {/* Left Side */}
      <div className="hidden lg:flex items-center justify-center lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-gray-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Welcome to the Future
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-md mb-8">
            Powering Automation Workflows with cutting-edge technology and seamless integration.
          </p>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-400 max-w-sm">
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

      {/* Right Side (Form) */}
      <div className="flex items-center justify-center w-full lg:w-1/2 bg-white px-6 py-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Join thousands of users automating their workflows
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
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
                  className="w-full h-12 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full h-12 pl-10 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  autoComplete="new-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-md bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-600 hover:text-gray-500">
              Sign in here
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

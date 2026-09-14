"use client"

import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter()
  const signIn = () => {
    router.push("/dashboard")
  }
  return (
    <div className="min-h-screen flex items-center">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 ">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?
              <a
                href="/"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign Up →
              </a>
            </p>
          </div>
          <form className="space-y-6 mt-8">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href=""
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                // type="submit"
                className="inline-flex items-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base bg-black font-medium text-white hover:bg-gray-800 border border-black focus:ring-black w-full justify-center"
                onClick={signIn}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/auth/actions";

export default function Login() {
  const [state, action, pending] = useActionState(signIn, null as AuthState);

  return (
    <div className="flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up →
            </Link>
          </p>
        </div>
        <form action={action} className="mt-8 space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                id="email"
                name="email"
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
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {state?.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-md border border-black bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

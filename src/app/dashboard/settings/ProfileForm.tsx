"use client";

import { useActionState } from "react";
import { updateProfile, type AuthState } from "@/src/app/auth/actions";
import { Field, inputClass } from "../components/form";

export default function ProfileForm({
  email,
  fullName,
  role,
}: {
  email: string;
  fullName: string;
  role: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, null as AuthState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Email" htmlFor="profile-email">
        <input
          id="profile-email"
          value={email}
          disabled
          className={`${inputClass} bg-gray-50 text-gray-500`}
        />
      </Field>
      <Field label="Role" htmlFor="profile-role">
        <input
          id="profile-role"
          value={role}
          disabled
          className={`${inputClass} bg-gray-50 text-gray-500`}
        />
      </Field>
      <Field label="Full name" htmlFor="fullName">
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          required
          className={inputClass}
        />
      </Field>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.message ? (
        <p className="text-sm text-emerald-700">{state.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

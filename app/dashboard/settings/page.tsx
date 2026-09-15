import { requireUser } from "@/lib/auth/require-user";
import { getAppRole } from "@/lib/auth/role";
import { getCurrentProfile } from "@/lib/db/profiles";
import { isSupabaseConfigured } from "@/lib/env";
import ProfileForm from "./ProfileForm";

export default async function Settings() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="pt-8 md:pt-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to
            .env, then run supabase/migrations/20260915150000_create_profiles.sql.
          </p>
        </div>
      </div>
    );
  }

  const user = await requireUser();
  let fullName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "") || "";
  let role = getAppRole(user);
  let profileError = "";

  try {
    const profile = await getCurrentProfile();
    if (profile?.full_name) fullName = profile.full_name;
  } catch {
    profileError =
      "Profile database is not connected yet. Add DATABASE_URL and run the profiles SQL migration.";
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pt-8 md:pt-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your account profile. Email and role come from Auth; name is stored in
          public.profiles.
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
          {profileError ? (
            <p className="mt-2 text-sm text-amber-700">{profileError}</p>
          ) : null}
          <div className="mt-4">
            <ProfileForm email={user.email ?? ""} fullName={fullName} role={role} />
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Workspace</h2>
          <p className="mt-1 text-sm text-gray-500">Site Generator</p>
        </section>
      </div>
    </div>
  );
}

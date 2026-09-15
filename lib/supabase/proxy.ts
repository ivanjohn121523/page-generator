import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/" || path === "/register";
  const isDashboard = path.startsWith("/dashboard");

  if (isDashboard && !claims) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isAuthPage && claims) {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  from.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("cache-") || key.toLowerCase() === "pragma" || key.toLowerCase() === "expires") {
      to.headers.set(key, value);
    }
  });
}

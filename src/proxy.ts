import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie on admin/auth requests and bounces
 * signed-out visitors to the login page. This is an optimistic check only:
 * every admin page and server action re-verifies the user and role, and RLS
 * enforces permissions in the database.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAdmin = pathname === "/admin/hyrja" || pathname === "/admin/rivendos";
  if (pathname.startsWith("/admin") && !isPublicAdmin && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/hyrja";
    login.search = "";
    return NextResponse.redirect(login);
  }
  if (pathname === "/admin/hyrja" && user) {
    const home = request.nextUrl.clone();
    home.pathname = "/admin";
    home.search = "";
    return NextResponse.redirect(home);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};

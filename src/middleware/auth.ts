import { defineMiddleware } from "astro:middleware";
import { supabase } from "../lib/supabase";

export const authMiddleware = defineMiddleware(async ({ cookies, url, redirect }, next) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  // Public routes that don't require authentication
  const publicRoutes = [
    "/signin",
    "/register",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/signout"
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    return next();
  }

  // If no tokens exist, redirect to signin
  if (!accessToken || !refreshToken) {
    return redirect("/signin");
  }

  // Verify the session is valid
  try {
    const { error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (error) {
      // Clear invalid tokens
      cookies.delete("sb-access-token", { path: "/" });
      cookies.delete("sb-refresh-token", { path: "/" });
      return redirect("/signin");
    }
  } catch (error) {
    // Clear tokens on error
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect("/signin");
  }

  // If everything is okay, continue to the requested page
  return next();
}); 
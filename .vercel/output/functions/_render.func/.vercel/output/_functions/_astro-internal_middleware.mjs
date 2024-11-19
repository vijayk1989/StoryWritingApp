import { d as defineMiddleware, s as sequence } from './chunks/index_wMnxMVTy.mjs';
import { s as supabase } from './chunks/supabase_CfcqD-_3.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_DFitiaCm.mjs';
import 'cookie';

const authMiddleware = defineMiddleware(async ({ cookies, url, redirect }, next) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  const publicRoutes = [
    "/signin",
    "/register",
    "/api/auth/signin",
    "/api/auth/callback",
    "/api/auth/signout"
  ];
  const isPublicRoute = publicRoutes.some((route) => url.pathname.startsWith(route));
  if (isPublicRoute) {
    return next();
  }
  if (!accessToken || !refreshToken) {
    return redirect("/signin");
  }
  try {
    const { error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value
    });
    if (error) {
      cookies.delete("sb-access-token", { path: "/" });
      cookies.delete("sb-refresh-token", { path: "/" });
      return redirect("/signin");
    }
  } catch (error) {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect("/signin");
  }
  return next();
});

const onRequest$1 = sequence(authMiddleware);

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };

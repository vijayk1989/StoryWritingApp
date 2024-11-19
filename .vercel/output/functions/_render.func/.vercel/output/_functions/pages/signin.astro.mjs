import { c as createComponent, a as createAstro, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BkDS7zkQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Signin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Signin;
  const { cookies, redirect, url } = Astro2;
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  const from = url.searchParams.get("from") || "/";
  cookies.set("redirect-to", from, { path: "/" });
  if (accessToken && refreshToken) {
    return redirect(from);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign in" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center"> <div class="max-w-md w-full space-y-8 p-6"> <div class="text-center"> <h1 class="text-3xl font-bold">Sign in</h1> <p class="mt-2 text-gray-600">New here? <a href="/register" class="text-blue-600 hover:text-blue-500">Create an account</a></p> </div> <form action="/api/auth/signin" method="post" class="mt-8 space-y-4"> <button value="github" name="provider" type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
Sign in with GitHub
</button> </form> </div> </div> ` })}`;
}, "/home/vijaykumar/projects/story-writing-app/src/pages/signin.astro", void 0);

const $$file = "/home/vijaykumar/projects/story-writing-app/src/pages/signin.astro";
const $$url = "/signin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Signin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

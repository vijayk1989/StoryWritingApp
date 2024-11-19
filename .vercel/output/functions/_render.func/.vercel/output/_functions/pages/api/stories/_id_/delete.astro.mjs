import { s as supabase } from '../../../../chunks/supabase_CfcqD-_3.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return new Response("Story ID is required", { status: 400 });
  }
  const { error } = await supabase.from("stories").delete().eq("id", id);
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

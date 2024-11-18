import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();

    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    // Set the session first
    await supabase.auth.setSession({
      refresh_token: refreshToken?.value,
      access_token: accessToken?.value,
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!title || !user) {
      return redirect('/', 302);
    }

    await supabase
      .from('stories')
      .insert([{ 
        title,
        user_id: user.id
      }]);

    return redirect('/', 302);
  } catch (error) {
    console.error('Error creating story:', error);
    return redirect('/', 302);
  }
};

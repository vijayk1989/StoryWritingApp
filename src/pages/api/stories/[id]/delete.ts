import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params;
  
  if (!id) {
    return new Response('Story ID is required', { status: 400 });
  }

  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect('/');
}; 
import{s}from"./supabase.YDNJ6__1.js";import{m as n,u as h}from"./index.Bk4Tk5ow.js";import{c as p}from"./react.BoqmBW-A.js";const u=async r=>{const{data:o,error:t}=await s.from("chapters").select("*").eq("story_id",r).order("chapter_number",{ascending:!0});if(t)throw t;return o},w=r=>h(r?`chapters/${r}`:null,()=>u(r)),m=async r=>{const{data:o,error:t}=await s.from("chapters").select("*").eq("id",r).single();if(t)throw t;return o},g=r=>h(r?`chapter/${r}`:null,()=>m(r)),y=p((r,o)=>({isCreating:!1,isSaving:!1,error:null,createChapter:async t=>{r({isCreating:!0});try{const{data:a,error:e}=await s.from("chapters").select("chapter_number").eq("story_id",t.story_id).order("chapter_number",{ascending:!1}).limit(1);if(e)throw e;const c=a&&a.length>0?a[0].chapter_number+1:1,{error:i}=await s.from("chapters").insert([{...t,chapter_number:c}]);if(i)throw i;n(`chapters/${t.story_id}`)}catch(a){throw r({error:a.message}),a}finally{r({isCreating:!1})}},updateChapter:async(t,a)=>{try{const{error:e}=await s.from("chapters").update(a).eq("id",t);if(e)throw e;const c=a.story_id;n(`chapters/${c}`)}catch(e){throw r({error:e.message}),e}},deleteChapter:async(t,a)=>{try{const{error:e}=await s.from("chapters").delete().eq("id",t);if(e)throw e;n(`chapters/${a}`)}catch(e){throw r({error:e.message}),e}}}));export{w as a,g as b,y as u};
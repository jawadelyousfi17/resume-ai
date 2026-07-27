-- The bucket profile photos go into.
--
-- Run once, in the Supabase dashboard's SQL editor. It is written to be safe to
-- run again — re-running only re-asserts the settings.
--
-- If you created the bucket from the dashboard and let it add a policy, check
-- what that policy allows before trusting this file — these statements add
-- their own and don't remove anyone else's. A bucket that accepts anonymous
-- writes is free file hosting for anyone who reads the publishable key out of
-- the page, so drop it once the ones below are in place:
--
--   select policyname, roles, cmd
--     from pg_policies
--    where schemaname = 'storage' and tablename = 'objects';
--
--   drop policy "<the permissive one>" on storage.objects;
--
-- Uploads are filed under the uploader's own id (`<user-id>/<uuid>.jpg`), which
-- is what the policies below check: the first path segment must be your own
-- user id, so nobody can write into anyone else's folder.
--
-- Signed-out visitors upload too — the app works without an account — and
-- their photos go under `guest/`. No policy can recognise someone who isn't
-- anybody yet, so those writes are made by the app with SUPABASE_SECRET_KEY,
-- which is exempt from all of this. Set that key and no policy below has to
-- let an anonymous caller write.
--
-- Reads are public. They have to be: the PDF renderer is a separate machine
-- with no session, and it fetches the photo like any other browser would. A URL
-- carries a random uuid, so it isn't guessable, but treat anything in here as
-- readable by whoever has the link.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  5242880,                                   -- 5MB; the app uploads ~100KB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "images are publicly readable" on storage.objects;
create policy "images are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'images');

drop policy if exists "users write their own images" on storage.objects;
create policy "users write their own images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users replace their own images" on storage.objects;
create policy "users replace their own images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete their own images" on storage.objects;
create policy "users delete their own images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- The bucket profile photos go into.
--
-- Run once, in the Supabase dashboard's SQL editor. It is written to be safe to
-- run again — re-running only re-asserts the settings.
--
-- Uploads are filed under the uploader's own id (`<user-id>/<uuid>.jpg`), which
-- is what the policies below check: the first path segment must be your own
-- user id, so nobody can write into anyone else's folder.
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

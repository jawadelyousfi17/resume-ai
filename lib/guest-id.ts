// The id a guest resume always has, so `/resume/guest` is a stable URL and can
// never collide with a database uuid.
//
// It lives in its own module because both server components and the
// client-only localStorage layer in lib/guest.ts need it.

export const GUEST_RESUME_ID = "guest";

/** A guest gets one resume. That cap is the whole difference between building
 *  signed out and having an account, so it's named once. */
export const GUEST_RESUME_LIMIT = 1;

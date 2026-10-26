import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeStudentEmail, studentCodeHash, studentYearEnd } from "../lib/student-policy";

test("student email eligibility uses domain boundaries and explicit international domains", () => {
  process.env.STUDENT_ALLOW_ALL_EMAILS = "false";
  process.env.STUDENT_EMAIL_DOMAINS = "student.example.ac.ma,example.ac.uk";
  assert.equal(normalizeStudentEmail(" Student@School.EDU "), "student@school.edu");
  assert.equal(normalizeStudentEmail("student@dept.school.edu"), "student@dept.school.edu");
  assert.equal(normalizeStudentEmail("student@student.example.ac.ma"), "student@student.example.ac.ma");
  for (const email of ["student@gmail.com", "student@school.edu.attacker.com", "student@fakeexample.ac.uk", "student@dept.example.ac.uk", "student+alias@school.edu", "student@school..edu", "student@-school.edu", "student@edu", "a..b@school.edu", "a@school.edu\nBcc: x@gmail.com"]) {
    assert.equal(normalizeStudentEmail(email), null, email);
  }
});

test("verification hashes are tied to both the account and destination", () => {
  process.env.RESEND_API_KEY = "test-only-key";
  const hash = studentCodeHash("user-one", "student@school.edu", "12345678");
  assert.equal(hash, studentCodeHash("user-one", "student@school.edu", "12345678"));
  assert.notEqual(hash, studentCodeHash("user-two", "student@school.edu", "12345678"));
  assert.notEqual(hash, studentCodeHash("user-one", "other@school.edu", "12345678"));
  assert.notEqual(hash, studentCodeHash("user-one", "student@school.edu", "87654321"));
});

test("a free year expires on the next anniversary including leap day", () => {
  assert.equal(studentYearEnd(new Date("2026-10-26T12:00:00Z")).toISOString(), "2027-10-26T12:00:00.000Z");
  assert.equal(studentYearEnd(new Date("2024-02-29T12:00:00Z")).toISOString(), "2025-02-28T12:00:00.000Z");
});


test("testing override accepts personal emails and aliases but rejects malformed addresses", () => {
  process.env.STUDENT_ALLOW_ALL_EMAILS = "true";
  try {
    for (const email of ["person@gmail.com", "person+test@outlook.com", "person@example.org"]) {
      assert.equal(normalizeStudentEmail(email), email);
    }
    for (const email of ["not-an-email", "person@", "person@-example.com", "person@example..com", "a..b@example.com", "person@example.com\nBcc: other@example.com"]) {
      assert.equal(normalizeStudentEmail(email), null, email);
    }
  } finally {
    process.env.STUDENT_ALLOW_ALL_EMAILS = "false";
  }
  assert.equal(normalizeStudentEmail("person@gmail.com"), null);
});

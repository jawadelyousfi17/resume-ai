// About, privacy and terms, as content rather than markup.
//
// Written to describe what the app actually does — Supabase for sign-in,
// Postgres for the documents, Anthropic for the assistant, a headless browser
// for the PDF — because a privacy policy that doesn't match the code is worse
// than none. When any of that changes, this file changes with it.
//
// Not legal advice, and not reviewed by a lawyer.

import { CONTACT } from "@/lib/site-contact";

export interface LegalSection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface LegalPage {
  slug: "about" | "privacy" | "terms";
  title: string;
  /** The <title> and meta description for the page. */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** ISO date, shown as "Updated 28 July 2026". */
  updated: string;
  sections: LegalSection[];
}

const UPDATED = "2026-07-28";

export const ABOUT: LegalPage = {
  slug: "about",
  title: "About meniacv",
  metaTitle: "About meniacv — who makes it and why",
  metaDescription:
    "meniacv is a small independent resume builder: real-text PDFs, all templates free, and an AI assistant that rewrites what you wrote rather than inventing it.",
  intro:
    "A small, independent project built around one bad hour: the one before an application deadline, when the formatting fights back and the words won't come.",
  updated: UPDATED,
  sections: [
    {
      heading: "What this is",
      body: [
        "meniacv is a resume builder. You write your history once, pick from every template on offer, and export a clean, text-based PDF that an applicant tracking system can actually read. Nothing is watermarked, and the free plan keeps a resume for as long as you want it.",
        "The assistant is there for the parts people get stuck on — a summary that doesn't sound like everyone else's, bullet points that say what you did rather than what you were responsible for. It rewrites what you've written. It doesn't invent jobs you didn't have.",
      ],
    },
    {
      heading: "Who makes it",
      body: [
        "One person, working on it directly. That's the reason the pricing is what it is, the reason feedback tends to be read the same week it arrives, and the reason a bug report usually reaches the person who can fix it.",
        `If you want to say something about it — broken, missing, or good — the fastest route is ${CONTACT.email}, or the "Send feedback" item in the account menu once you're signed in.`,
      ],
    },
    {
      heading: "Where it's going",
      body: [
        "Paid plans are described on the pricing page but aren't on sale yet. While that's true the first hundred accounts get the top plan free for a year, because software this young is worth more in feedback than in revenue.",
        "What comes next is decided mostly by what people write in about. There's no roadmap worth publishing yet, and pretending otherwise would be marketing rather than fact.",
      ],
    },
  ],
};

export const PRIVACY: LegalPage = {
  slug: "privacy",
  title: "Privacy",
  metaTitle: "Privacy — what meniacv stores and why",
  metaDescription:
    "What meniacv collects, where it's kept, who it's shared with, and how to have it deleted. No advertising, no tracking pixels, no selling data.",
  intro:
    "What's kept, where it lives, and who else sees it. In short: your resumes, your email, and nothing sold to anybody.",
  updated: UPDATED,
  sections: [
    // First, and on its own, because it's the question people actually arrive
    // with and the one thing that most distinguishes this from the incumbents.
    // It's also answered in the FAQ; this is the copy that should rank.
    {
      heading: "Your resume is never used to train a model",
      body: [
        "Nothing you write here — resume, cover letter or feedback — is used to train an AI model, ours or anybody else's. When you ask the assistant to write, review, tailor or translate something, that document is sent to Anthropic to produce the answer you asked for, and it is not retained for training.",
        "This is not a setting you have to find and switch off. It is how the product works, and there is no version of it where your employment history becomes training data.",
      ],
    },
    {
      heading: "What's stored",
      body: [
        "An account holds your email address, and the name and photo your sign-in provider shares when you use one. Everything else is what you write: your resumes and cover letters, the settings that style them, and any feedback you send.",
        "Nothing is stored about you that you didn't type or that signing in didn't require.",
      ],
      list: [
        "Account: email address, and a display name and avatar when the provider supplies them.",
        "Documents: your resumes and cover letters, exactly as you wrote them.",
        "Feedback: the message you send, and the page you were on when you sent it.",
        "Subscription: which plan you're on and when it renews.",
      ],
    },
    {
      heading: "What isn't",
      body: [
        "There are no advertising trackers, no analytics pixels, and no third-party scripts watching what you do on the page. Nothing here is sold, rented, or handed to data brokers, and nothing you write is used to train anybody's model.",
        "Payment details are never stored, because there's no checkout yet. When there is one, card details will belong to the payment provider and never touch this database.",
      ],
    },
    {
      heading: "Who processes it",
      body: [
        "A few services are needed to run the app at all. Each one sees only what it needs, and none of them are given your documents to keep.",
      ],
      list: [
        "Supabase — sign-in and session cookies, and the database your documents are stored in.",
        "Anthropic — the AI assistant. When you ask it to write, review, tailor, translate or read a file, that document is sent to Anthropic to answer the request. It is not used to train their models.",
        "The hosting provider that runs the app and renders your PDF.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "The only cookies set are the ones that keep you signed in. There is no cookie banner because there is nothing to consent to: no advertising, no cross-site tracking, no profiling.",
        "Some preferences — the colour theme, whether you've been shown a one-time message — are kept in your browser's local storage rather than sent anywhere.",
      ],
    },
    {
      heading: "Keeping and deleting",
      body: [
        "Documents are kept while your account exists. Deleting a resume deletes it; the copy in any PDF you already downloaded is yours and out of reach either way.",
        `To delete your account and everything in it, write to ${CONTACT.email} from the address you signed up with. It's done by hand today, and it's done properly: the account row, the documents, the subscription. Feedback you sent is kept without your name attached, because a bug report is about the app rather than about you.`,
      ],
    },
    {
      heading: "Your rights",
      body: [
        `If you're in the EU, the UK or anywhere with similar law, you can ask for a copy of what's stored about you, ask for it to be corrected, or ask for it to be erased. Write to ${CONTACT.email} and it will be handled — by a person, not a form.`,
      ],
    },
  ],
};

export const TERMS: LegalPage = {
  slug: "terms",
  title: "Terms",
  metaTitle: "Terms of use — meniacv",
  metaDescription:
    "The terms for using meniacv: what you keep, what's expected of you, what's promised, and what isn't.",
  intro:
    "The short version: your documents are yours, the service is provided as it is, and don't use it to harm anybody.",
  updated: UPDATED,
  sections: [
    {
      heading: "Your account",
      body: [
        "You need an account to write a resume here, and you're responsible for what happens under it. Sign-in goes through a provider, so there's no password here to lose — keep the email account itself secure.",
        "One person per account. You can stop using it whenever you like, and ask for it to be deleted at any time.",
      ],
    },
    {
      heading: "What you write stays yours",
      body: [
        "You own everything you put in: your history, your words, the documents you export. No ownership of it is claimed by using this service, and it isn't published anywhere. The only thing done with it is what you ask for — rendering it, exporting it, or sending it to the assistant when you press a button that says so.",
      ],
    },
    {
      heading: "Fair use",
      body: [
        "Don't use this to impersonate somebody else, to write documents intended to defraud, or to attack the service — scraping it, hammering the AI endpoints, or trying to reach other people's documents. Accounts doing any of that can be closed without notice.",
        "The assistant costs money per request, so its use is rate-limited and tied to your plan. Working around those limits counts as attacking the service.",
      ],
    },
    {
      heading: "Plans and payment",
      body: [
        "Paid plans are described on the pricing page but cannot be bought yet, so nothing here charges you anything today. The first hundred accounts have been given the top plan free for a year; that's a gift, not a contract, and it ends on the date shown on your account page.",
        "When checkout opens, prices, renewal and refunds will be set out here before anybody is asked for a card.",
      ],
    },
    {
      heading: "What's promised",
      body: [
        "This is a small project run by one person. It's offered as it is: no guarantee that it will be available at a particular moment, that the assistant's suggestions are correct, or that a resume written here will get you an interview. Read what the AI writes before you send it — it's a draft, and it's your name on the page.",
        "Keep a copy of anything you can't afford to lose. Exports are free and unlimited for exactly this reason.",
      ],
    },
    {
      heading: "Changes and contact",
      body: [
        `These terms may change as the service does; the date at the top says when they last did. Questions about any of it: ${CONTACT.email}.`,
      ],
    },
  ],
};

export const LEGAL_PAGES = [ABOUT, PRIVACY, TERMS];

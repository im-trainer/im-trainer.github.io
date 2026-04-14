export interface BlogPost {
  slug: string;
  titleRo: string;
  titleEn: string;
  excerptRo: string;
  excerptEn: string;
  contentRo: string;
  contentEn: string;
  date: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "de-ce-sa-inveti-web-development",
    titleRo: "De ce să înveți web development în 2025",
    titleEn: "Why Learn Web Development in 2025",
    excerptRo:
      "Web development rămâne una dintre cele mai căutate competențe pe piața muncii. Aflați de ce este un moment excelent să faceți pasul.",
    excerptEn:
      "Web development remains one of the most in-demand skills in the job market. Find out why now is a great time to make the leap.",
    contentRo: `## De ce web development?

Web development-ul rămâne una dintre cele mai dinamice și căutate competențe pe piața muncii globală. Indiferent de industrie, companiile au nevoie de prezență digitală, aplicații interne și soluții web — iar această cerere nu dă semne că se va diminua.

## Ce înveți de fapt

Un curs bun de web development nu te învață doar HTML sau JavaScript. Te învață să gândești logic, să rezolvi probleme și să construiești lucruri funcționale de la zero. Aceste abilități sunt transferabile în orice rol tehnic.

## Unde poți ajunge

Fie că vrei să devii frontend developer, full-stack developer sau pur și simplu vrei să înțelegi mai bine cum funcționează internetul — web development-ul este un punct de start excelent.

## Concluzie

Nu există un moment perfect pentru a învăța ceva nou. Dar dacă ești curios de web development, acum este la fel de bun ca orice alt moment. Începe cu fundamentele — HTML, CSS, JavaScript — și construiește de acolo.`,
    contentEn: `## Why web development?

Web development remains one of the most dynamic and sought-after skills in the global job market. Regardless of industry, companies need a digital presence, internal applications, and web solutions — and this demand shows no signs of slowing down.

## What you actually learn

A good web development course doesn't just teach you HTML or JavaScript. It teaches you to think logically, solve problems, and build functional things from scratch. These skills are transferable to any technical role.

## Where you can go

Whether you want to become a frontend developer, a full-stack developer, or simply want to better understand how the internet works — web development is an excellent starting point.

## Conclusion

There's no perfect moment to learn something new. But if you're curious about web development, now is as good a time as any. Start with the fundamentals — HTML, CSS, JavaScript — and build from there.`,
    date: "2025-01-15",
    category: "Career",
  },
  {
    slug: "html-css-fundamente",
    titleRo: "HTML și CSS: De ce fundametele contează cel mai mult",
    titleEn: "HTML & CSS: Why the Fundamentals Matter Most",
    excerptRo:
      "Mulți cursanți vor să sară direct la framework-uri. Iată de ce HTML și CSS solid rămân cea mai bună investiție pe termen lung.",
    excerptEn:
      "Many learners want to jump straight to frameworks. Here's why solid HTML and CSS remain the best long-term investment.",
    contentRo: `## Tentația de a sări peste fundamente

Unul dintre cele mai comune greșeli ale celor care încep să învețe web development este dorința de a sări direct la React, Vue sau alt framework popular. Înțeleg motivul — framework-urile par mai interesante și mai relevante pe piața muncii.

## Dar ce se întâmplă fără fundamente

Fără o înțelegere solidă a HTML semantic și a CSS layout, vei întâmpina probleme neașteptate la fiecare pas. Vei copia cod fără să înțelegi ce face, vei lupta cu bug-uri de CSS pe care nu le poți diagnostica și vei depinde complet de framework pentru orice.

## Ce înseamnă fundamente solide

- Înțelegerea structurii HTML semantic
- Box model și cum afectează layout-ul
- Flexbox și Grid fără ajutor extern
- CSS custom properties (variabile)
- Responsive design fără framework-uri

## Investiția pe termen lung

Un developer care înțelege profund HTML și CSS va fi întotdeauna mai eficient decât unul care știe React dar nu înțelege ce face browser-ul. Investiția în fundamente se amortizează rapid.`,
    contentEn: `## The temptation to skip fundamentals

One of the most common mistakes of those starting to learn web development is the desire to jump straight to React, Vue, or another popular framework. I understand the reason — frameworks seem more interesting and more relevant in the job market.

## But what happens without fundamentals

Without a solid understanding of semantic HTML and CSS layout, you'll encounter unexpected problems at every turn. You'll copy code without understanding what it does, fight CSS bugs you can't diagnose, and be completely dependent on the framework for everything.

## What solid fundamentals mean

- Understanding semantic HTML structure
- Box model and how it affects layout
- Flexbox and Grid without external help
- CSS custom properties (variables)
- Responsive design without frameworks

## The long-term investment

A developer who deeply understands HTML and CSS will always be more effective than one who knows React but doesn't understand what the browser does. The investment in fundamentals pays off quickly.`,
    date: "2025-02-10",
    category: "Web Tips",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

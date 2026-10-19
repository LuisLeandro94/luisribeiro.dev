/** Site-wide configuration: identity, contact, and navigation. Edit text here, not in components. */

export interface NavSection {
  number: string;
  label: string;
  id: string;
}

export const site = {
  name: "Luís Ribeiro",
  role: "Software Engineer",
  title: "Luís Ribeiro · Software Engineer, Frontend",
  description:
    "Luís Ribeiro is a software engineer in Portugal specialising in frontend. He builds interfaces for financial operations at VFX Financial.",
  url: "https://www.luisribeiro.dev",
  email: "luisribeirotech@gmail.com",
  location: "Portugal",
  timeZone: "Europe/Lisbon",
  linkedin: {
    label: "LinkedIn",
    handle: "/in/luisleandro94",
    url: "https://linkedin.com/in/luisleandro94",
  },
  github: {
    label: "GitHub",
    handle: "@LuisLeandro94",
    url: "https://github.com/LuisLeandro94",
  },
  /**
   * The real PDF is not yet in this repository. Place it at
   * `public/cv/luis-ribeiro-cv.pdf` before shipping — see README for details.
   * It is only made public once Luís confirms (the CV includes a phone number).
   */
  cvHref: "/cv/luis-ribeiro-cv.pdf",
} as const;

export const navSections: NavSection[] = [
  { number: "01", label: "Work", id: "work" },
  { number: "02", label: "Experience", id: "experience" },
  { number: "03", label: "Stack", id: "stack" },
  { number: "04", label: "About", id: "about" },
  { number: "05", label: "Contact", id: "contact" },
];

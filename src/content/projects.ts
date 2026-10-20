/** Selected work content — projects.ts. Source: design-reference/HANDOFF.md §8. */

export interface ProjectSpec {
  term: string;
  value: string;
}

export interface FeaturedProject {
  kind: "featured";
  id: string;
  label: string;
  title: string;
  description: string;
  spec: ProjectSpec[];
  media: {
    main: { src: ImageMetadata; alt: string };
    sub: { src: ImageMetadata; alt: string };
  };
  /** Case study page — omitted until verified content exists (HANDOFF §12.1). */
  caseStudyHref?: string;
  liveHref?: string;
}

export interface SecondaryProject {
  kind: "secondary";
  id: string;
  label: string;
  year: string;
  title: string;
  description: string;
  image?: { src: ImageMetadata; alt: string };
  links: { label: string; href: string }[];
}

export type Project = FeaturedProject | SecondaryProject;

import weddingHome from "../assets/images/wedding-home.webp";
import weddingTables from "../assets/images/wedding-tables.webp";
import petaway from "../assets/images/petaway.webp";

export const featuredProject: FeaturedProject = {
  kind: "featured",
  id: "w1",
  label: "Featured · Personal project",
  title: "Wedding Management App",
  caseStudyHref: "/work/wedding-app",
  description:
    "The app that ran my own wedding: invitations, RSVPs, guest seating, administration and photo uploads. A full-stack Next.js and React build, with MongoDB for data, NextAuth for sign-in and Resend for transactional email.",
  spec: [
    { term: "Role", value: "Full-stack development" },
    { term: "Scope", value: "Invitations, RSVPs, seating, admin, photo uploads" },
    { term: "Sign-in", value: "Google, through NextAuth" },
    { term: "Stack", value: "Next.js, React, MongoDB, NextAuth, Resend" },
    { term: "Used", value: "For my own wedding" },
  ],
  media: {
    main: {
      src: weddingHome,
      alt: "Wedding app home after sign-in: the couple's signature over a starry night sky, a countdown, and links to Informações, Mesas, Fotos, Protocolo and Galeria",
    },
    sub: {
      src: weddingTables,
      alt: "Plano de Mesas screen: guests search their name to find their table",
    },
  },
};

export const secondaryProjects: SecondaryProject[] = [
  {
    kind: "secondary",
    id: "w2",
    label: "Team project · Frontend",
    year: "2022",
    title: "Petaway",
    description:
      "A web app for finding pet-sitters and dog walkers nearby. React, styled-components, Ant Design and the Google Maps API on the frontend; I built the frontend, a teammate built the Node, Express and PostgreSQL API behind it.",
    image: {
      src: petaway,
      alt: "Petaway landing page: a teal navigation bar and the Petaway logo over a photo of dogs on leads",
    },
    links: [
      { label: "Frontend repo", href: "https://github.com/LuisLeandro94/petaway_frontend" },
      { label: "API repo", href: "https://github.com/LuisLeandro94/petaway-backend" },
    ],
  },
  {
    kind: "secondary",
    id: "w3",
    label: "Experiment",
    year: "2023",
    title: "Projectile Movement",
    description:
      "A small physics simulation in React: a ball thrown with a random direction and speed, pulled down by real gravity, losing 10% of its horizontal speed on every wall it hits. The preview re-creates its rules.",
    links: [
      { label: "Live demo", href: "https://projectile-movement.vercel.app" },
      { label: "Repo", href: "https://github.com/LuisLeandro94/projectile-movement" },
    ],
  },
];

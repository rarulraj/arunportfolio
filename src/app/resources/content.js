/**
 * @typedef {{ src: string, alt: string, width?: number, height?: number, orientation?: "horizontal" | "vertical" }} PortfolioImage
 */

/** @type {PortfolioImage[]} */
const noImages = [];

const person = {
  firstName: "Arun",
  lastName: "Arulraj",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI Solutions Engineer",
  avatar: "/images/avatar.jpg",
  portrait: "/images/portrait.jpg",
  email: "",
  location: "America/Los_Angeles",
  languages: ["English"],
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}&apos;s Newsletter</>,
  description: <>Occasional notes on industrial AI, historians, and building in public.</>,
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/rarulraj",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/arun-arulraj-236a78259/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "https://substack.com/@arunarulraj",
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} — Industrial AI & Data Infrastructure`,
  description:
    "Arun Arulraj helps enterprises build and adopt industrial AI. AI Solutions Engineer at TDengine. Founder (acquired). Ex-Meta, C3 AI.",
  headline: <>Arun Arulraj</>,
  featured: {
    display: true,
    title: (
      <>
        Now: <strong className="ml-4">AI Solutions Engineer @ TDengine</strong>
      </>
    ),
    href: "/work/cesium-idmp-industrial-ai",
  },
  subline: (
    <>
      Helping enterprises build &amp; adopt industrial AI — AI &amp; data
      infrastructure · Founder (acquired) · Ex-Meta, C3 AI. Code &amp; builds on{" "}
      <a href="https://github.com/rarulraj">github.com/rarulraj</a>.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} in the San Francisco Bay Area`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I build and architect AI systems for industrial operations. At TDengine I
        help manufacturers, utilities, and energy companies modernize historians,
        operational analytics, and AI on live plant data — TSDB + IDMP so teams
        get Data → Context → Action, not just tags and dashboards.
        <br />
        <br />
        Dual bachelor&apos;s in Computer Science and Chemistry; M.S. Computer
        Science at Georgia Tech, plus an M.Eng. in Aerospace / Aeronautical
        Engineering in progress at Georgia Tech. Previously software
        engineering at C3 AI and Meta, Head of AI at Soundromeda, and founder
        of Reefly (acquired). Writing at{" "}
        <a href="https://arunarulraj.substack.com">arunarulraj.substack.com</a>.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "TDengine",
        timeframe: "Sep 2025 — Present",
        role: "AI Solutions Engineer · Full-time · Hybrid",
        achievements: [
          <>
            Help manufacturers, utilities, and energy companies adopt TDengine
            as an AI-ready data historian — collection, contextualization,
            analytics, events, and visualization on TSDB + IDMP.
          </>,
          <>
            Ship live industrial AI demos (including Cesium 3D + IDMP agent
            workflows) and customer engagements that show Data → Context →
            Action in the field — ProveIt and beyond.
          </>,
          <>
            Publish on industrial data contextualization and modern modeling:
            time-series + asset hierarchy + real context + streaming insights.
          </>,
        ],
        images: [
          {
            src: "/images/work/cesium/04.jpg",
            alt: "Cesium IDMP wind farm demo",
            width: 16,
            height: 9,
          },
          {
            src: "/images/work/proveit/dashboard.png",
            alt: "IDMP dashboard from ProveIt demos",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Stealth AI Startup",
        timeframe: "Oct 2026 — Present",
        role: "Founder",
        achievements: [
          <>Building something new in AI — early-stage, self-employed.</>,
        ],
        images: noImages,
      },
      {
        company: "The Founders Experience",
        timeframe: "Oct 2026 — Present",
        role: "Co-Founder",
        achievements: [
          <>
            Co-building a San Francisco startup community whose goal is simple:
            help founders turn ideas into successful companies.
          </>,
        ],
        images: noImages,
      },
      {
        company: "Reefly",
        timeframe: "Feb 2026 — Oct 2026",
        role: "Founder · Acquired",
        achievements: [
          <>
            Built Reefly — come for the community, stay because your tank lives
            here. Acquired by an independent business owner.
          </>,
        ],
        images: noImages,
      },
      {
        company: "Necessary Ventures",
        timeframe: "Jun 2025 — Present",
        role: "Venture Scout · formerly VC Fellow",
        achievements: [
          <>
            Source early-stage startups tackling critical global challenges;
            special projects that advance strategic goals and operations at a
            mission-driven fund.
          </>,
        ],
        images: noImages,
      },
      {
        company: "C3 AI",
        timeframe: "Jun 2024 — Sep 2025",
        role: "Software Engineer · Fed Apps / Agentic AI Internal Tools",
        achievements: [
          <>
            Built scalable enterprise AI applications, deployed predictive ML
            models, and shipped modern DevOps practices on the Fed Apps team.
          </>,
          <>
            Worked on agentic AI internal tools that accelerated how teams
            build and operate AI products.
          </>,
        ],
        images: noImages,
      },
      {
        company: "Meta",
        timeframe: "May 2024 — Jun 2024",
        role: "Software Engineer · VR / AR Solutions",
        achievements: [
          <>Contributed to VR and AR solution engineering workstreams.</>,
        ],
        images: noImages,
      },
      {
        company: "Soundromeda",
        timeframe: "Jan 2022 — Mar 2024",
        role: "Head of Artificial Intelligence · Founding AI Engineer",
        achievements: [
          <>
            Listed on Soundromeda&apos;s leadership people bench as Head of
            AI (
            <a href="https://www.linkedin.com/company/soundromeda/people/">
              company people page
            </a>
            ) after founding the AI function.
          </>,
          <>
            Built the AI product 0→1, helped secure funding, and deployed ML
            for a music-gaming platform (songs → Unreal songworlds).
          </>,
          <>
            Led AI vision through NVIDIA Inception milestone and shipped
            systems across creator / player surfaces.
          </>,
        ],
        images: [
          {
            src: "/images/work/soundromeda/gameplay.jpg",
            alt: "Soundromeda product site",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "Georgia Institute of Technology",
        description: (
          <>
            M.S. Computer Science
            <br />
            M.Eng. Aerospace / Aeronautical Engineering (in progress)
          </>
        ),
      },
      {
        name: "California State University, East Bay",
        description: <>B.S. Computer Science · B.S. Chemistry</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Focus areas",
    skills: [
      {
        title: "Industrial AI & Historians",
        description: (
          <>
            TDengine TSDB + IDMP, OPC UA / OT data paths, asset
            contextualization, Cesium / spatial ops views, events, KPIs, and AI
            agents on live plant data.
          </>
        ),
        images: noImages,
      },
      {
        title: "AI / ML Systems",
        description: (
          <>
            Predictive models, agentic tooling, NLP, and production ML from
            enterprise platforms (C3 AI) to 0→1 products (Soundromeda, Reefly).
          </>
        ),
        images: noImages,
      },
      {
        title: "Core stack",
        description: (
          <>
            Top skills from LinkedIn: Python, JavaScript, SQL, C#, C++ — plus
            TypeScript, cloud services, and DevOps across industrial and
            consumer products.
          </>
        ),
        images: noImages,
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Writing",
  title: "Writing from Substack",
  description: `Essays by ${person.name} on industrial AI, agents, and building — from arunarulraj.substack.com`,
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Selected work by ${person.name}`,
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – ${person.name}`,
  description: `Visuals by ${person.name}`,
  images: noImages,
};

export { person, social, newsletter, home, about, blog, work, gallery };

// Every word on the cards lives here. To change the site, edit this file.
//
// One card:
//   name     the title
//   tag      the small label above the title
//   line     one sentence under the title
//   link     optional web address
//   media    optional path to a photo or video in assets/ (empty = show the "need" box)
//   need     what photo or video belongs in the empty box
//   featured true = the card is double width
//   draft    true = the words are a first guess, Ethan has not approved them
window.SITE = {
  // One entry per room, in the order of the tabs on the counter's board.
  rooms: {
    specials: { bags: true }, // bags = coffee bags on a shelf, no spell ring
    shifts: { tickets: true }, // tickets = order tickets on a rail, no spell ring
    offclock: {},
  },

  // The open book on the counter inside the shop. Change these lines when you start a new book.
  reading: {
    title: "Empire of AI",
    author: "Karen Hao",
    cover: "assets/books/empire-of-ai.jpg", // a cover image in assets/books/ (this one is from Open Library, free)
    // a line from the book, on the right page under the author (leave it out for no quote; keep it under ~25 words)
    quote: "Just as empires of old eventually fell to more inclusive forms of governance, we, too, can shape the future of AI together.",
  },

  // Ethan's own book, framed on the back wall inside. Click the frame: the card shows these. (The frame's image is in index.html.)
  wrote: {
    title: "Life Stories",
    author: "Ethan Yap",
    cover: "assets/books/life-stories.jpg", // from Amazon's public cover image server
    label: "Written by me",
    note: "Check out this reading and writing comprehension book I published to help English learners.",
    link: "https://www.amazon.com/dp/B0DWWTB2XV",
  },

  // The bookcase on the rug: books Ethan has finished, top shelf first, left to right. Click one: it tilts out and
  // a card shows the cover, title and author. The case grows a row by itself as the list gets longer.
  // To add a finished book: add one line here AND its <li> in index.html's "shelf-list" (verify/shelf.mjs checks both).
  //   spine   the spine's colour, ink = the title's colour, ink2 = the author's (default: ink)
  //   type    the spine lettering: any of serif, sans, bold, light, caps
  //   h, w    optional height and thickness in room units (default 15 and 3.1)
  //   cover   a cover image in assets/books/ (from Open Library, free; Tipping Point and Map from Amazon's public cover images)
  shelf: [
    { title: "Zero to One", author: "Peter Thiel", cover: "assets/books/zero-to-one.jpg", spine: "#6F9FDB", ink: "#14171C", ink2: "#F6F4EE", type: "serif caps", h: 15.8, w: 3.1 },
    { title: "Atomic Habits", author: "James Clear", cover: "assets/books/atomic-habits.jpg", spine: "#F1EDE4", ink: "#B48646", ink2: "#1C1C1C", type: "sans bold", h: 15.6, w: 3.5 },
    { title: "The Tipping Point", author: "Malcolm Gladwell", cover: "assets/books/tipping-point.jpg", spine: "#C3D24A", ink: "#1E1E1C", type: "serif", h: 14.2, w: 2.9 },
    { title: "The Worlds I See", author: "Fei-Fei Li", cover: "assets/books/worlds-i-see.jpg", spine: "#13213F", ink: "#F4F1EA", ink2: "#E3B66C", type: "sans bold caps", h: 15.8, w: 3.6 },
    { title: "Between the World and Me", author: "Ta-Nehisi Coates", cover: "assets/books/between-the-world-and-me.jpg", spine: "#EDE8DE", ink: "#151515", type: "sans bold caps", h: 14.4, w: 3 },
    { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", cover: "assets/books/almanack.jpg", spine: "#F7F7F5", ink: "#2A2A2A", ink2: "#8A8A8A", type: "sans light caps", h: 15.1, w: 3.1 },
    { title: "Ceremony", author: "Leslie Marmon Silko", cover: "assets/books/ceremony.jpg", spine: "#1E3A63", ink: "#F2F2EE", ink2: "#9CB9E0", type: "serif bold caps", h: 14.4, w: 3.1 },
    { title: "Map", author: "Wisława Szymborska", cover: "assets/books/map.jpg", spine: "#6B5540", ink: "#E9D9A8", ink2: "#F1E9D8", type: "serif caps", h: 16.3, w: 4.1 },
  ],

  // House blends (PLAN-blends.md): one coffee bag per thing Ethan built, on the roaster's shelf, in this order.
  //   tag    the small word on the label      notes  the "roast notes" on the card (2-3 facts or tools)
  //   label  the label's colour               draw   the label's drawing: cup | board | wiki | card | ring (main.js BAG_ART)
  //   photo  a screenshot in assets/blends/ (1600 wide JPEG), shown at the top of the card, cropped to 2:1 from the top
  specials: [
    {
      name: "Crema",
      tag: "Founder",
      line: "App that shows coffee shops the cost, margin and recipe of every drink.",
      notes: ["Live app", "$0 to run", "Security-checked"],
      link: "https://portafile.vercel.app",
      draw: "cup",
      photo: "assets/blends/crema.jpg",
      label: "#B5654F",
    },
    {
      name: "Finance Board",
      tag: "Team tool",
      line: "A research board where 24 interns in an AI × finance internship post research on how AI is changing different industries, and connect it back to finance.",
      notes: ["Built from a team survey", "Google sign-in, private to the team", "$0 to run"],
      draw: "board",
      photo: "assets/blends/finance-board.jpg",
      label: "#5F8A9E",
    },
    {
      name: "Class Wiki",
      tag: "Study tool",
      line: "Class materials end up scattered, and daily practice is hard to keep up. Class Wiki turns lectures, slides, PDFs and videos into one store of class context, then builds quizzes, flashcards and reviews from it. You can even ask it questions in a chat!",
      notes: ["Python", "Claude Code", "Spaced repetition"],
      draw: "wiki",
      photo: "assets/blends/class-wiki.jpg",
      label: "#7F9670",
    },
    {
      name: "Card Lister",
      tag: "Side hustle",
      line: "Upload a video of yourself reading your cards out loud. The site hears each card, reads its printed text, and sends the listings to your store.",
      notes: ["Whisper", "Tesseract", "Hundreds of cards in under 2 hours"],
      draw: "card",
      photo: "assets/blends/card-lister.jpg",
      label: "#C49A4A",
    },
    {
      name: "Agentic OS",
      tag: "Second brain",
      line: "Personal storage for all my skills, projects and notes, and how they connect.",
      notes: ["Kept private on purpose", "Reached from my phone via Tailscale"],
      draw: "ring",
      photo: "assets/blends/agentic-os.jpg",
      label: "#8E6F8C",
    },
  ],
  // The drum roaster at the end of the shelf: an idea Ethan is working through now (Ethan's words, 2026-11-18).
  //   title  on the tag (keep it to ~4 words)     line + notes  the card that opens when you click the roaster
  roasting: {
    title: "A company brain",
    line: "Company info is scattered across drives, chats and inboxes, so people waste time hunting for it. What if one place held all of it, and you could just ask a chatbot in plain English? How can we balance this use case with data privacy and security?",
    notes: ["Idea stage", "NLP chatbot search", "Access rules per person"],
  },

  // The Experience room: one order ticket per job, clipped to the rail in this order (Ethan's order).
  //   about  the small line under the name     items  2 line items; **words** print bold (the numbers)
  //   draw   the ticket's drawing: pourover | tv | town | phone (main.js TICKET_ART)
  // Facts only from the experience bank (~/.claude/skills/tailor-resume/experience-bank.md).
  shifts: [
    {
      name: "The Roasters Pack",
      role: "Intern",
      about: "Coffee subscription brand",
      dates: "Jul 2025 – Present",
      items: [
        "Built an AI-powered (Claude) tool that screened **1,500+** prospects down to **150+** qualified leads across North America, Australia and the U.K.",
        "Calibrated the screening rules against **93** of the client’s own approve/reject decisions",
      ],
      draw: "pourover",
    },
    {
      name: "Tatari",
      role: "Business Intern",
      about: "TV and streaming ad analytics · San Francisco",
      dates: "Jun – Jul 2025",
      items: [
        "Led an analysis of key players in the influencer industry and presented it to the **executive team**",
        "Conducted **6** cross-department interviews and published them as profiles in the company-wide newsletter",
      ],
      draw: "tv",
    },
    {
      name: "MLSN MiniDavis",
      role: "Developer",
      about: "An agent-managed version of Davis · 5-person team",
      dates: "Sep 2026 – Present",
      items: [
        "Built the town’s memory: every event saved in SQLite with a source ID; **5** recent + **3** related records recalled each turn",
        "Built search by meaning (MiniLM) that found the right record in the top 3 results for **10/10** searches, even when reworded",
      ],
      draw: "town",
    },
    {
      name: "Youphoria",
      role: "Marketing Director",
      about: "Wellness app",
      dates: "Oct 2026 – Present",
      items: [
        "Analyzed the app’s 2026 Instagram data (**14** posts, **4,700+** account views) in Python, ranking every post by engagement",
        "Found the team’s own likes made up **85.7%** of interactions, exposing inflated metrics and resetting KPIs to real engagement",
      ],
      draw: "phone",
    },
  ],

  offclock: [
    // first card in front (Ethan, 2026-11-19)
    {
      name: "Favorite Movies/TV Shows",
      tag: "On screen",
      // no line (Ethan's ask)
      watched: ["Dr. Strange", "Oppenheimer", "Loki", "Mr. Robot", "Game of Thrones"],
      // his sister's drawing (a birthday card panel). main.js draws the King of Spades and the portal sparks on top.
      drawing: "assets/about/strange-doom.jpg",
      drawingLabel: "A marker drawing: Doctor Strange opens a sling ring portal to Doctor Doom, who holds up a King of Spades",
      credit: "Photo drawn by my sister",
    },
    {
      name: "Coffee craft",
      tag: "Daily",
      line: "Started out as a home barista using a Breville Bambino and Baratza Encore ESP grinder to learn how to make latte art. I’m now working at Shiro Noir Coffee & Tea in Davis!",
      // the slider: one photo per date, oldest first. Each is cropped round to the cup (assets/about/latte/).
      timeline: [
        { date: "2026-08-02", src: "assets/about/latte/2026-08-02.jpg" },
        { date: "2026-08-10", src: "assets/about/latte/2026-08-10.jpg" },
        { date: "2026-08-17", src: "assets/about/latte/2026-08-17.jpg" },
        { date: "2026-08-19", src: "assets/about/latte/2026-08-19.jpg" },
        { date: "2026-08-20", src: "assets/about/latte/2026-08-20.jpg" },
        { date: "2026-08-24", src: "assets/about/latte/2026-08-24.jpg" },
        { date: "2026-09-01", src: "assets/about/latte/2026-09-01.jpg" },
        { date: "2026-09-16", src: "assets/about/latte/2026-09-16.jpg" },
        { date: "2026-09-17", src: "assets/about/latte/2026-09-17.jpg" },
        { date: "2026-11-05", src: "assets/about/latte/2026-11-05.jpg" },
      ],
    },
    {
      name: "Mega Darkrai ex",
      tag: "Pokémon hobby",
      line: "I collect cards for the art. I got this one at my first card show, after negotiating for it.",
      holo: "assets/about/mega-darkrai-ex.jpg",
      holoLabel: "My Mega Darkrai ex Pokémon card",
    },
    {
      name: "Sports",
      tag: "Game day",
      line: "I love running, playing tennis, biking and playing volleyball.",
      // [slot, player, NFL team, a dot colour that reads on the dark board]
      lineup: {
        team: "Bijan al Gaib",
        players: [
          ["QB", "Bo Nix", "DEN", "#FB4F14"],
          ["RB", "Bijan Robinson", "ATL", "#C8102E"],
          ["RB", "Chuba Hubbard", "CAR", "#0085CA"],
          ["WR", "Parker Washington", "JAX", "#00A3AD"],
          ["WR", "Tee Higgins", "CIN", "#FB4F14"],
          ["TE", "Tucker Kraft", "GB", "#FFB612"],
          ["FLEX", "Chase Brown", "CIN", "#FB4F14"],
          ["D/ST", "Bears", "CHI", "#C83803"],
          ["K", "Spencer Shrader", "IND", "#3A7BD5"],
        ],
      },
    },
  ],
  // The receipt's links (email, LinkedIn, GitHub) live in index.html, so they show with no JavaScript.
};

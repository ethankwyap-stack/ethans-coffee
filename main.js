// ethan-site: six small jobs.
//   1. RENDER       build the cards from content.js
//   2. DRAWING      the espresso machine draws itself and pulls a shot when you step inside
//   3. HEADLINE     the last word types itself
//   4. ROOMS        a tab on the counter's board opens its room; the three tabs stay on top of it
//   5. STAGE        one locked screen; each scroll, swipe or key walks one step: street, inside, counter, register
const SITE = window.SITE;
const $ = (selector, root = document) => root.querySelector(selector);
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// ---------- 1. RENDER ----------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const niceDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };

// The latte timeline: one round cup per date, stacked; a native range slider picks which one shows (keys and
// screen readers work for free). The cups cross-fade in CSS.
function timeline(item) {
  const box = el("div", "timeline");
  const cups = el("div", "tl-cups");
  cups.setAttribute("role", "img");
  const imgs = item.timeline.map((shot) => {
    const img = el("img");
    img.src = shot.src;
    img.alt = "";
    return img;
  });
  cups.append(...imgs);
  const range = el("input");
  range.type = "range";
  range.min = 0;
  range.max = imgs.length - 1;
  range.value = 0;
  range.setAttribute("aria-label", "Latte art over time");
  const date = el("p", "tl-date");
  const ends = el("p", "tl-ends");
  ends.append(el("span", "", niceDate(item.timeline[0].date).replace(/, \d+$/, "")), el("span", "", niceDate(item.timeline.at(-1).date).replace(/, \d+$/, "")));
  const show = () => {
    const i = +range.value, when = niceDate(item.timeline[i].date);
    imgs.forEach((img, j) => img.classList.toggle("on", j === i));
    date.textContent = when;
    range.setAttribute("aria-valuetext", when);
    cups.setAttribute("aria-label", `My latte art on ${when}`);
  };
  range.addEventListener("input", show);
  show();
  box.append(cups, date, range, ends, el("p", "tl-hint", "Slide to see my progress"));
  return box;
}

// A trading card that tilts toward the pointer (no shine: Ethan, 2026-11-20). Still in reduced motion.
function holo(item) {
  const box = el("div", "holo");
  const tilt = el("div", "holo-tilt");
  const img = el("img");
  img.src = item.holo;
  img.alt = item.holoLabel;
  tilt.append(img);
  box.append(tilt);
  if (!reduced) {
    box.addEventListener("pointermove", (e) => {
      const b = box.getBoundingClientRect();
      tilt.style.setProperty("--x", ((e.clientX - b.left) / b.width).toFixed(3));
      tilt.style.setProperty("--y", ((e.clientY - b.top) / b.height).toFixed(3));
      box.classList.add("live");
    });
    box.addEventListener("pointerleave", () => box.classList.remove("live"));
  }
  return box;
}

// His sister's drawing: Doctor Strange opens a sling ring portal to Doom. Drawn on top, in the photo's own pixels
// (viewBox = the photo, 1200 x 791): ONE King of Spades in Doom's hand (its bottom edge stops at his glove, so his
// fingers stay in front), and orange sparks spinning round the portal.
const DUEL_FX = `<svg class="duel-fx" viewBox="0 0 1200 791" aria-hidden="true">
  <defs>
    <filter id="marker" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.6"/></filter>
    <filter id="sparkglow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="kingclip"><path d="M664 492 V412 Q664 398 678 398 H794 Q808 398 808 412 V492 Z"/></clipPath>
  </defs>
  <g class="portal" transform="translate(760 400) scale(1 .86)" filter="url(#sparkglow)">
    <circle class="spark s1" r="402" pathLength="100"/>
    <circle class="spark s2" r="384" pathLength="100"/>
    <circle class="spark s3" r="420" pathLength="100"/>
  </g>
  <g class="king" filter="url(#marker)" stroke="#2E1A16" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M664 492 V412 Q664 398 678 398 H794 Q808 398 808 412 V492" fill="#EFE7D8"/>
    <g clip-path="url(#kingclip)">
      <rect x="692" y="410" width="102" height="100" fill="none" stroke="#7A2E2A" stroke-width="2"/>
      <path d="M706 494 Q710 470 724 465 H748 Q762 470 766 494 Z" fill="#C0392B"/>
      <path d="M712 490 L722 470 M720 492 L731 468 M742 492 L752 470 M750 492 L759 476" stroke="#8E2219" stroke-width="2" opacity=".7"/>
      <path d="M724 465 L736 494 L748 465" fill="none" stroke="#E9A92A" stroke-width="3.4"/>
      <ellipse cx="736" cy="449" rx="13" ry="14" fill="#F0C59B"/>
      <path d="M723 452 Q736 477 749 452 Q743 459 736 459 Q729 459 723 452 Z" fill="#5A3A22"/>
      <path d="M719 437 L722 417 L729 428 L736 413 L743 428 L750 417 L753 437 Z" fill="#EDB12E"/>
      <path d="M723 433 L728 424 M733 433 L737 422 M742 433 L746 425" stroke="#C4861A" stroke-width="1.8" opacity=".8"/>
      <path d="M781 416 q-5 6 -5 9 q0 4 4 3 l-1 4 h4 l-1 -4 q4 1 4 -3 q0 -3 -5 -9 z" fill="#1A1A1A" stroke-width="1"/>
    </g>
    <text x="677" y="426" font-family="'Marker Felt', 'Chalkboard SE', 'Comic Sans MS', cursive" font-size="21" fill="#1A1A1A" stroke="none" text-anchor="middle">K</text>
    <text x="677" y="446" font-family="'Marker Felt', 'Chalkboard SE', cursive" font-size="18" fill="#1A1A1A" stroke="none" text-anchor="middle">♠</text>
  </g>
</svg>`;

function duel(item) {
  const box = el("div", "duel");
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", item.drawingLabel);
  const img = el("img");
  img.src = item.drawing;
  img.alt = "";
  box.append(img);
  box.insertAdjacentHTML("beforeend", DUEL_FX);
  return box;
}

// A café chalkboard: his fantasy team's starting lineup, one row per slot, a dot in each NFL team's colour.
function lineup(item) {
  const box = el("div", "lineup");
  box.append(el("p", "lineup-label", "Current fantasy football lineup"), el("p", "lineup-team", item.lineup.team));
  const list = el("ol");
  for (const [pos, name, team, colour] of item.lineup.players) {
    const li = el("li");
    const dot = el("span", "slot-team"); // a dot only, so long names stay on one line; the team is for screen readers
    dot.title = team;
    dot.style.setProperty("--team", colour);
    dot.append(el("span", "sr-only", team));
    li.append(el("span", "slot-pos", pos), el("span", "slot-name", name), dot);
    list.append(li);
  }
  box.append(list);
  return box;
}

function media(item) {
  if (item.timeline) return timeline(item);
  if (item.holo) return holo(item);
  if (item.drawing) return duel(item);
  if (item.lineup) return lineup(item);
  if (!item.media) return el("div", "slot", item.need);
  const isVideo = /\.(mp4|webm)$/.test(item.media);
  const node = el(isVideo ? "video" : "img", "media");
  node.src = item.media;
  if (isVideo) {
    node.muted = node.loop = node.playsInline = true;
    node.autoplay = !reduced;
    node.controls = reduced;
  } else {
    node.alt = item.name;
    node.loading = "lazy";
  }
  return node;
}

function card(item) {
  const node = el("article", item.featured ? "card featured" : "card");
  if (item.draft) node.dataset.draft = "";
  node.append(media(item), el("p", "tag", item.tag), el("h3", "", item.name));
  if (item.line) node.append(el("p", "line", item.line));
  if (item.watched) {
    const list = el("ul", "watched");
    list.append(...item.watched.map((title) => el("li", "", title)));
    node.append(list);
  }
  if (item.credit) node.append(el("p", "credit", item.credit));
  if (item.link) {
    const a = el("a", "link", "Open");
    a.href = item.link;
    a.setAttribute("aria-label", `Open ${item.name}`);
    node.append(a);
  }
  return node;
}

// the open book on the counter inside: what Ethan is reading now
if (SITE.reading) {
  $(".book-title").textContent = SITE.reading.title;
  $(".book-author").textContent = SITE.reading.author;
  const cover = $(".book-cover-img");
  if (SITE.reading.cover) {
    cover.src = SITE.reading.cover;
    cover.alt = `Cover of ${SITE.reading.title} by ${SITE.reading.author}`;
  } else cover.remove();
  if (SITE.reading.quote) $(".book-quote").textContent = `“${SITE.reading.quote}”`;
  else $(".book-quote").remove();
}

// The Experience room (PLAN-experience.md): one order ticket per job, clipped to a steel rail.
// Each ticket has a small ink drawing that plays once when the room opens (CSS, styles.css "tickets"): every
// part's own style IS the finished frame, the animations only run FROM the start, so reduced motion = finished.
// --d = when that part starts, in seconds after its ticket lands.
const HEART = "M0 2.6C-1.6-1.4-6-0.6-6 2.6C-6 5.4-2.6 7.4 0 9.6C2.6 7.4 6 5.4 6 2.6C6-0.6 1.6-1.4 0 2.6Z";
const TICKET_ART = {
  // The Roasters Pack: 1,500+ prospects pour into a filter cone, a few drip into the cup = the sift sheet
  pourover: `
    <text x="34" y="22" text-anchor="middle" class="pop" style="--d:0s">1,500+</text>
    <text x="34" y="31" text-anchor="middle" class="pop soft" style="--d:.1s">prospects</text>
    ${[84, 89, 94, 99, 104, 109, 114, 92, 106, 100].map((x, i) => `<circle class="bean" cx="${x}" cy="${8 + (i % 3) * 2}" r="1.3" style="--d:${(0.3 + i * 0.09).toFixed(2)}s"/>`).join("")}
    <path pathLength="1" d="M72 18H128L110 46H90Z" style="--d:0s"/>
    <path pathLength="1" d="M84 24L95 41M100 24V41M116 24L105 41" class="faint" style="--d:.2s"/>
    ${[0, 1, 2].map((i) => `<circle class="drip" cx="100" cy="51" r="1.5" style="--d:${(1.2 + i * 0.3).toFixed(1)}s"/>`).join("")}
    <path pathLength="1" d="M82 60H118L114 84H86Z" style="--d:.4s"/>
    <path pathLength="1" d="M117 65Q126 65 125 72Q124 78 115 78" style="--d:.6s"/>
    <text x="164" y="72" text-anchor="middle" class="pop" style="--d:2.1s">150+</text>
    <text x="164" y="81" text-anchor="middle" class="pop soft" style="--d:2.2s">sift sheet</text>`,
  // Tatari: a TV (TV and streaming ad analytics) with a chart drawing across it, then who saw it
  tv: `
    <path pathLength="1" d="M88 14L78 3M112 14L122 3" style="--d:.2s"/>
    <rect pathLength="1" x="52" y="14" width="96" height="58" rx="7" style="--d:0s"/>
    <rect pathLength="1" x="60" y="21" width="80" height="44" rx="3" class="faint" style="--d:.3s"/>
    <path pathLength="1" d="M70 72L66 80M130 72L134 80" style="--d:.4s"/>
    <polyline pathLength="1" class="thick" points="66,58 78,50 90,53 102,40 114,44 126,30 134,32" style="--d:.8s"/>
    <circle class="pop dot" cx="134" cy="32" r="2.4" style="--d:1.6s"/>
    <text x="100" y="88" text-anchor="middle" class="pop" style="--d:1.9s">EXEC TEAM</text>`,
  // MLSN MiniDavis: the UC Davis water tower, 5 residents, a search for "timber" finds the memory "gathered two logs"
  town: `
    <path pathLength="1" d="M8 82H192" class="faint" style="--d:0s"/>
    <path pathLength="1" d="M22 82L30 46M50 82L42 46M27 66H45" style="--d:.1s"/>
    <rect pathLength="1" x="24" y="27" width="24" height="19" rx="3" style="--d:.3s"/>
    <path pathLength="1" d="M22 27L36 15L50 27" style="--d:.5s"/>
    ${[64, 76, 88, 100, 112].map((x, i) => `<g class="pop" style="--d:${(0.6 + i * 0.12).toFixed(2)}s"><circle cx="${x}" cy="66" r="3"/><path d="M${x} 69V77M${x - 3} 82L${x} 77L${x + 3} 82M${x - 3} 72H${x + 3}"/></g>`).join("")}
    <rect pathLength="1" x="126" y="10" width="64" height="17" rx="3" style="--d:1.3s"/>
    <text x="158" y="21.5" text-anchor="middle" class="pop" style="--d:1.5s">“timber”</text>
    <path pathLength="1" d="M158 30V42M154 38L158 42L162 38" style="--d:1.8s"/>
    <rect pathLength="1" x="126" y="45" width="64" height="25" rx="3" class="lit" style="--d:2.1s"/>
    <text x="158" y="55.5" text-anchor="middle" class="pop" style="--d:2.2s">gathered</text>
    <text x="158" y="64.5" text-anchor="middle" class="pop" style="--d:2.3s">two logs</text>`,
  // Youphoria: an Instagram grid of 14 posts; 7 hearts come up, 6 of them (85.7%) were the team's own and fade
  phone: `
    <rect pathLength="1" x="78" y="3" width="44" height="84" rx="6" style="--d:0s"/>
    <path pathLength="1" d="M95 8H105" style="--d:.2s"/>
    ${Array.from({ length: 14 }, (_, i) => `<rect class="pop tile" x="${83 + (i % 3) * 12}" y="${13 + Math.floor(i / 3) * 12}" width="10" height="10" rx="1" style="--d:${(0.3 + i * 0.05).toFixed(2)}s"/>`).join("")}
    ${[[140, 66], [150, 50], [162, 70], [172, 46], [184, 62], [158, 28], [178, 18]].map(([x, y], i) =>
      `<g transform="translate(${x} ${y})"><path class="${i === 5 ? "heart real" : "heart fake"}" d="${HEART}" style="--d:${(1.1 + i * 0.12).toFixed(2)}s"/></g>`).join("")}
    <text x="38" y="44" text-anchor="middle" class="pop big" style="--d:2.9s">85.7%</text>
    <text x="38" y="55" text-anchor="middle" class="pop soft" style="--d:3s">our own likes</text>`,
};

function ticket(item, i) {
  const li = el("li", "hang");
  li.style.setProperty("--i", i);
  const node = el("article", "ticket");
  if (item.draft) node.dataset.draft = "";
  const top = el("p", "t-top", `No. ${String(i + 1).padStart(2, "0")}`);
  top.append(el("time", "", item.dates));
  const role = el("p", "t-role");
  role.append(el("b", "", item.role), ` · ${item.about}`);
  const items = el("ul", "t-items");
  for (const line of item.items) {
    const row = el("li");
    row.append(...line.split("**").map((part, k) => (k % 2 ? bold(part) : part))); // **words** = bold
    items.append(row);
  }
  node.append(top);
  node.insertAdjacentHTML("beforeend", `<svg class="t-art" viewBox="0 0 200 90" aria-hidden="true">${TICKET_ART[item.draw] || ""}</svg>`);
  node.append(el("h3", "", item.name), role, items);
  li.append(node);
  return li;
}

// House blends (PLAN-blends.md, PLAN-open-bags.md): one open kraft coffee bag per build on a roaster's shelf, everything
// printed on it (no click). The label's drawing uses the tickets' draw-in (class t-art).
const BAG_ART = {
  // Crema: a cup, its price tag, and margin bars going up
  cup: `
    <path pathLength="1" d="M18 16H44L41 38H21Z" style="--d:0s"/>
    <path pathLength="1" d="M43 21Q51 21 50 27Q49 32 42 32" style="--d:.2s"/>
    <path pathLength="1" d="M12 42H50" style="--d:.3s"/>
    <path pathLength="1" d="M60 8H80L86 15L80 22H60Z" style="--d:.5s"/>
    <text x="71" y="18.5" text-anchor="middle" class="pop" style="--d:.9s">$</text>
    <path pathLength="1" class="thick" d="M64 42V36M72 42V31M80 42V26" style="--d:1.1s"/>`,
  // Finance Board: a board with three pinned cards and a line going up
  board: `
    <rect pathLength="1" x="10" y="5" width="80" height="38" rx="2" style="--d:0s"/>
    ${[[16, 11], [34, 11], [16, 26]].map(([x, y], i) => `<rect class="pop tile" x="${x}" y="${y}" width="14" height="11" rx="1" style="--d:${(0.4 + i * 0.15).toFixed(2)}s"/>`).join("")}
    <polyline pathLength="1" class="thick" points="56,36 63,29 70,32 78,18 84,15" style="--d:1s"/>
    <circle class="pop dot" cx="84" cy="15" r="2" style="--d:1.6s"/>`,
  // Class Wiki: a page of notes, a check (fact-checked), a question (the quiz)
  wiki: `
    <rect pathLength="1" x="16" y="4" width="38" height="40" rx="2" style="--d:0s"/>
    <path pathLength="1" class="faint" d="M22 13H48M22 19H44M22 25H48M22 31H40M22 37H46" style="--d:.3s"/>
    <path pathLength="1" class="thick" d="M60 22L66 28L78 14" style="--d:1s"/>
    <text x="80" y="43" text-anchor="middle" class="pop big" style="--d:1.4s">?</text>`,
  // Card Lister: a card, a voice reading it, an arrow out to the listing
  card: `
    <rect pathLength="1" x="10" y="4" width="26" height="40" rx="2" style="--d:0s"/>
    <rect pathLength="1" class="faint" x="14" y="8" width="18" height="16" rx="1" style="--d:.2s"/>
    <path pathLength="1" class="faint" d="M14 30H32M14 35H28" style="--d:.3s"/>
    <path pathLength="1" d="M44 24Q47 14 50 24T56 24T62 24T68 24" style="--d:.6s"/>
    <path pathLength="1" class="thick" d="M74 24H88M84 20L88 24L84 28" style="--d:1.2s"/>`,
  // Agentic OS: one ring of nodes, everything joined
  ring: `
    <path pathLength="1" d="M68 24A18 18 0 1 0 32 24A18 18 0 1 0 68 24" style="--d:0s"/>
    <path pathLength="1" class="faint" d="M50 6V42M32 24H68M37 11L63 37M63 11L37 37" style="--d:.5s"/>
    ${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 2 * Math.PI; return `<circle class="pop dot" cx="${(50 + 18 * Math.cos(a)).toFixed(1)}" cy="${(24 + 18 * Math.sin(a)).toFixed(1)}" r="2.2" style="--d:${(0.8 + i * 0.08).toFixed(2)}s"/>`; }).join("")}`,
};
// the grinder's bag of beans: crimped top, a degassing valve, side folds; the label is HTML laid over it
const BAG_BODY = `<svg class="bag-body" viewBox="0 0 120 168" aria-hidden="true">
  <path class="kraft" d="M14 18L9 152Q60 160 111 152L106 18Z"/>
  <path class="faint" d="M21 20L17 150M99 20L103 150"/>
  <rect class="kraft" x="14" y="4" width="92" height="14" rx="1.5"/>
  <path class="faint" d="${Array.from({ length: 14 }, (_, i) => `M${20 + i * 6} 6V16`).join("")}"/>
  <circle cx="60" cy="31" r="5"/><circle cx="60" cy="31" r="1.8"/></svg>`;

// an OPEN bag (PLAN-open-bags.md): everything shows at once, no click. Crimped seal and valve on top, the site's
// screenshot in the bag's clear window, then the paper label: a colour band (tag, name, drawing) over a cream sheet
// (the line, the roast notes, the link if any). The kraft outline stretches to whatever height the words need.
const BAG_SHELL = `<svg class="bag-shell" viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true">
  <path class="kraft" d="M10 0L5 96Q60 101 115 96L110 0Z"/><path class="faint" d="M17 2L14 94M103 2L106 94"/></svg>
  <svg class="bag-seal" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
  <rect class="kraft" x="0.5" y="0.5" width="99" height="13" rx="1.5"/>
  <path class="faint" d="${Array.from({ length: 16 }, (_, i) => `M${5 + i * 6} 3V11`).join("")}"/></svg>
  <span class="bag-valve" aria-hidden="true"></span>`;

function bag(item, i) {
  const li = el("li", "bag-slot");
  li.style.setProperty("--i", i);
  const node = el("article", "bag");
  node.style.setProperty("--label", item.label);
  if (item.draft) node.dataset.draft = "";
  node.insertAdjacentHTML("afterbegin", BAG_SHELL);
  if (item.photo) {
    const win = el("figure", "bag-window"), img = el("img");
    img.src = item.photo;
    img.alt = `${item.name}, a screenshot`;
    img.loading = "lazy"; // openRoom turns these eager, so the windows are never blank when the bags land
    win.append(img);
    node.append(win);
  }
  const label = el("div", "bag-label"), band = el("div", "bag-band"), sheet = el("div", "bag-sheet");
  const words = el("div", "bag-words");
  words.append(el("p", "bag-tag", item.tag), el("h3", "bag-name", item.name));
  band.append(words);
  band.insertAdjacentHTML("beforeend", `<svg class="t-art bag-art" viewBox="0 0 100 48" aria-hidden="true">${BAG_ART[item.draw] || ""}</svg>`);
  const notes = el("ul", "bag-notes");
  notes.setAttribute("aria-label", "Roast notes");
  notes.append(...item.notes.map((n) => el("li", "", n)));
  sheet.append(el("p", "bag-line", item.line), notes);
  if (item.link) {
    const a = el("a", "bag-link", `Open ${item.name} ↗`);
    a.href = item.link;
    a.target = "_blank";
    a.rel = "noopener";
    sheet.append(a);
  }
  label.append(band, sheet);
  node.append(label);
  li.append(node);
  return li;
}

// the drum roaster: the idea Ethan is working through now, printed whole on its tag (no click)
function roaster(room) {
  const r = SITE.roasting, tag = $(".roast-tag", room), notes = el("ul", "bag-notes");
  $(".roast-what", tag).textContent = r.title;
  notes.setAttribute("aria-label", "Roast notes");
  notes.append(...r.notes.map((n) => el("li", "", n)));
  tag.append(el("span", "roast-line", r.line), notes);
}

for (const id of Object.keys(SITE.rooms)) {
  const r = SITE.rooms[id];
  if (r.tickets) $(`#${id} .tickets`).append(...SITE[id].map(ticket));
  else if (r.bags) { $(`#${id} .roaster-slot`).before(...SITE[id].map(bag)); roaster(document.getElementById(id)); }
  else $(`#${id} .cards`).append(...SITE[id].map(card));
}

// The fanned tarot card stack: CSS places every card from ONE number, --turn
// (card i is in front when --turn = i), and glides it over the floor sigil.
// Untouched, it turns one card every TURN_S seconds while its room is open; any click, key or swipe in the room
// stops that for good. Only the front card's insides work; a back card is one big "turn me to the front" target.
const TURN_S = 4;
// The floor sigil, after Ethan's photos (assets/inbox/ref-spell-circle-*.png), drawn here, not traced: rims with two
// bands of rune marks, two squares (an 8-point star), a ring of triangles round an octagon, an inner circle, a square
// and a diamond. The cards stand on the r=83 circle (= --R). Runes come from a seeded random, so every load matches.
const SPELL = (() => {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const f = (n) => +n.toFixed(1);
  const pt = (r, a) => `${f(r * Math.cos(a))} ${f(r * Math.sin(a))}`;
  const circle = (r) => `M${r} 0A${r} ${r} 0 1 0 ${-r} 0A${r} ${r} 0 1 0 ${r} 0`;
  const poly = (r, k, a0 = 0) => "M" + Array.from({ length: k }, (_, i) => pt(r, a0 + (i / k) * 2 * Math.PI)).join("L") + "Z";
  // one band of runes between radii r0 and r1: glyphs of 2-4 short strokes in a small (u, v) box, now and then "|||"
  const STROKES = [[0, 0, 0, 1], [1, 0, 1, 1], [0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 1, 1], [0, 1, 1, 0], [0.5, 0, 0.5, 1], [0, 0.5, 1, 0.5], [0, 0, 0.5, 0.5], [0.5, 1, 1, 0.5]];
  const band = (r0, r1, w, gap) => {
    const rm = (r0 + r1) / 2, at = (a, u, v) => pt(r0 + v * (r1 - r0), a + (u * w) / rm);
    let d = "";
    for (let a = 0; a < 2 * Math.PI - (w + gap) / rm; a += (w + gap) / rm) {
      if (rnd() < 0.08) { for (const u of [0.15, 0.5, 0.85]) d += `M${at(a, u, 0)}L${at(a, u, 1)}`; continue; }
      for (let s = 0, k = 2 + Math.floor(rnd() * 3); s < k; s++) {
        const [u0, v0, u1, v1] = STROKES[Math.floor(rnd() * STROKES.length)];
        d += `M${at(a, u0, v0)}L${at(a, u1, v1)}`;
      }
    }
    return d;
  };
  const sq = 72 / Math.SQRT2, tri = Array.from({ length: 8 }, (_, i) => { // triangles on the octagon's edges, pointing out
    const a = ((i + 0.5) / 8) * 2 * Math.PI, h = Math.PI / 8;
    return `M${pt(46, a - h)}L${pt(60, a)}L${pt(46, a + h)}`;
  }).join("");
  const geo = [97, 95.5, 87.5, 83, 76.5, 72, 31, 28.5].map(circle).join("") +
    poly(72, 4, Math.PI / 4) + poly(72, 4) + poly(46, 8, Math.PI / 8) + tri + poly(20, 4, Math.PI / 4) + poly(20, 4);
  const runes = band(88.6, 94.4, 3.4, 1.4) + band(77.4, 82, 2.4, 1.1);
  return `<div class="spell" aria-hidden="true"><svg class="spell-turn" viewBox="-100 -100 200 200">
  <path class="spell-glow" d="${geo}"/><path class="spell-lines" d="${geo}"/><path class="spell-lines runes" d="${runes}"/>
  <circle r="98.6" class="spell-sparks"/>
</svg></div>`;
})();
// A sling-ring portal behind the front card, after Ethan's film stills: a thick band of spark streaks, white-gold on
// the inside edge, orange further out, each streak running along the ring and tilting outward (sparks flung off a
// spinning ring). Three layers, each its own svg spun by CSS on the svg box, so the browser turns a finished picture
// instead of repainting hundreds of lines every frame. Seeded, so it is the same on every load.
const PORTAL = (() => {
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const f = (n) => +n.toFixed(1);
  // count streaks between radii r0..r1, each `len` long along the ring, tilting out by `fly` units at its tail
  const streaks = (count, r0, r1, len, fly) => {
    let d = "";
    for (let i = 0; i < count; i++) {
      const a = rnd() * 2 * Math.PI, r = r0 + (r1 - r0) * rnd() ** 1.5, l = len * (0.4 + rnd()), t = l / r;
      const r2 = r + fly * rnd();
      d += `M${f(r * Math.cos(a))} ${f(r * Math.sin(a))}L${f(r2 * Math.cos(a - t))} ${f(r2 * Math.sin(a - t))}`;
    }
    return d;
  };
  const layer = (k, parts) => `<svg class="${k}" viewBox="-100 -100 200 200">${parts.map(([c, d]) => `<path class="${c}" d="${d}"/>`).join("")}</svg>`;
  return `<div class="ring-portal" aria-hidden="true">
    ${layer("p3", [["pfar", streaks(160, 88, 99, 9, 7)], ["pfar dim", streaks(120, 90, 99, 5, 4)]])}
    ${layer("p2", [["pmid", streaks(260, 82, 92, 12, 4)], ["pmid dim", streaks(160, 80, 94, 8, 3)]])}
    ${layer("p1", [["pcore", streaks(240, 79, 84, 14, 1.5)], ["phot", streaks(120, 79.5, 82, 16, 0.6)]])}
  </div>`;
})();
function ring(room) {
  const box = $(".cards", room), cards = [...box.children], n = cards.length;
  if (n < 2) return;
  box.classList.add("ring");
  box.style.setProperty("--n", n);
  // tarot cards (Ethan, 2026-11-19): each card's numeral at its foot, I, II, III...
  const roman = (k) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][k] ?? String(k + 1);
  cards.forEach((c, i) => {
    c.style.setProperty("--i", i);
    const num = el("p", "card-num", roman(i));
    num.setAttribute("aria-hidden", "true");
    c.append(num);
  });
  box.insertAdjacentHTML("afterbegin", SPELL + PORTAL);
  const portal = $(".ring-portal", box);
  // the portal is sized to the front card's height; a ResizeObserver also catches the room opening (0 tall when hidden)
  const fit = () => { const c = cards.find((k) => k.classList.contains("front")); if (c) portal.style.setProperty("--h", `${c.offsetHeight}px`); };
  const ro = new ResizeObserver(fit);
  cards.forEach((c) => ro.observe(c));
  const nav = el("div", "ring-nav"), at = el("p", "ring-at");
  const prev = el("button", "ring-prev", "‹"), next = el("button", "ring-next", "›");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", "Previous card");
  next.setAttribute("aria-label", "Next card");
  at.setAttribute("aria-live", "polite");
  nav.append(prev, at, next);
  box.after(nav);

  let turn = 0, touched = false, hover = false, held = 0;
  const by = (d) => {
    turn += d;
    const front = ((Math.round(turn) % n) + n) % n;
    box.style.setProperty("--turn", turn);
    cards.forEach((c, i) => { c.classList.toggle("front", i === front); for (const k of c.children) k.inert = i !== front; });
    at.textContent = `${front + 1} / ${n} · ${$("h3", cards[front]).textContent}`;
    fit();
  };
  const to = (i) => { let d = (i - turn) % n; if (d > n / 2) d -= n; if (d < -n / 2) d += n; by(d); }; // the short way round
  const inRing = (t) => box.contains(t) || nav.contains(t);
  by(0);

  room.addEventListener("pointerdown", () => { touched = true; });
  room.addEventListener("keydown", (e) => {
    touched = true;
    if ((e.key !== "ArrowLeft" && e.key !== "ArrowRight") || !inRing(e.target) || e.target.closest("input")) return; // the latte slider keeps its arrows
    e.preventDefault();
    by(e.key === "ArrowLeft" ? -1 : 1);
  });
  prev.addEventListener("click", () => by(-1));
  next.addEventListener("click", () => by(1));
  box.addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c && !c.classList.contains("front")) to(cards.indexOf(c)); });
  box.addEventListener("pointerenter", () => { hover = true; });
  box.addEventListener("pointerleave", () => { hover = false; });
  let drag = null, swallow = false;
  box.addEventListener("pointerdown", (e) => {
    if (!e.isPrimary || e.button !== 0) return;
    swallow = false;
    if (e.target.closest("input, textarea, select")) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY,
      start: parseFloat(getComputedStyle(box).getPropertyValue("--turn")),
      step: cards[0].offsetWidth * 0.7, active: false };
  });
  box.addEventListener("pointermove", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) { drag = null; return; } // leave vertical scrolling to the browser
      drag.active = true;
      box.setPointerCapture(e.pointerId); // capture only a drag, so ordinary clicks keep their original target
      box.classList.add("dragging");
    }
    e.preventDefault();
    by(drag.start - dx / drag.step - turn);
  });
  const drop = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const active = drag.active;
    drag = null;
    if (!active) return;
    swallow = true;
    getComputedStyle(box).getPropertyValue("--turn"); // commit the live position before restoring the glide
    box.classList.remove("dragging");
    by(Math.round(turn) - turn);
    if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
  };
  box.addEventListener("pointerup", drop);
  box.addEventListener("pointercancel", drop);
  // a finger is already captured by the card it touched; taking it over fires that card's lostpointercapture, which
  // bubbles up here. Only the stack's own loss ends the drag.
  box.addEventListener("lostpointercapture", (e) => { if (e.target === box) drop(e); });
  box.addEventListener("dragstart", (e) => { if (drag) e.preventDefault(); });
  box.addEventListener("click", (e) => {
    if (!swallow) return;
    swallow = false;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
  // ponytail: a 1 s tick, so the first turn always comes TURN_S after the room opens, not at a random time
  if (!reduced) setInterval(() => {
    if (current !== room || touched || hover || document.hidden) { held = 0; return; }
    if (++held >= TURN_S) { held = 0; by(1); }
  }, 1000);
}
for (const id of Object.keys(SITE.rooms)) if (!SITE.rooms[id].tickets && !SITE.rooms[id].bags) ring(document.getElementById(id));

// ---------- 4. THE COUNTER AND THE ROOMS ----------
// v2 (PLAN-bar-tabs.md): three tabs on the chalk board. A tab opens its room over the counter, and the same three
// tabs sit on top of the room (.room-tabs), so the visitor can switch rooms without going back first.

const STOPS = Object.keys(SITE.rooms);
const roomTabs = $(".room-tabs");
// Everything a room covers. Made inert while a room is open. Never a room or a room's parent,
// or the open room (and its Back button) would be inert too. The tab row is not covered: it sits on the room.
const pageParts = [".stage", ".corner"].map((s) => $(s)); // not .top: "Ethan Yap" works in a room (it leaves it)
const EASE_OUT = "cubic-bezier(.2,.8,.2,1)";
let current = null; // the open room
let focusBack = null; // the tab a closed room handed focus back to (see sync)
// Own keys only: SITE.rooms["constructor"] is truthy (every object inherits it), so "#constructor" must not count as a room.
const isRoom = (id) => Object.hasOwn(SITE.rooms, id);
// the open room's tab in the row on top is marked; none when no room is open
function markTab(id) {
  for (const a of roomTabs.querySelectorAll("a")) {
    if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}

// ---- the rooms ----

// Count Up (ReactBits CountUp; Ethan 2026-11-20: "just increases the numbers", the odometer looked glitchy): a bold
// NUMBER is plain text that counts up. An invisible copy of the final words holds the width (styles.css .count), so
// nothing shifts. reveal() counts when a tab click opens the room; a deep link and reduced motion just show it.
// Screen readers get the real words (.sr-only); the counting copy is aria-hidden.
function bold(text) {
  if (!/\d/.test(text)) return el("b", "", text);
  const b = el("b"), count = el("span", "count"), fin = el("span", "", text), live = el("span", "", text);
  count.setAttribute("aria-hidden", "true");
  fin.dataset.final = "";
  live.dataset.live = "";
  count.append(fin, live);
  b.append(el("span", "sr-only", text), count);
  return b;
}

// The FIRST number in the words counts from 0, keeping its commas and decimals; the rest stay ("10/10" → "3/10").
// live.run = which count is current, so a newer open stops an older one.
function countUp(live, delay, ms = 1400) {
  const final = live.previousElementSibling.textContent, m = final.match(/\d[\d,]*(\.\d+)?/);
  const to = parseFloat(m[0].replaceAll(",", "")), dp = m[1] ? m[1].length - 1 : 0;
  const fmt = { minimumFractionDigits: dp, maximumFractionDigits: dp, useGrouping: m[0].includes(",") };
  const show = (k) => { live.textContent = final.slice(0, m.index) + (to * k).toLocaleString("en-US", fmt) + final.slice(m.index + m[0].length); };
  const run = live.run = (live.run || 0) + 1, t0 = performance.now() + delay;
  show(0);
  const tick = (now) => {
    if (live.run !== run) return;
    const k = Math.min(1, Math.max(0, (now - t0) / ms));
    show(1 - (1 - k) ** 3); // ease out: fast at first, settling on the number
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Click Spark (ReactBits ClickSpark, by hand; Ethan 2026-11-20: ONLY on "Let's get coffee!", with its liquid metal):
// chrome line sparks (white, silver, a blue and a warm glint, like the rim) fly out of the click and fade. One 2D
// canvas over the page, shown only while they fly; it never takes clicks. data-from = where they started (bits.mjs SP).
const SPARK_COLOURS = ["#FFFFFF", "#D9DAE0", "#B9CCFF", "#FFC88E", "#A3A4AE", "#E9A24D"];
let sparkCanvas = null, sparks = [], sparkRaf = 0;
for (const b of document.querySelectorAll(".button")) b.addEventListener("click", (e) => {
  if (reduced) return;
  if (!sparkCanvas) { sparkCanvas = el("canvas", "sparks"); sparkCanvas.setAttribute("aria-hidden", "true"); document.body.append(sparkCanvas); }
  const r = devicePixelRatio || 1, ctx = sparkCanvas.getContext("2d");
  sparkCanvas.width = innerWidth * r; sparkCanvas.height = innerHeight * r;
  ctx.setTransform(r, 0, 0, r, 0, 0);
  const box = b.getBoundingClientRect(); // a key press clicks at 0,0: start from the button's middle instead
  const x = e.detail ? e.clientX : box.left + box.width / 2, y = e.detail ? e.clientY : box.top + box.height / 2;
  sparkCanvas.dataset.from = `${Math.round(x)},${Math.round(y)}`;
  sparkCanvas.hidden = false;
  const t0 = performance.now();
  for (let i = 0; i < 14; i++) sparks.push({ x, y, a: (i / 14) * 2 * Math.PI + (Math.random() - 0.5) * 0.4, reach: 0.7 + Math.random() * 0.6, c: SPARK_COLOURS[i % SPARK_COLOURS.length], t0 });
  if (!sparkRaf) sparkRaf = requestAnimationFrame(drawSparks);
});
function drawSparks(now) {
  sparkRaf = 0;
  const ctx = sparkCanvas.getContext("2d");
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.lineWidth = 2.2; ctx.lineCap = "round";
  sparks = sparks.filter((s) => {
    const p = (now - s.t0) / 600;
    if (p >= 1) return false;
    const k = 1 - (1 - p) ** 3, d = 52 * s.reach * k, len = 18 * (1 - k);
    ctx.strokeStyle = s.c;
    ctx.beginPath();
    ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
    ctx.lineTo(s.x + Math.cos(s.a) * (d + len), s.y + Math.sin(s.a) * (d + len));
    ctx.stroke();
    return true;
  });
  if (sparks.length) sparkRaf = requestAnimationFrame(drawSparks);
  else sparkCanvas.hidden = true;
}

// Spotlight (ReactBits SpotlightCard, ported by hand): a soft light follows the pointer over each order ticket (not the
// coffee bags since 2026-11-20). JS only says where (--mx / --my, registered in styles.css so the light glides) and which one is lit.
let litCard = null;
addEventListener("pointermove", (e) => {
  const card = e.pointerType === "mouse" ? e.target.closest?.(".ticket") : null; // a finger has no hover
  if (litCard && litCard !== card) litCard.classList.remove("lit");
  litCard = card;
  if (!card) return;
  const b = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - b.left}px`);
  card.style.setProperty("--my", `${e.clientY - b.top}px`);
  card.classList.add("lit");
});
document.documentElement.addEventListener("pointerleave", () => litCard?.classList.remove("lit"));

// The words and cards come in, one after another.
function reveal(room) {
  [...room.querySelectorAll(".back, .room-head > div, .card")].forEach((node, i) => {
    node.animate(
      [{ opacity: 0, translate: "0 14px" }, { opacity: 1, translate: "0 0" }], // translate, not transform: the ring owns each card's transform
      { duration: 420, delay: 100 + 45 * i, easing: EASE_OUT, fill: "backwards" },
    );
  });
  // order tickets drop into their clips on the rail, one after another, and swing to a stop (the clips stay put)
  [...room.querySelectorAll(".ticket")].forEach((t, i) => t.animate(
    [{ opacity: 0, translate: "0 -56px", rotate: "0deg" }, { opacity: 1, translate: "0 0", rotate: "4deg", offset: 0.4 },
      { rotate: "-2.5deg", offset: 0.62 }, { rotate: "1deg", offset: 0.82 }, { opacity: 1, translate: "0 0", rotate: "0deg" }],
    { duration: 900, delay: 250 + 120 * i, easing: "ease-out", fill: "backwards" },
  ));
  // Count Up: each number shows 0 at once and counts up once its ticket has landed
  [...room.querySelectorAll(".ticket")].forEach((t, i) => t.querySelectorAll(".count > [data-live]").forEach((n) => countUp(n, 750 + 120 * i)));
  // coffee bags are set down on the shelf one after another: down, a small settle, still
  [...room.querySelectorAll(".bag")].forEach((b, i) => b.animate(
    [{ opacity: 0, translate: "0 -40px" }, { opacity: 1, translate: "0 0", offset: 0.55 }, { translate: "0 -4px", offset: 0.75 }, { opacity: 1, translate: "0 0" }],
    { duration: 750, delay: 250 + 110 * i, easing: "ease-out", fill: "backwards" },
  ));
}

// focus goes to Back, except on a switch from the tab row (focus stays on the tab that was clicked)
function settle(room, focus = true) {
  if (focus) $(".back", room).focus({ preventScroll: true });
}

// ---- the grinder walk (PLAN-bar-tabs.md part 2) ----
// The FIRST step from Inside to the Counter per visit (a deep link, reduced motion and every later walk skip it)
// plays Ethan's grinder over the whole screen, by itself, about 3 s: the bag tips into the hopper, it grinds, then the
// camera pushes into the grounds bin while the normal dolly to the counter starts underneath. Input waits for it.
const grind = $(".grind");
const beans = $(".beans-bag", grind);
const hopper = $(".hopper", grind);
beans.insertAdjacentHTML("afterbegin", BAG_BODY);
const POUR_MS = 1100, GRIND_MS = 1000, PUSH_MS = 800; // styles.css .grind timings match these
let ground = false; // has this visit ground the beans yet?
let grinding = false; // the grinder is up and has not handed over to the dolly yet
let grindRun = 0; // goes up when a walk starts or something else moves the camera mid-way
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

function stopGrind() {
  grinding = false;
  grindRun++;
  grind.hidden = true;
  delete grind.dataset.step;
  for (const a of [...grind.getAnimations({ subtree: true })]) a.cancel();
}
async function grindWalk(index, opts) {
  ground = grinding = true;
  const run = ++grindRun;
  lockUntil = Infinity; // released by the go() that hands over to the dolly
  for (const a of [...grind.getAnimations({ subtree: true })]) a.cancel();
  delete grind.dataset.step;
  grind.style.transformOrigin = "";
  grind.hidden = false;
  grind.animate({ opacity: [0, 1] }, { duration: 220, easing: "ease-out" });
  await pause(120);
  if (run !== grindRun) return;
  grind.dataset.step = "pour";
  // tip the bag over the hopper: its open top (half its height above its middle) ends just over the hopper's mouth
  const b = beans.getBoundingClientRect(), hp = hopper.getBoundingClientRect(), H = beans.offsetHeight, tip = 130 * Math.PI / 180;
  const to = { x: hp.left + hp.width / 2 - (H / 2) * Math.sin(tip) - (b.left + b.width / 2), y: hp.top - H * 0.06 + (H / 2) * Math.cos(tip) - (b.top + b.height / 2) };
  beans.animate([
    { translate: "0 0", rotate: "0deg" },
    { translate: "0 -18px", rotate: "-4deg", offset: 0.12 }, // picked up
    { translate: `${to.x}px ${to.y}px`, rotate: "130deg", offset: 0.45 },
    { translate: `${to.x}px ${to.y}px`, rotate: "137deg", offset: 0.58 }, // a shake to get the last beans out
    { translate: `${to.x}px ${to.y}px`, rotate: "127deg", offset: 0.7 },
    { translate: `${to.x}px ${to.y}px`, rotate: "133deg", opacity: 1, offset: 0.8 },
    { translate: `${to.x - 40}px ${to.y - 70}px`, rotate: "110deg", opacity: 0 },
  ], { duration: POUR_MS, easing: "ease-in-out", fill: "forwards" });
  await pause(POUR_MS - 100);
  if (run !== grindRun) return;
  grind.dataset.step = "pour grind";
  await pause(GRIND_MS);
  if (run !== grindRun) return;
  // the camera pushes into the grounds bin; the dolly to the counter starts under it as the grinder fades
  const bin = $(".bin", grind).getBoundingClientRect();
  grind.style.transformOrigin = `${bin.left + bin.width / 2}px ${bin.top + bin.height * 0.55}px`;
  const push = grind.animate([{ scale: 1, opacity: 1 }, { scale: 2.2, opacity: 1, offset: 0.35 }, { scale: 8, opacity: 0 }],
    { duration: PUSH_MS, easing: "cubic-bezier(.55,0,.65,1)", fill: "forwards" });
  grinding = false;
  burstFrom($(".bin", grind), ["#C49A4A", "#7B4A2A", "#F2E8DA"]); // the light tunnel, out of the grounds
  go(index, opts);
  await push.finished.catch(() => {});
  if (run === grindRun) stopGrind();
}

async function openRoom(id, fromBar = false) {
  const room = document.getElementById(id);
  if (!isRoom(id) || current === room) return;
  const switching = !!current; // room to room, from the tab row
  if (current) closeRoom(false, false);
  current = room;
  root.classList.add("in-room");
  for (const part of pageParts) part.inert = true;
  markTab(id);
  for (const a of room.getAnimations()) a.cancel();
  for (const n of room.querySelectorAll("[data-live]")) { n.run = (n.run || 0) + 1; n.textContent = n.previousElementSibling.textContent; } // stop an old count
  room.classList.add("open");
  room.scrollTop = 0;
  for (const img of room.querySelectorAll(".bag-window img")) img.loading = "eager"; // House blends' windows load now
  if (!fromBar || reduced) return settle(room, !switching); // a deep link: there at once
  room.animate({ opacity: [0, 1] }, { duration: 300, easing: "ease-out" });
  reveal(room);
  settle(room, !switching);
}

function closeRoom(returnFocus = true, animate = !reduced) {
  if (!current) return;
  const room = current;
  current = null;
  root.classList.remove("in-room");
  for (const part of pageParts) part.inert = false;
  markTab(null);
  if (returnFocus) {
    const tab = $(`.stop[data-stop="${room.id}"]`);
    tab.focus({ preventScroll: true });
    focusBack = tab; // sync puts focus back here if the browser's Back step drops it (see sync)
  }
  const done = () => { if (current !== room) room.classList.remove("open"); };
  if (!animate) return done();
  burstFrom($(`.stop[data-stop="${room.id}"]`), ["#F2E8DA"], { flow: "outward" }); // the light tunnel, back out of the room's tab
  const fade = room.animate({ opacity: [1, 0] }, { duration: 200, easing: "ease-out", fill: "forwards" });
  fade.finished.then(() => { done(); fade.cancel(); }, () => {});
}

// ---- the light tunnel (ReactBits LightTunnel, PLAN-open-bags.md part B) ----
// A short burst (~0.9 s) of cream strands curling like steam, comets racing through them, every time you move: into a
// room from its tab (in that room's colours), room to room, back to the counter, through the shop doors, and into the
// grounds at the end of the grinder. One full-screen canvas over everything, drawn at half size, idle between bursts.
// No WebGL2 or reduced motion: nothing (the moves stay as they were).
// Ported by hand from ReactBits LightTunnel (MIT + Commons Clause, David Haz) - free on this site, never sold.
const tunnelBurst = (() => {
  const vertex = `#version 300 es
  const vec2 points[3] = vec2[3](vec2(-1,-1), vec2(3,-1), vec2(-1,3));
  void main() { gl_Position = vec4(points[gl_VertexID], 0, 1); }`;
  const fragment = `#version 300 es
  precision highp float;
  uniform vec2 uResolution, uCenter;
  uniform float uRatio, uTime, uFlow, uOpacity;
  uniform vec3 uColors[5];
  uniform int uColorCount;
  out vec4 outColor;
  const float TAU = 6.2831853, COUNT = 30.0, SPACING = 0.4;
  const vec3 CREAM = vec3(0.94902, 0.90980, 0.85490), BODY = vec3(0.48235, 0.29020, 0.16471);
  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  void main() {
    float scale = min(uResolution.x, uResolution.y) * 0.5;
    vec2 p = (gl_FragCoord.xy - uCenter) / scale;
    float r = length(p), depth = -log(max(r, 1e-5)), px = r * scale;
    float drift = uTime * 1.3, swing = sin(drift * 0.9) * 0.4 / TAU;
    float s = atan(p.y, p.x) / TAU - swing - 0.09 * sin(depth * 1.2 + drift * 0.5);
    float cell = floor(s * COUNT), spacing = TAU * px / COUNT;
    float near = smoothstep(0.55, 1.25, r);
    float width = 0.55 * uRatio * (1.0 + near * 1.2);
    float soft = uRatio * (0.55 + near * 0.9);
    float tight = uRatio * 2.4 * (1.0 + near), wide = tight * 4.5;
    float lines = 0.0, body = 0.0;
    vec3 glow = vec3(0.0), averageTint = vec3(0.0);
    for (int k = -3; k <= 3; k++) {
      float i = cell + float(k), id = mod(i, COUNT);
      float h1 = hash(id), h2 = hash(id + 17.0), h3 = hash(id + 41.0), h4 = hash(id + 73.0);
      vec3 color = uColors[min(int(hash(id + 103.0) * float(uColorCount)), uColorCount - 1)];
      averageTint += color / 7.0;
      float center = (i + 0.5 + (h1 - 0.5) * 0.55) / COUNT;
      center += 0.18 * sin(depth * (0.8 + h2 * 0.9) + drift * (0.4 + h3 * 0.5) + h4 * TAU) / COUNT;
      float d = abs(s - center) * TAU * px, shade = 1.0 + (h3 - 0.5) * 0.9;
      float reach = 1.0 - smoothstep(spacing * 1.4, spacing * 2.4, d);
      lines += (1.0 - smoothstep(width - soft, width + soft, d)) * shade;
      body += exp(-d / max(spacing * 0.22, 0.001)) * shade * reach;
      float x = depth * SPACING + uTime * 8.0 * (0.55 + h2 * 0.6) * uFlow + h4 * 7.0;
      float lead = (fract(x) - 0.5) / SPACING * uFlow;
      float lit = step(hash(id * 3.7 + floor(x) * 13.1), 0.5), limit = 0.5 / SPACING;
      float head = exp(-pow(max(-lead, 0.0) / 0.071232, 2.0)) * smoothstep(-limit, -limit * 0.8, lead);
      float tail = exp(-max(lead, 0.0) / 0.30912) * (1.0 - smoothstep(limit * 0.55, limit, lead));
      float pulse = (lead < 0.0 ? head : tail) * lit;
      float hot = pulse * (lead < 0.0 ? 1.0 : exp(-max(lead, 0.0) / 0.108192));
      float core = 1.5 * width + 0.35 * uRatio;
      float stroke = 1.0 - smoothstep(core - soft, core + soft, d);
      float bloom = (exp(-d / tight) * 0.7 + exp(-d / wide) * 0.18) * reach;
      glow += mix(color, vec3(1.0), hot * 0.55) * pulse * (stroke * 1.5 + bloom) * shade;
    }
    float lod = 1.0 - smoothstep(1.2, 4.0, spacing);
    float average = min(2.0 * 0.55 * uRatio / max(spacing, 0.001), 1.0);
    lines = mix(lines, average, lod);
    glow = mix(glow, averageTint * average * 0.3, lod);
    body = mix(body, 1.0, lod) * 0.15;
    float rr = r * 0.25;
    float fade = smoothstep(0.0, 0.5, rr) * (1.0 - smoothstep(1.1, 2.0, rr));
    float grain = 1.0 + (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime * 7.0) * 43758.5453) - 0.5) * 0.16;
    vec3 light = (CREAM * lines * 0.12 + BODY * body * 0.35 + glow) * fade * grain;
    vec3 mapped = (1.0 - exp(-light * 1.4)) * uOpacity;
    outColor = vec4(mapped, max(mapped.r, max(mapped.g, mapped.b)));
  }`;
  let canvas, gl, program, uniforms, active;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2) * 0.5;
    const w = Math.max(1, Math.round(innerWidth * ratio)), h = Math.max(1, Math.round(innerHeight * ratio));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  };
  const init = () => {
    if (canvas) return !!gl && !!program && !gl.isContextLost();
    canvas = document.createElement("canvas");
    canvas.className = "tunnel"; canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:2147483000;pointer-events:none;display:none";
    document.body.append(canvas);
    gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return false;
    const shaders = [vertex, fragment].map((source, i) => {
      const shader = gl.createShader(i ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      return shader;
    });
    const linked = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(linked, shader)); gl.linkProgram(linked);
    const ready = shaders.every(shader => gl.getShaderParameter(shader, gl.COMPILE_STATUS)) && gl.getProgramParameter(linked, gl.LINK_STATUS);
    shaders.forEach(shader => gl.deleteShader(shader));
    if (!ready) { gl.deleteProgram(linked); return false; }
    program = linked;
    uniforms = Object.fromEntries(["uResolution", "uCenter", "uRatio", "uTime", "uFlow", "uOpacity", "uColors[0]", "uColorCount"]
      .map(name => [name, gl.getUniformLocation(program, name)]));
    addEventListener("resize", () => { if (active) resize(); });
    canvas.addEventListener("webglcontextlost", () => { active?.finish(); gl = null; });
    return true;
  };
  return function tunnelBurst({ x, y, colors, flow = "inward", ms = 900, onPeak }) {
    while (active) active.finish();
    let peaked = false;
    const peak = () => {
      if (peaked) return;
      peaked = true;
      try { onPeak?.(); } catch (error) { console.error(error); }
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !init()) { peak(); return Promise.resolve(false); }
    const palette = new Float32Array(15);
    colors.slice(0, 5).forEach((hex, i) => {
      hex = hex.slice(1);
      if (hex.length === 3) hex = [...hex].map(c => c + c).join("");
      const n = parseInt(hex, 16);
      palette.set([(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255], i * 3);
    });
    resize(); canvas.style.display = "block";
    canvas.dataset.from = `${Math.round(x)},${Math.round(y)}`; // where it started (verify/bits.mjs RB9-RB13)
    canvas.dataset.colors = colors.join(" ");
    const start = performance.now();
    ms = Math.max(1, ms);
    return new Promise(resolve => {
      let raf = 0, timer, drawn = false, time = 0, last = start;
      const run = { finish: () => {
        if (active !== run) return;
        active = null; cancelAnimationFrame(raf); clearTimeout(timer);
        canvas.style.display = "none";
        if (gl && !gl.isContextLost()) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
        peak(); resolve(drawn);
      } };
      active = run;
      const frame = now => {
        if (active !== run) return;
        const t = Math.min(1, (now - start) / ms), ramp = t < 0.45 ? t / 0.45 : (1 - t) / 0.55;
        const envelope = ramp * ramp * (3 - 2 * ramp);
        time += Math.min((now - last) / 1000, 0.05) * (0.18 + envelope * 1.2); last = now;
        gl.useProgram(program);
        gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.uCenter, x * canvas.width / innerWidth, (innerHeight - y) * canvas.height / innerHeight);
        gl.uniform1f(uniforms.uRatio, canvas.width / innerWidth);
        gl.uniform1f(uniforms.uTime, time); gl.uniform1f(uniforms.uFlow, flow === "outward" ? 1 : -1);
        gl.uniform1f(uniforms.uOpacity, envelope);
        gl.uniform3fv(uniforms["uColors[0]"], palette); gl.uniform1i(uniforms.uColorCount, Math.min(colors.length, 5));
        gl.drawArrays(gl.TRIANGLES, 0, 3); drawn ||= envelope > 0;
        if (t >= 0.45) peak();
        if (active === run) { if (t >= 1) run.finish(); else raf = requestAnimationFrame(frame); }
      };
      timer = setTimeout(run.finish, ms); // Finish even in a hidden tab, where rAF pauses.
      frame(start);
    });
  };
})();

// each room's comets: House blends = the 5 bag labels, On shift = ticket cream, Off the clock = the spell ring's orange
const ROOM_LIGHT = { specials: SITE.specials.map((b) => b.label), shifts: ["#F2E8DA"], offclock: ["#FFB43A", "#FF7A1A"] };
// a burst from the middle of a node (a tab, the doorway, the grounds bin), `wait` ms from now
function burstFrom(node, colors, { flow = "inward", ms = 900, wait = 0 } = {}) {
  if (!node || reduced) return;
  const fire = () => { const b = node.getBoundingClientRect(); tunnelBurst({ x: b.left + b.width / 2, y: b.top + b.height / 2, colors, flow, ms }); };
  if (wait) setTimeout(fire, wait); else fire();
}

// ---------- 5. THE STAGE ----------
// One locked screen. The four scenes sit on top of each other; data-at says where each one is
// (past / here / next) and CSS moves the camera between them. Only "here" can be reached by focus
// or a screen reader (the others are inert). Each scene is its own scroll box, for text that does
// not fit (big text, short windows): its own scroll always wins before a step.

const stage = $(".stage");
const SCENES = [...stage.querySelectorAll(":scope > [data-scene]")];
const HASHES = SCENES.map((s) => s.id); // street, inside, bar, register
const COUNTER = HASHES.indexOf("bar");
const INSIDE = HASHES.indexOf("inside");
// the 3D room inside (PLAN-bookshelf.md). Phones see one stop at a time, left to right: rug, book, machine.
// The checkout room at the register (PLAN-bio.md) works the same way: board, then till.
const shopRoom = $("#inside .shop-room");
const tillRoom = $("#register .shop-room");
const LOOKS = { [INSIDE]: [shopRoom, ["shelf", "book", "machine"]], [HASHES.indexOf("register")]: [tillRoom, ["board", "till"]] };
const lookBy = (d) => {
  const [room, views] = LOOKS[here];
  closeBook();
  room.dataset.view = views[Math.max(0, Math.min(views.length - 1, views.indexOf(room.dataset.view) + d))];
};
// phones: a receipt link or the button taking keyboard focus brings the camera round to the till
tillRoom.addEventListener("focusin", () => { if (phone.matches) tillRoom.dataset.view = "till"; });

// ---- the bookcase on the rug (PLAN-bookshelf.md Phase B) ----
// Built from content.js shelf. The case is sized to the books: rows grow as the square root of the count (8 books:
// 2 rows of 4; 13 to 27: 3 rows), so it grows taller AND wider as Ethan adds books. All sizes in room units.
// Once it would pass MAX (46u tall: under the ceiling; 26u wide: clear of the table), the whole case shrinks to fit.
const BOOK = { h: 15, w: 3.1 }, CASE = { cx: 18, side: 0.9, board: 0.8, base: 2, cap: 1, room: 1.6, gap: 0.22, depth: 8 }, MAX = { h: 46, w: 26 };
const shelfCard = $(".shelf-card");
let picked = null; // the book now tilted out, if any
const setBox = (node, x, y, w, h) => { for (const [k, v] of Object.entries({ bx: x, by: y, bw: w, bh: h })) node.style.setProperty(`--${k}`, +v.toFixed(2)); };
function buildShelf(books) {
  const kase = $("#inside .case");
  closeBook();
  kase.replaceChildren();
  const n = Math.max(1, Math.ceil(Math.sqrt(books.length / 3)));
  const per = Math.ceil(books.length / n);
  const rows = Array.from({ length: n }, (_, i) => books.slice(i * per, (i + 1) * per)); // top row first
  const bw = (b) => b.w || BOOK.w, bh = (b) => b.h || BOOK.h;
  const inner = Math.max(...rows.map((r) => r.reduce((s, b) => s + bw(b) + CASE.gap, 0))) + 1.2;
  const rowH = rows.map((r) => Math.max(...r.map(bh)) + CASE.room);
  const W = inner + 2 * CASE.side;
  const H = CASE.base + rowH.reduce((a, b) => a + b, 0) + CASE.board * (n - 1) + CASE.cap;
  const s = Math.min(1, MAX.h / H, MAX.w / W);
  const fit = (node, x, y, w, h) => setBox(node, x * s, y * s, w * s, h * s);
  setBox(kase, CASE.cx - (W * s) / 2, 0, W * s, H * s);
  kase.style.setProperty("--fit", +s.toFixed(3)); // the spine lettering and the books' depth shrink with it (styles.css)
  kase.dataset.rows = n;
  const part = (cls, x, y, w, h) => { const p = el("i", `plane ${cls}`); p.setAttribute("aria-hidden", "true"); fit(p, x, y, w, h); kase.append(p); };
  part("c-back", 0, 0, W, H);
  part("c-side c-left", 0, 0, CASE.depth, H);
  part("c-side c-right", W - CASE.depth, 0, CASE.depth, H);
  part("c-face", 0, 0, CASE.side, H); // the two uprights' front edges
  part("c-face", W - CASE.side, 0, CASE.side, H);
  part("c-face", 0, 0, W, CASE.base); // the plinth
  part("c-face", 0, H - CASE.cap, W, CASE.cap); // the top rail
  part("c-board", 0, H, W, CASE.depth); // the top, seen only from above
  // each row's shelf height, bottom row up; then the books go in top row first, so Tab and screen readers go in order
  const floorY = [];
  for (let i = n - 1, y = CASE.base; i >= 0; i--) {
    floorY[i] = y;
    part("c-board", CASE.side, y, inner, CASE.depth); // the shelf this row stands on
    y += rowH[i];
    if (i > 0) { part("c-face", 0, y, W, CASE.board); y += CASE.board; }
  }
  for (let i = 0; i < n; i++) {
    const y = floorY[i];
    let x = CASE.side + 0.6;
    for (const b of rows[i]) {
      const book = el("button", `shelf-book ${(b.type || "serif").split(/\s+/).map((t) => `t-${t}`).join(" ")}`);
      book.type = "button";
      book.setAttribute("aria-label", `${b.title} by ${b.author}`);
      book.setAttribute("aria-expanded", "false");
      book.setAttribute("aria-controls", "shelf-card");
      book.style.cssText = `--spine:${b.spine || "#5A381F"};--ink-1:${b.ink || "#F2E8DA"};${b.ink2 ? `--ink-2:${b.ink2}` : ""}`;
      fit(book, x, y, bw(b), bh(b));
      book.append(el("span", "b-title", b.title), el("span", "b-author", b.author), el("i", "b-top"), el("i", "b-side b-r"), el("i", "b-side b-l"));
      book.book = b;
      kase.append(book);
      x += bw(b) + CASE.gap;
    }
  }
}
// Put the card beside the case (left, else right); on a phone, under or over it. Never over the picked book.
function placeCard(book) {
  const box = $("#inside > .wrap").getBoundingClientRect(), pan = $("#inside .room-pan").getBoundingClientRect();
  // beside the case for a shelf book, beside the frame itself for Ethan's own book on the wall
  const kase = (book.closest(".case") || book).getBoundingClientRect(), b = book.getBoundingClientRect();
  const cw = shelfCard.offsetWidth, ch = shelfCard.offsetHeight, m = 12;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const left = Math.max(pan.left, 0), right = Math.min(pan.right, innerWidth);
  let x, y = clamp(b.top + b.height / 2 - ch / 2, pan.top + m, pan.bottom - m - ch);
  if (kase.left - left >= cw + 2 * m) x = kase.left - m - cw;
  else if (right - kase.right >= cw + 2 * m) x = kase.right + m;
  else {
    // a phone: under the case, over it, or at the bottom or top of the room: the first spot clear of the book
    x = clamp(kase.left + kase.width / 2 - cw / 2, left + m, right - m - cw);
    const spots = [kase.bottom + m, kase.top - m - ch, pan.bottom - m - ch, pan.top + m].filter((v) => v >= pan.top && v + ch <= pan.bottom);
    y = spots.find((v) => v + ch <= b.top || v >= b.bottom) ?? pan.bottom - m - ch;
  }
  shelfCard.style.left = `${x - box.left}px`;
  shelfCard.style.top = `${y - box.top}px`;
}
function openBook(book) {
  if (picked === book) return closeBook();
  closeBook();
  picked = book;
  book.classList.remove("nudge"); // a click mid-cue: the tilt wins at once
  const b = book.book;
  book.setAttribute("aria-expanded", "true");
  $(".shelf-card-label").textContent = b.label || "Finished";
  $(".shelf-card-title").textContent = b.title;
  $(".shelf-card-author").textContent = b.author;
  const note = $(".shelf-card-note"), link = $(".shelf-card-link");
  note.textContent = b.note || "";
  note.hidden = !b.note;
  link.hidden = !b.link;
  if (b.link) link.href = b.link;
  const img = $(".shelf-card-cover");
  img.hidden = !b.cover;
  if (b.cover) img.src = b.cover;
  shelfCard.hidden = false;
  placeCard(book);
}
function closeBook() {
  if (!picked) return;
  picked.setAttribute("aria-expanded", "false");
  picked = null;
  shelfCard.hidden = true;
}
if (SITE.shelf?.length) buildShelf(SITE.shelf);
$("#inside .case").addEventListener("click", (event) => { const book = event.target.closest(".shelf-book"); if (book) openBook(book); });
// Ethan's own book, standing on the table: the same card, with his line and the Amazon link
const bookStand = $("#inside .book-stand");
bookStand.book = SITE.wrote;
bookStand.addEventListener("click", () => openBook(bookStand));
bookStand.addEventListener("focusin", () => { if (phone.matches) shopRoom.dataset.view = "machine"; });
// a click anywhere that is not a book or the card puts the book back
addEventListener("pointerdown", (event) => { if (picked && !event.target.closest?.(".shelf-book, .book-stand, .shelf-card")) closeBook(); });
addEventListener("keydown", (event) => { if (event.key === "Escape" && picked) { const book = picked; closeBook(); book.focus({ preventScroll: true }); } });
addEventListener("resize", () => { if (picked) placeCard(picked); });
// phones: a book taking keyboard focus brings the camera round to the shelf
$("#inside .case").addEventListener("focusin", () => { if (phone.matches && shopRoom.dataset.view !== "shelf") shopRoom.dataset.view = "shelf"; });
const LAST = SCENES.length - 1;
const MOVE_MS = reduced ? 0 : 900; // one camera move; matches the transition in styles.css
const DOOR_MS = reduced ? 0 : 1400; // stepping in from the street: the doors swing (0.5 s), then the camera moves (0.9 s)
const SHUT_MS = reduced ? 0 : 1650; // back out to the street: the doors wait 0.85 s, then shut for 0.8 s (styles.css .leaf)
let moveMs = MOVE_MS; // how long the move now under way takes
const STEP_DELTA = 50; // how much wheel counts as one step
const QUIET_MS = 200; // a trackpad keeps firing wheel events after a flick; a NEW gesture needs this much quiet first
let here = -1;
let lockUntil = 0; // no new step before this time: the camera is still moving
const arrived = new Set(); // scenes whose one-time arrival effect already ran

// The one function that moves the camera. `effects`: run the scene's arrival (draw, print).
// `writeUrl`: put the scene in the address bar (replaceState: scenes never pile up in Back history,
// and replaceState fires neither popstate nor hashchange, so it never re-enters sync).
function go(index, { instant = false, effects = true, writeUrl = true } = {}) {
  index = Math.max(0, Math.min(LAST, index));
  const from = here;
  if (grinding) { stopGrind(); lockUntil = 0; } // anything else moving the camera (Back, a link) ends the grinder walk
  if (!ground && !instant && !reduced && from === INSIDE && index === COUNTER) return grindWalk(index, { effects, writeUrl });
  if (index !== here) {
    here = index;
    // Inside ↔ Counter is a dolly, Counter ↔ Register a pan (styles.css, data-move). The move is set and the
    // scenes jump to its start BEFORE data-at changes, so each scene leaves from the right place.
    const pair = (a, b) => Math.min(from, index) === a && Math.max(from, index) === b;
    const move = instant || reduced ? "" : pair(1, 2) ? "dolly" : pair(2, 3) ? "pan" : "";
    if ((stage.dataset.move || "") !== move) {
      stage.classList.add("instant");
      if (move) stage.dataset.move = move; else delete stage.dataset.move;
      void stage.offsetWidth;
      if (!instant) stage.classList.remove("instant");
    }
    if (instant) stage.classList.add("instant");
    // leaving the street: the doors swing open first and the camera waits for them (styles.css, data-door)
    const door = !instant && !reduced && from === 0 && index > 0;
    if (door) stage.dataset.door = "in"; else delete stage.dataset.door;
    // the light tunnel pours out of the doorway once the doors are open, as the camera starts through them
    if (door) burstFrom($(".doors"), ["#F2E8DA", "#C96B2C", "#E9A24D"], { wait: 400, ms: 1000 });
    // back out onto the street: no new step until the doors have shut (inspection 4 R3)
    const shutting = !instant && !reduced && from > 0 && index === 0;
    moveMs = door ? DOOR_MS : shutting ? SHUT_MS : MOVE_MS;
    SCENES.forEach((scene, i) => {
      scene.dataset.at = i < index ? "past" : i > index ? "next" : "here";
      scene.inert = i !== index;
    });
    SCENES[index].scrollTop = 0;
    // back out on the street, a phone's camera faces the table again, so the next walk in lines up with the door
    if (index === 0) shopRoom.dataset.view = "machine";
    if (index !== INSIDE) closeBook();
    fitZoom(); // same task as the data-at change: nothing paints in between
    stage.classList.add("ready");
    root.dataset.scene = HASHES[index];
    if (instant) { void stage.offsetWidth; stage.classList.remove("instant"); }
    lockUntil = performance.now() + (instant ? 0 : moveMs);
  }
  if (writeUrl) history.replaceState(null, "", index === 0 ? location.pathname + location.search : `#${HASHES[index]}`);
  if (effects) onArrive(index, instant, from);
}

// The zoom through the shop window. Both scenes fill the screen, so one set of screen numbers fits both.
// Layout offsets, not getBoundingClientRect: they ignore the scenes' own transforms, so this works from any scene.
function layoutBox(el, scene) {
  let x = 0, y = 0;
  for (let n = el; n && n !== scene; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y: y - scene.scrollTop, w: el.offsetWidth, h: el.offsetHeight };
}
// The big machine stands in a 3D room, so layout offsets miss the perspective. Measure where it really shows, then
// take out the scene's own 2D move (scale + translate), giving the same numbers as layoutBox would.
function shownBox(el, scene) {
  const r = el.getBoundingClientRect(), s = scene.getBoundingClientRect(), k = s.width / scene.offsetWidth;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
function fitZoom() {
  const street = $("#street"), inside = $("#inside"), shop = $("#street .storefront"), big = $("#machine");
  const m = $("#street .shop-machine");
  if (!shop || !big || !m) return;
  const s = layoutBox(shop, street), b = shownBox(big, inside);
  const a = (name) => +m.getAttribute(name); // the machine's box in the drawing's own units
  const vb = m.ownerSVGElement.viewBox.baseVal; // the drawing starts at vb.y (the roof is above y = 0)
  const u = s.w / vb.width;
  const small = { x: s.x + (a("x") - vb.x + a("width") / 2) * u, y: s.y + (a("y") - vb.y + a("height") / 2) * u, w: a("width") * u };
  if (!small.w || !b.w) return;
  const bigC = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const k = b.w / small.w, dx = bigC.x - small.x, dy = bigC.y - small.y;
  street.style.setProperty("--zoom-origin", `${small.x}px ${small.y}px`);
  street.style.setProperty("--zoom", `translate(${dx}px, ${dy}px) scale(${k})`);
  inside.style.setProperty("--zoom-origin", `${bigC.x}px ${bigC.y}px`);
  inside.style.setProperty("--zoom", `translate(${-dx}px, ${-dy}px) scale(${1 / k})`);
}
addEventListener("resize", fitZoom);

function onArrive(index, instant, from) {
  const id = HASHES[index];
  const first = !arrived.has(id);
  arrived.add(id);
  // The machine pulls a shot once. Walking in from the street you already saw it through the open door, so it
  // stays whole; any other way in, it draws itself first (styles.css, PLAN-machine.md).
  if (id === "inside" && first && !reduced) $("#machine").dataset.m = from === 0 ? "whole" : "draw";
  // the first time in, one book tips out a little and back: a cue that the books can be picked (styles.css book-nudge)
  if (id === "inside" && first && !reduced) {
    const book = $("#inside .shelf-book");
    book?.classList.add("nudge");
    book?.addEventListener("animationend", () => book.classList.remove("nudge"), { once: true });
  }
  // The register rings up once: it draws itself, key, crank, flags, drawer, then the receipt rises out of the
  // printer, and the bio card swings on its pin (styles.css).
  if (id === "register" && first && !reduced) {
    $(".till").dataset.till = "ring";
    $(".paper").classList.add("print");
    $(".bio-card").classList.add("swing");
  }
}

const phone = matchMedia("(max-width: 600px)");

// Can the scene's own text still scroll this way? Then that scroll wins and no step happens.
const atEdge = (scene, dir) => (dir > 0 ? scene.scrollTop + scene.clientHeight >= scene.scrollHeight - 2 : scene.scrollTop <= 1);

function step(dir) {
  if (performance.now() < lockUntil) return;
  const to = here + dir;
  if (to < 0 || to > LAST) return bump(dir);
  go(to);
}

// At the first or last scene: a small nudge that says "nothing further this way".
function bump(dir) {
  if (reduced) return;
  SCENES[here].animate([{ translate: "0 0" }, { translate: `0 ${-dir * 12}px` }, { translate: "0 0" }], { duration: 380, easing: "ease-out" });
}

// In a room only one gesture counts: up (or a swipe down) at its very top, which goes back to the counter. A bag card
// open over the room keeps the gesture for itself.
const roomExit = (dir) => dir < 0 && atEdge(current, -1);

// Chrome applies a wheel tick's scroll BEFORE this code sees the tick, so text shorter than one tick reached its edge on
// the very tick that should only scroll it, and stepped too. `rested` = where each box stood at its last scroll event;
// a box that has moved since was scrolled by this tick, so the gesture is spent.
const rested = new WeakMap();
addEventListener("scroll", (e) => { if (e.target instanceof Element) rested.set(e.target, e.target.scrollTop); }, true);
const justScrolled = (box) => box.scrollTop !== (rested.get(box) ?? 0); // a box that never scrolled is at its top
const noStep = (dir) => { const box = current || SCENES[here]; return justScrolled(box) || (current ? !roomExit(dir) : !atEdge(box, dir)); };

// Wheel and trackpad: one gesture = one step, never two. A gesture ends after QUIET_MS without wheel events.
let gesture = null;
let lastWheel = 0;
addEventListener("wheel", (event) => {
  if (event.ctrlKey) return; // ctrl + wheel is pinch zoom
  const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  const dir = Math.sign(dy);
  if (!dir) return;
  const now = performance.now();
  if (!gesture || now - lastWheel > QUIET_MS) {
    // a new gesture. It is spent before it starts if the camera is moving or the text can still scroll this way.
    gesture = { dir, sum: 0, spent: now < lockUntil || noStep(dir) };
  } else if (!gesture.spent && dir !== gesture.dir) {
    // turned around mid-gesture before anything happened: count afresh the new way. A SPENT gesture never
    // turns back into a step, whatever its direction, until the wheel has been quiet (inertia often wobbles).
    gesture = { dir, sum: 0, spent: noStep(dir) };
  }
  lastWheel = now;
  if (gesture.spent) return;
  gesture.sum += dy;
  if (Math.abs(gesture.sum) >= STEP_DELTA) {
    gesture.spent = true;
    if (!current) return step(dir);
    lockUntil = performance.now() + MOVE_MS / 2; // the room fades out; the same flick never walks on as well
    leave();
  }
}, { passive: true });

// Touch: a mostly-vertical swipe of 50px or more. Finger up = walk forward. Sideways swipes are left alone.
let touch = null;
addEventListener("touchstart", (event) => {
  const t = event.touches[0];
  touch = event.touches.length > 1 ? null
    : current ? { x: t.clientX, y: t.clientY, room: true, up: roomExit(-1) }
    : { x: t.clientX, y: t.clientY, down: atEdge(SCENES[here], 1), up: atEdge(SCENES[here], -1) };
}, { passive: true });
addEventListener("touchend", (event) => {
  if (!touch) return;
  const start = touch;
  touch = null;
  const t = event.changedTouches[0];
  const dx = t.clientX - start.x;
  const dy = t.clientY - start.y;
  if (start.room) { if (start.up && current && dy >= 50 && dy > Math.abs(dx)) leave(); return; } // finger down at the top = out
  // inside, a sideways swipe moves the camera: finger right = look left, at the rug and shelf
  if (LOOKS[here] && Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) return lookBy(dx > 0 ? -1 : 1);
  if (Math.abs(dy) < 50 || Math.abs(dy) <= Math.abs(dx)) return;
  const dir = dy < 0 ? 1 : -1;
  if (dir > 0 ? start.down : start.up) step(dir);
}, { passive: true });

// Keys. Never when a control has focus: Space on a button presses the button, nothing else.
const CONTROLS = "a, button, input, select, textarea, summary, [contenteditable]";
addEventListener("keydown", (event) => {
  if (current || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target instanceof Element && event.target.closest(CONTROLS)) return;
  const k = event.key;
  let to;
  if (event.shiftKey) { if (k !== " ") return; to = here - 1; }
  else if (k === "ArrowDown" || k === "PageDown" || k === " ") to = here + 1;
  else if (k === "ArrowUp" || k === "PageUp") to = here - 1;
  else if (k === "Home") to = 0;
  else if (k === "End") to = LAST;
  else if ((k === "ArrowLeft" || k === "ArrowRight") && LOOKS[here]) { event.preventDefault(); return lookBy(k === "ArrowLeft" ? -1 : 1); }
  else return;
  event.preventDefault();
  const dir = Math.sign(to - here);
  const scene = SCENES[here];
  if (k !== "Home" && k !== "End" && dir && !atEdge(scene, dir)) {
    scene.scrollBy({ top: dir * scene.clientHeight * 0.8, behavior: reduced ? "auto" : "smooth" });
    return;
  }
  if (to === here || performance.now() < lockUntil) return;
  if (to < 0 || to > LAST) return bump(dir);
  go(to);
});

// ---------- the address bar ----------
// The address bar is the truth: "#specials" means that room is open, "#inside" that scene.
// sync runs on load (no event), on popstate and on hashchange. Running it twice changes nothing the second time.

function sync(event) {
  const id = location.hash.slice(1);
  if (isRoom(id)) {
    if (current?.id === id) return;
    // A room always sits on its own history entry with the counter right under it, so browser Back
    // lands on the counter, never off the site. A reload keeps the entry, so nothing piles up.
    if (history.state?.room !== id) {
      history.replaceState(null, "", "#bar");
      history.pushState({ room: id }, "", `#${id}`);
    }
    go(COUNTER, { instant: true, effects: false, writeUrl: false });
    return openRoom(id);
  }
  // Closing a room ALWAYS lands on the counter, whatever the entry under it now says: the visitor may have gone
  // Back, walked to another scene (which rewrote that entry), then Forward into the room again.
  const closing = !!current;
  if (closing) closeRoom();
  const i = closing ? COUNTER : Math.max(0, HASHES.indexOf(id));
  go(i, { instant: !event || reduced || closing, writeUrl: closing && id !== HASHES[COUNTER] });
  // Chrome drops focus to <body> during the browser's own Back step, just AFTER popstate has put it on
  // the tab (measured; the cause is inside the browser). The hashchange that ends the step lands here
  // too, so put focus back on the tab once, if nothing else took it.
  if (focusBack && event?.type === "hashchange") {
    if (document.activeElement === document.body && !focusBack.closest("[inert]")) focusBack.focus({ preventScroll: true });
    focusBack = null;
  }
}

function leave() {
  if (history.state?.room) return history.back(); // fires popstate, which closes the room
  history.replaceState(null, "", "#bar"); // safety net: a room with no entry of its own
  closeRoom();
}

// A tab on the board, or in the row on top of a room, steps into that room. From the counter the room gets its own
// history entry (Back = the counter); room to room replaces it, so Back still lands on the counter.
const stepIn = (id) => (event) => {
  event.preventDefault();
  if (current?.id === id) return;
  if (current) history.replaceState({ room: id }, "", `#${id}`);
  else history.pushState({ room: id }, "", `#${id}`);
  burstFrom(event.currentTarget, ROOM_LIGHT[id]); // the light tunnel, out of the tab you clicked
  openRoom(id, true);
};
for (const id of STOPS) $(`.stop[data-stop="${id}"]`).addEventListener("click", stepIn(id));
for (const a of roomTabs.querySelectorAll("a")) a.addEventListener("click", stepIn(a.getAttribute("href").slice(1)));
for (const back of document.querySelectorAll(".back")) back.addEventListener("click", leave);
// "Ethan Yap" (Ethan 2026-11-20): in a room = Back to the bar; on the street = nothing; anywhere else = its href, the street
$(".top-name").addEventListener("click", (e) => {
  if (current) { e.preventDefault(); leave(); }
  else if (here === 0) e.preventDefault();
});
addEventListener("keydown", (event) => { if (event.key === "Escape" && current) leave(); });
addEventListener("popstate", sync);
addEventListener("hashchange", sync);

// Last: put the stage (and any room) where the address bar says.
sync();

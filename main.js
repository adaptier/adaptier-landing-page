// Destination of every "Book a demo" button. /demo forwards to the Microsoft Bookings page
// (demo/index.html holds that URL). While empty, the buttons stay hidden (they ship `hidden`).
const DEMO_URL = "/demo";

function applyDemo(url) {
  if (!url) return;
  for (const el of document.querySelectorAll('[data-demo]')) {
    el.hidden = false;
    if (el.tagName !== 'A') continue;
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
}

// Pillar 5: cut / restore the internet link in the distributed diagram.
function initWanToggle() {
  const btn = document.getElementById('wan-toggle');
  const diagram = document.getElementById('distributed-diagram');
  if (!btn || !diagram) return;
  const wrap = document.getElementById('distributed-scroll');
  // Centre the sideways-scrolling wrapper (instant, no motion); no-op when nothing overflows.
  const centre = () => { if (wrap) wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) / 2; };
  centre();
  // Re-centre only when the width changes: a mobile URL bar showing/hiding fires resize too.
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) { lastWidth = window.innerWidth; centre(); }
  });
  btn.addEventListener('click', () => {
    const down = diagram.dataset.wan !== 'down';
    diagram.dataset.wan = down ? 'down' : 'up';
    btn.setAttribute('aria-pressed', String(down));
    btn.textContent = down ? 'Restore internet' : 'Cut the internet';
    centre();
  });
}

applyDemo(DEMO_URL);
initWanToggle();

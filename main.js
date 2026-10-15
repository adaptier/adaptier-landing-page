// Demo / contact destination for every "Book a demo" button: a mailto: or https URL.
// While empty, the buttons stay hidden (they ship with the `hidden` attribute).
const DEMO_URL = "";

function applyDemo(url) {
  if (!url) return;
  for (const el of document.querySelectorAll('[data-demo]')) {
    el.hidden = false;
    if (el.tagName === 'A') el.href = url;
  }
}

// Pillar 5: cut / restore the internet link in the distributed diagram.
function initWanToggle() {
  const btn = document.getElementById('wan-toggle');
  const diagram = document.getElementById('distributed-diagram');
  if (!btn || !diagram) return;
  btn.addEventListener('click', () => {
    const down = diagram.dataset.wan !== 'down';
    diagram.dataset.wan = down ? 'down' : 'up';
    btn.setAttribute('aria-pressed', String(down));
    btn.textContent = down ? 'Restore internet' : 'Cut the internet';
  });
}

applyDemo(DEMO_URL);
initWanToggle();

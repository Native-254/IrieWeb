// ============================================================
// IRIE — interaction layer
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Terminal boot sequence ---------- */
  const bootLines = [
    '> IRIE_TRADE v1.0',
    '> connecting to IBKR paper gateway :4002 ...',
    '> gateway connected — account DU•••••6',
    '> loading strategies: TREND_FOLLOWING_LS, MEAN_REVERSION',
    '> risk engine: max_heat=30% gross_exp=safe daily_loss=-5%',
    '> earnings blackout filter: ARMED',
    '> position sync: 0 open, 0 pending',
    '> status: PAPER_TRADING — awaiting next iteration (:01)'
  ];
  const terminalEl = document.getElementById('terminalBody');

  function typeTerminal(){
    if(!terminalEl) return;
    let lineIndex = 0, charIndex = 0;
    terminalEl.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function step(){
      if(lineIndex >= bootLines.length){
        terminalEl.appendChild(cursor);
        return;
      }
      const line = bootLines[lineIndex];
      terminalEl.textContent = bootLines.slice(0, lineIndex).join('\n') +
        (lineIndex > 0 ? '\n' : '') + line.slice(0, charIndex);
      terminalEl.appendChild(cursor);

      if(charIndex < line.length){
        charIndex++;
        setTimeout(step, 14 + Math.random() * 22);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(step, 260);
      }
    }
    step();
  }

  // run once when hero scrolls into view (or immediately if reduced motion)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced && terminalEl){
    terminalEl.textContent = bootLines.join('\n');
  } else {
    typeTerminal();
  }

  /* ---------- Ticker tape ---------- */
  const tickerData = [
    { label: 'AAPL', val: '+0.42%', dir: 'up' },
    { label: 'MSFT', val: '-0.11%', dir: 'down' },
    { label: 'PORTFOLIO HEAT', val: '18.4% / 30%', dir: '' },
    { label: 'GROSS EXPOSURE', val: '1.6x', dir: '' },
    { label: 'NVDA', val: '+1.05%', dir: 'up' },
    { label: 'DAILY P&L', val: '+0.63%', dir: 'up' },
    { label: 'TSLA', val: '-0.28%', dir: 'down' },
    { label: 'OPEN POSITIONS', val: '7', dir: '' },
    { label: 'DRAWDOWN', val: '2.1% from peak', dir: '' },
    { label: 'JPM', val: '+0.19%', dir: 'up' }
  ];
  const track = document.getElementById('tickerTrack');
  if(track){
    const buildSet = () => tickerData.map(t =>
      `<span class="${t.dir}">${t.label} <b>${t.val}</b></span>`
    ).join('');
    track.innerHTML = buildSet() + buildSet(); // duplicate for seamless loop
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navLinks.style.display = open ? 'flex' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navLinks.style.display = '';
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-copy, .section-visual, .strategy-card, .risk-card, .alert-channel'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if('IntersectionObserver' in window && !prefersReduced){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

});

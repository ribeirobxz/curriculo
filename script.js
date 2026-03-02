const ParticleBackground = (() => {
  const CONFIG = {
    count: 70,
    maxDist: 140,
    maxDistSq: 140 * 140,
    speed: 0.5,
    minRadius: 1,
    maxRadius: 2.5,
    particleColor: 'rgba(0, 220, 180, 0.7)',
    lineColor: [0, 200, 160],
    lineAlphaMultiplier: 0.35,
    lineWidth: 0.7,
  };

  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let rafId = null;
  let resizeTimer = null;

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
    };
  }

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.particleColor;
    ctx.fill();
  }

  function drawConnections(p, index) {
    for (let j = index + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < CONFIG.maxDistSq) {
        const alpha = (1 - Math.sqrt(distSq) / CONFIG.maxDist) * CONFIG.lineAlphaMultiplier;
        const [r, g, b] = CONFIG.lineColor;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = CONFIG.lineWidth;
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
      drawParticle(particles[i]);
      drawConnections(particles[i], i);
    }

    rafId = requestAnimationFrame(loop);
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(rafId);
      init();
      loop();
    }, 150);
  }

  function start() {
    init();
    loop();
    window.addEventListener('resize', onResize);
  }

  return { start };
})();

ParticleBackground.start();

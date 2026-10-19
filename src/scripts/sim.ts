/**
 * Lightweight re-creation of the Projectile Movement project: a ball thrown
 * with random direction/speed, pulled by real gravity, losing 10% of its
 * horizontal speed on each wall hit. Pauses off-screen; a single static
 * trajectory is drawn under reduced motion.
 */
const SCALE = 24; // px per metre
const GRAVITY = 9.81;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function initProjectileSim(): void {
  const canvas = document.getElementById("sim") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  let width = 0;
  let height = 0;
  let ball: Ball = { x: 0, y: 0, vx: 0, vy: 0 };
  let trail: [number, number][] = [];
  let last = 0;
  let running = false;
  let pause = 0;

  function css(name: string): string {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function size(): void {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas!.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas!.width = width * dpr;
    canvas!.height = height * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function throwBall(): void {
    const angle = ((20 + Math.random() * 50) * Math.PI) / 180;
    const speed = 7 + Math.random() * 7;
    const dir = Math.random() < 0.5 ? 1 : -1;
    ball = {
      x: dir > 0 ? width * 0.12 : width * 0.88,
      y: height - 12,
      vx: dir * speed * Math.cos(angle) * SCALE,
      vy: -speed * Math.sin(angle) * SCALE,
    };
    trail = [];
  }

  function step(dt: number): boolean {
    ball.vy += GRAVITY * SCALE * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x < 8) {
      ball.x = 8;
      ball.vx = -ball.vx * 0.9;
    }
    if (ball.x > width - 8) {
      ball.x = width - 8;
      ball.vx = -ball.vx * 0.9;
    }

    trail.push([ball.x, ball.y]);
    if (trail.length > 240) trail.shift();

    if (ball.y > height - 6 && ball.vy > 0) {
      ball.y = height - 6;
      return false;
    }
    return true;
  }

  function draw(): void {
    ctx!.clearRect(0, 0, width, height);
    ctx!.strokeStyle = css("--rule");
    ctx!.lineWidth = 1;
    for (let i = 1; i < 12; i++) {
      const x = Math.round((width * i) / 12) + 0.5;
      ctx!.beginPath();
      ctx!.moveTo(x, 0);
      ctx!.lineTo(x, height);
      ctx!.stroke();
    }

    ctx!.beginPath();
    ctx!.moveTo(0, height - 0.5);
    ctx!.lineTo(width, height - 0.5);
    ctx!.strokeStyle = css("--ink");
    ctx!.stroke();

    if (trail.length > 1) {
      ctx!.beginPath();
      ctx!.moveTo(trail[0][0], trail[0][1]);
      for (let j = 1; j < trail.length; j++) ctx!.lineTo(trail[j][0], trail[j][1]);
      ctx!.strokeStyle = css("--signal");
      ctx!.setLineDash([3, 4]);
      ctx!.stroke();
      ctx!.setLineDash([]);
    }

    ctx!.beginPath();
    ctx!.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
    ctx!.fillStyle = css("--ink");
    ctx!.fill();
  }

  function loop(t: number): void {
    if (!running) return;
    const dt = Math.min(0.033, (t - last) / 1000 || 0);
    last = t;
    if (pause > 0) {
      pause -= dt;
      if (pause <= 0) throwBall();
    } else if (!step(dt)) {
      pause = 0.9;
    }
    draw();
    requestAnimationFrame(loop);
  }

  function staticFrame(): void {
    throwBall();
    for (let i = 0; i < 600; i++) {
      if (!step(1 / 60)) break;
    }
    draw();
  }

  size();

  if (reduce) {
    staticFrame();
    window.addEventListener("resize", () => {
      size();
      staticFrame();
    });
    return;
  }

  throwBall();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      if (visible && !running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(loop);
      } else if (!visible) {
        running = false;
      }
    });
    observer.observe(canvas);
  }

  window.addEventListener("resize", () => {
    size();
    throwBall();
  });

  staticFrame();
}

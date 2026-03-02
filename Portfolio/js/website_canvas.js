// Updated Space Background – slower/smaller supernovas, smaller & slower-twinkling stars
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const stars = [];
    const layers = [
        { count: 420, min: 0.2, max: 0.6, baseOp: 0.40 },
        { count: 280, min: 0.5, max: 1.0, baseOp: 0.70 },
        { count: 140, min: 0.9, max: 1.8, baseOp: 0.95 }
    ];

    layers.forEach((layer, depth) => {
        for (let i = 0; i < layer.count; i++) {
            stars.push({
                x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
                y: Math.random() * canvas.height * 1.5 - canvas.height * 0.25,
                size: layer.min + Math.random() * (layer.max - layer.min),
                baseOpacity: layer.baseOp,
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 1.2,
                depth
            });
        }
    });

    const shooters = [];
    class Shooter {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width * 1.3 - 100;
            this.y = -50 - Math.random() * 200;
            this.len = 160 + Math.random() * 260;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 1.1;
            this.speed = 11 + Math.random() * 15;
            this.life = 1;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= 0.024;
        }
        draw() {
            if (this.life <= 0) return;
            const op = this.life;
            const tx = this.x - Math.cos(this.angle) * this.len;
            const ty = this.y - Math.sin(this.angle) * this.len;

            const g = ctx.createLinearGradient(this.x, this.y, tx, ty);
            g.addColorStop(0, `rgba(255,255,245,${op})`);
            g.addColorStop(0.3, `rgba(200,230,255,${op * 0.8})`);
            g.addColorStop(1, 'rgba(90,150,255,0)');

            ctx.strokeStyle = g;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();

            ctx.fillStyle = `rgba(255,255,230,${op})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Planets (unchanged from last good version)
    const planets = [
        { bx: 0.20, by: 0.24, r: 44, col: '#4c9aff', orbit: 0.0024, spin: 0.0095, ring: true },
        { bx: 0.70, by: 0.50, r: 58, col: '#7c3aed', orbit: 0.0013, spin: 0.0048, ring: false },
        { bx: 0.38, by: 0.80, r: 32, col: '#facc15', orbit: 0.0038, spin: 0.016, ring: false }
    ].map(p => ({
        ...p,
        rot: 0,
        craters: Array(10 + Math.floor(Math.random() * 10)).fill().map(() => ({
            ang: Math.random() * Math.PI * 2,
            dist: 0.28 + Math.random() * 0.58,
            size: 2.5 + Math.random() * 8,
            depth: Math.random() * 0.6 + 0.2
        }))
    }));

    function animate() {
        time += 0.016;

        ctx.fillStyle = '#00050f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Faint nebula
        ctx.fillStyle = 'rgba(30,10,80,0.08)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.55, canvas.height * 0.42, 900, 0, Math.PI * 2);
        ctx.fill();

        // Stars – slower & more subtle twinkle
        stars.forEach(s => {
            const parallax = s.depth * 0.4;
            const sx = s.x + Math.sin(time * 0.03) * 30 * parallax;
            const sy = s.y + Math.cos(time * 0.035) * 20 * parallax;

            const twinkle = Math.sin(time * s.speed + s.phase);
            s.opacity = s.baseOpacity * (0.35 + twinkle * 0.65); // smoother, less extreme

            ctx.globalAlpha = s.opacity;
            ctx.fillStyle = twinkle > 0.3 ? '#f8faff' : '#e8f0ff';
            ctx.beginPath();
            ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
            ctx.fill();

            // Smaller halo when bright
            if (twinkle > 0.2) {
                ctx.globalAlpha = s.opacity * 0.25;
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(sx, sy, s.size * 2.8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        });

        // Shooting stars
        if (Math.random() < 0.016) shooters.push(new Shooter());

        for (let i = shooters.length - 1; i >= 0; i--) {
            const s = shooters[i];
            s.update();
            s.draw();
            if (s.life <= 0) shooters.splice(i, 1);
        }

        // Planets
        planets.forEach(p => {
            p.rot += p.spin;

            const ox = time * p.orbit;
            const px = canvas.width * p.bx + Math.sin(ox) * 110;
            const py = canvas.height * p.by + Math.cos(ox * 1.3) * 55;

            const glow = ctx.createRadialGradient(px, py, p.r * 0.85, px, py, p.r * 3.2);
            glow.addColorStop(0, p.col + '70');
            glow.addColorStop(0.5, p.col + '30');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(px - p.r * 4, py - p.r * 4, p.r * 8, p.r * 8);

            ctx.fillStyle = p.col;
            ctx.beginPath();
            ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.arc(px - p.r * 0.38, py - p.r * 0.28, p.r * 0.92, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            ctx.beginPath();
            ctx.arc(px - p.r * 0.5, py - p.r * 0.45, p.r * 0.35, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(0,0,0,0.72)';
            p.craters.forEach(c => {
                const ang = p.rot + c.ang;
                const cx = px + Math.cos(ang) * p.r * c.dist;
                const cy = py + Math.sin(ang) * p.r * c.dist;
                ctx.beginPath();
                ctx.arc(cx, cy, c.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(cx, cy, c.size * 0.9, 0, Math.PI * 2);
                ctx.stroke();
            });

            if (p.ring) {
                ctx.strokeStyle = 'rgba(230,230,255,0.45)';
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.ellipse(px + 20, py, p.r * 2.3, p.r * 0.48, p.rot * 0.18, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});
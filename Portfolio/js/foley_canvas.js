// Realistic Fireworks Background – darker gradient + cinematic feel
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const fireworks = [];
    const particles = [];

    // Dark gradient background (very dark navy → black)
    function drawBackground() {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0a0e1a');
        grad.addColorStop(0.5, '#0f1421');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.35) + 40;
            this.speed = Math.random() * 3 + 5;
            this.color = `hsl(${Math.random() * 360}, 90%, ${60 + Math.random() * 20}%)`;
            this.exploded = false;
            this.trail = [];
            this.trailLength = 30 + Math.random() * 20;
        }

        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                this.trail.push({ x: this.x, y: this.y, opacity: 1, size: 3 + Math.random() * 2 });
                if (this.trail.length > this.trailLength) this.trail.shift();

                if (this.y <= this.targetY) {
                    this.explode();
                }
            }
        }

        draw() {
            if (!this.exploded) {
                // Realistic trail with fade
                this.trail.forEach((t, i) => {
                    ctx.globalAlpha = t.opacity * (i / this.trail.length) * 0.8;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.globalAlpha = 1;

                // Rocket head with glow
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
                glow.addColorStop(0, 'white');
                glow.addColorStop(0.5, this.color);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        explode() {
            this.exploded = true;
            const particleCount = Math.random() * 60 + 80;
            const burstAngleStep = Math.PI * 2 / particleCount;

            for (let i = 0; i < particleCount; i++) {
                const angle = i * burstAngleStep + Math.random() * 0.3;
                const speed = Math.random() * 6 + 3;
                particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: this.color,
                    life: 1,
                    gravity: 0.06 + Math.random() * 0.04,
                    fade: 0.008 + Math.random() * 0.012,
                    secondary: Math.random() < 0.3 // some particles have secondary burst
                });
            }
        }
    }

    function createFirework() {
        if (Math.random() < 0.03) { // slower, more majestic bursts (~every 2–4 seconds)
            fireworks.push(new Firework());
        }
    }

    function animate() {
        drawBackground(); // dark gradient every frame

        createFirework();

        fireworks.forEach((fw, i) => {
            fw.update();
            fw.draw();
            if (fw.exploded && fw.trail.length === 0) fireworks.splice(i, 1);
        });

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= p.fade;
            p.opacity = p.life;

            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5 + Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Secondary burst on some particles
            if (p.secondary && p.life < 0.4 && Math.random() < 0.1) {
                const subCount = Math.random() * 8 + 6;
                for (let j = 0; j < subCount; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const subSpeed = Math.random() * 3 + 1;
                    particles.push({
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(angle) * subSpeed,
                        vy: Math.sin(angle) * subSpeed,
                        color: p.color,
                        life: 0.5,
                        gravity: 0.05,
                        fade: 0.025,
                        secondary: false
                    });
                }
            }

            ctx.globalAlpha = 1;

            if (p.life <= 0) particles.splice(i, 1);
        });

        requestAnimationFrame(animate);
    }

    animate();
});
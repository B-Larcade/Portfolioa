
document.addEventListener('DOMContentLoaded', () => {
    const createSideAnimation = (canvasId) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 60;
        canvas.height = window.innerHeight;

        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.05;

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(20 + i * 15, 0);
                for (let y = 0; y < canvas.height; y += 10) {
                    const offset = Math.sin(time + y * 0.01 + i) * 5;
                    ctx.lineTo(20 + i * 15 + offset, y);
                }
                ctx.strokeStyle = 'rgba(6, 66, 116, 0.72)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();

        // Resize on window change
        window.addEventListener('resize', () => {
            canvas.height = window.innerHeight;
        });
    };

    createSideAnimation('side-animation-left');
    createSideAnimation('side-animation-right');
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bubble-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Resize canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bubble class
    class Bubble {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.radius = Math.random() * 8 + 4;
            this.speed = Math.random() * 1.2 + 0.5;
            this.wobble = Math.random() * 0.02 + 0.01;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.life = 1;
            this.popping = false;
        }

        update() {
            this.y -= this.speed;
            this.x += Math.sin(Date.now() * this.wobble + this.x) * 0.8;

            if (this.y < canvas.height * 0.3 || Math.random() < 0.005) {
                this.popping = true;
            }

            if (this.popping) {
                this.life -= 0.02;
                this.opacity *= 0.95;
                this.radius *= 1.02;
            }

            if (this.y < -this.radius * 2 || this.life <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(
                this.x - this.radius * 0.4,
                this.y - this.radius * 0.4,
                this.radius * 0.1,
                this.x,
                this.y,
                this.radius
            );
            gradient.addColorStop(0, `rgba(96, 165, 250, ${this.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(147, 197, 253, ${this.opacity * 0.3})`);

            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.strokeStyle = `rgba(147, 197, 253, ${this.opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    const bubbles = [];
    for (let i = 0; i < 80; i++) {
        bubbles.push(new Bubble());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bubbles.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});

document.addEventListener('DOMContentLoaded', () => {
    const oceanCanvas = document.getElementById('ocean-canvas');
    if (!oceanCanvas) return;

    const ctx = oceanCanvas.getContext('2d');

    function resizeOcean() {
        oceanCanvas.width = window.innerWidth;
        oceanCanvas.height = window.innerHeight;
    }
    resizeOcean();
    window.addEventListener('resize', resizeOcean);

    let time = 0;

    const fishes = [];
    function spawnFish() {
        if (Math.random() < 0.02) {
            fishes.push({
                x: -50,
                y: 100 + Math.random() * (oceanCanvas.height - 200),
                speed: 0.4 + Math.random() * 0.6,
                size: 8 + Math.random() * 6,
                opacity: 0.2 + Math.random() * 0.15,
                tailPhase: Math.random() * Math.PI * 2
            });
        }
    }

    function animateOcean() {
        time += 0.008;

        ctx.clearRect(0, 0, oceanCanvas.width, oceanCanvas.height);

        const gradient = ctx.createLinearGradient(0, 0, 0, oceanCanvas.height);
        gradient.addColorStop(0, 'rgba(20, 60, 120, 0.08)');
        gradient.addColorStop(0.5, 'rgba(40, 100, 180, 0.12)');
        gradient.addColorStop(1, 'rgba(10, 40, 90, 0.05)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, oceanCanvas.width, oceanCanvas.height);

        ctx.strokeStyle = 'rgba(96, 165, 250, 0.08)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            const offset = Math.sin(time * 0.6 + i * 1.2) * 40;
            ctx.moveTo(0, 100 + i * 120 + offset);
            ctx.quadraticCurveTo(
                oceanCanvas.width / 2,
                150 + i * 120 + Math.cos(time * 0.8 + i) * 60,
                oceanCanvas.width,
                100 + i * 120 + offset * -1
            );
            ctx.stroke();
        }

        spawnFish();

        fishes.forEach((fish, index) => {
            fish.x += fish.speed;
            const tailWag = Math.sin(time * 8 + fish.tailPhase) * 3;

            ctx.save();
            ctx.translate(fish.x, fish.y);
            ctx.rotate(tailWag * 0.05);

            ctx.beginPath();
            ctx.ellipse(0, 0, fish.size, fish.size / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(147, 197, 253, ${fish.opacity})`;
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(-fish.size / 2, 0);
            ctx.lineTo(-fish.size - tailWag, tailWag);
            ctx.lineTo(-fish.size - tailWag * 0.5, -tailWag);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

            if (fish.x > oceanCanvas.width + 50) {
                fishes.splice(index, 1);
            }
        });

        requestAnimationFrame(animateOcean);
    }

    animateOcean();
});
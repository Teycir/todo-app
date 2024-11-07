window.addEventListener('load', function(){
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    class Particle {
        constructor(effect, x, y, color){
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = Math.random() * this.effect.canvasHeight;
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = 2;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.005;
        }
        draw(){
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
        update(){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(context, canvasWidth, canvasHeight){
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.particles = [];
            this.gap = 20;
            this.mouse = {
                radius: 20000,
                x: 0,
                y: 0
            }
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
            this.createParticles();
        }
        createParticles(){
            this.particles = [];
            const rows = Math.floor(this.canvasHeight / this.gap) + 1;
            const cols = Math.floor(this.canvasWidth / this.gap) + 1;
            for(let y = 0; y < rows; y++){
                for(let x = 0; x < cols; x++){
                    const px = x * this.gap;
                    const py = y * this.gap;
                    const color = 'rgba(255, 255, 255, 0.3)';
                    this.particles.push(new Particle(this, px, py, color));
                }
            }
        }
        render(){
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
        resize(width, height){
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.createParticles();
        }
    }

    const effect = new Effect(ctx, canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function(){
        resizeCanvas();
        effect.resize(canvas.width, canvas.height);
    });
});

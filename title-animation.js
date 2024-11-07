class Particle {
    constructor(effect, x, y, color){
        this.effect = effect;
        this.x = x;
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
        this.friction = 0.98;
        this.ease = 0.2;
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
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2;
        this.fontSize = this.canvasHeight * 0.5;
        this.lineHeight = this.fontSize;
        this.maxTextWidth = this.canvasWidth * 0.8;
        this.particles = [];
        this.gap = 2;
        this.mouse = {
            radius: 3000,
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (e) => {
            const rect = this.context.canvas.getBoundingClientRect();
            this.mouse.x = e.x - rect.left;
            this.mouse.y = e.y - rect.top;
        });
    }
    wrapText(text){
        const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, 0);
        gradient.addColorStop('0.2', '#ffffff');
        gradient.addColorStop('0.5', '#ffffff');
        gradient.addColorStop('0.8', '#ffffff');
        
        this.context.fillStyle = gradient;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.font = this.fontSize + 'px Arial';
        
        this.context.fillText(text, this.textX, this.textY);
        this.convertToParticles();
    }
    convertToParticles(){
        this.particles = [];
        const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let y = 0; y < this.canvasHeight; y += this.gap){
            for (let x = 0; x < this.canvasWidth; x += this.gap){
                const index = (y * this.canvasWidth + x) * 4;
                const alpha = pixels[index + 3];
                if (alpha > 0){
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = `rgba(${red}, ${green}, ${blue}, 0.9)`;
                    this.particles.push(new Particle(this, x, y, color));
                }
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
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2;
        this.fontSize = this.canvasHeight * 0.5;
    }
}

window.addEventListener('load', function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'titleCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '2';
    
    // Add canvas to title section
    const titleSection = document.querySelector('.title-section');
    titleSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();

    const effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText('Todo App');

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function(){
        resizeCanvas();
        effect.resize(canvas.width, canvas.height);
        effect.wrapText('Todo App');
    });
});

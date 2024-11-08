class Particle {
    constructor(effect, x, y, color){
        this.effect = effect;
        this.x = x;
        this.y = Math.random() * this.effect.canvasHeight + this.effect.canvasHeight;
        this.color = color;
        this.originX = x;
        this.originY = y;
        this.size = 5;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.friction = 0.9;
        this.ease = 0.2;
    }
    draw(){
        this.effect.context.save();
        this.effect.context.fillStyle = this.color;
        this.effect.context.strokeStyle = this.color;
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        this.effect.context.restore();
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
        this.fontSize = 100;
        this.lineHeight = this.fontSize * 0.9;
        this.maxTextWidth = this.canvasWidth * 0.7;
        this.verticalOffset = 0;
        
        // particle text
        this.particles = [];
        this.gap = 3;
        this.mouse = {
            radius: 20000,
            x: 0,
            y: 0
        }
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.x - rect.left;
            this.mouse.y = e.y - rect.top;
        });
        this.gradient;         
    }
    wrapText(text){
        this.gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, 0);
        this.gradient.addColorStop('0.2', 'red');
        this.gradient.addColorStop('0.3', '#ff8000');
        this.gradient.addColorStop('0.4', '#ffff00');
        this.gradient.addColorStop('0.5', '#007940');
        this.gradient.addColorStop('0.7', '#4040ff');
        this.gradient.addColorStop('0.9', '#a000c0');
        // canvas settings
        this.context.fillStyle = this.gradient;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.lineWidth = 1;
        this.context.strokeStyle = this.gradient;
        this.context.font = this.fontSize + 'px Bangers';
        
        // draw text
        this.context.fillText(text, this.textX, this.textY);
        this.convertToParticles();
    }
    convertToParticles(){
        this.particles = [];
        const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let y = 0; y < this.canvasHeight; y += this.gap){
            for (let x = 0; x < this.canvasWidth; x+= this.gap){
                const index = (y * this.canvasWidth + x) * 4;
                const alpha = pixels[index + 3];
                if (alpha > 0){
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.particles.push(new Particle(this, x, y, color));
                }
            }
        }
    }
    constellations(){
        for(let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dy, dx);
                const connectDistance = this.gap * 2.5;
                if (distance < connectDistance){
                    const opacity = 1 - (distance/connectDistance);
                    const position = this.particles[a].size / 2;
                    this.context.beginPath();
                    this.context.moveTo(this.particles[a].x + position, this.particles[a].y + position);
                    this.context.lineTo(this.particles[b].x + position, this.particles[b].y + position);
                    this.context.save();
                    this.context.globalAlpha = opacity;
                    this.context.strokeStyle = this.particles[a].color;
                    this.context.stroke();
                    this.context.restore();
                }
            }
        }
    }
    render(){
        this.particles.forEach(particle => {
            particle.draw();
            particle.update();
        });
        this.constellations();
    }
    resize(width, height){
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2;
        this.maxTextWidth = this.canvasWidth * 0.8;
    }
}

// Initialize animation
function initTitleAnimation() {
    const canvas = document.getElementById('titleCanvas');
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
}

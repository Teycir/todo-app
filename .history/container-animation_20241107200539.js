class Shape {
    constructor(effect, type) {
        this.effect = effect;
        this.type = type;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.size = Math.random() * 30 + 10;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.angle = 0;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.hue = Math.random() * 60 + 240; // Blue to purple range
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.rotationSpeed;

        if (this.x < 0 || this.x > this.effect.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.effect.height) this.speedY *= -1;
    }

    draw() {
        this.effect.ctx.save();
        this.effect.ctx.translate(this.x, this.y);
        this.effect.ctx.rotate(this.angle);
        this.effect.ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${this.opacity})`;

        switch(this.type) {
            case 'triangle':
                this.drawTriangle();
                break;
            case 'rectangle':
                this.drawRectangle();
                break;
            case 'circle':
                this.drawCircle();
                break;
        }

        this.effect.ctx.restore();
    }

    drawTriangle() {
        this.effect.ctx.beginPath();
        this.effect.ctx.moveTo(-this.size/2, this.size/2);
        this.effect.ctx.lineTo(this.size/2, this.size/2);
        this.effect.ctx.lineTo(0, -this.size/2);
        this.effect.ctx.closePath();
        this.effect.ctx.fill();
    }

    drawRectangle() {
        this.effect.ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    }

    drawCircle() {
        this.effect.ctx.beginPath();
        this.effect.ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        this.effect.ctx.fill();
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.shapes = [];
        this.initShapes();
    }

    initShapes() {
        const types = ['triangle', 'rectangle', 'circle'];
        for (let i = 0; i < 15; i++) {
            this.shapes.push(new Shape(this, types[Math.floor(Math.random() * types.length)]));
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

window.addEventListener('load', function() {
    const container = document.querySelector('.container');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    container.style.position = 'relative';
    container.insertBefore(canvas, container.firstChild);

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();

    const effect = new Effect(canvas);

    function animate() {
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function() {
        resizeCanvas();
        effect.resize(canvas.width, canvas.height);
    });
});

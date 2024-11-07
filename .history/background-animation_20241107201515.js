class BackgroundShape {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 50 + 30; // Larger shapes for background
        this.speedX = (Math.random() - 0.5) * 1; // Slower movement
        this.speedY = (Math.random() - 0.5) * 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01; // Slower rotation
        this.opacity = Math.random() * 0.15 + 0.05; // More subtle opacity
        this.type = Math.floor(Math.random() * 3); // 0: triangle, 1: square, 2: circle
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#1a2a6c', '#b21f1f', '#fdbb2d'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around screen instead of resetting
        if (this.x < -this.size) this.x = this.canvas.width + this.size;
        if (this.x > this.canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = this.canvas.height + this.size;
        if (this.y > this.canvas.height + this.size) this.y = -this.size;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = this.color;

        switch (this.type) {
            case 0: // Triangle
                this.drawTriangle();
                break;
            case 1: // Square
                this.drawSquare();
                break;
            case 2: // Circle
                this.drawCircle();
                break;
        }

        this.ctx.restore();
    }

    drawTriangle() {
        this.ctx.beginPath();
        this.ctx.moveTo(-this.size/2, this.size/2);
        this.ctx.lineTo(this.size/2, this.size/2);
        this.ctx.lineTo(0, -this.size/2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawSquare() {
        this.ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    }

    drawCircle() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

window.addEventListener('load', function() {
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    const shapes = [];
    const numShapes = 25; // More shapes for background

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Create shapes
    for (let i = 0; i < numShapes; i++) {
        shapes.push(new BackgroundShape(canvas, ctx));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a2a6c');
        gradient.addColorStop(0.5, '#b21f1f');
        gradient.addColorStop(1, '#fdbb2d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        // Redistribute shapes across new canvas size
        shapes.forEach(shape => shape.reset());
    });
});

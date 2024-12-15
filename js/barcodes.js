class Barcode {
  constructor(x, y, width, height, stripeCount, updateRate) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.stripeCount = stripeCount;
    this.updateRate = updateRate;
    this.stripes = [];
    this.buffer = createFramebuffer();
    
    // Initialize stripes
    for (let i = 0; i < this.stripeCount; i++) {
      this.stripes.push(random() > 0.5 ? 0 : 255);
    }
  }

  update() {
    if (frameCount % this.updateRate === 0) {
      for (let i = 0; i < this.stripeCount; i++) {
        if (random() < 0.3) {
          this.stripes[i] = this.stripes[i] === 0 ? 255 : 0;
        }
      }
    }
  }

  draw() {
    this.buffer.begin();
    clear();
    noStroke();
    
    let stripeWidth = this.width / this.stripeCount;
    for (let i = 0; i < this.stripeCount; i++) {
      fill(this.stripes[i]);
      rect(i * stripeWidth - this.width/2, -this.height/2, stripeWidth, this.height);
    }
    
    this.buffer.end();
    image(this.buffer, this.x, this.y, this.width, this.height);
  }
}

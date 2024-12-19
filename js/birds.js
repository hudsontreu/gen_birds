class Bird {
    constructor(x, y, options = {}) {
      // Position
      this.x = x;
      this.y = y;
      this.initialY = y;
      this.initialX = x;
  
      // Configuration options
      this.lineCount = options.lineCount || 2;  // 2 or 4 lines
      this.lineLength = options.lineLength || 50;  // Length of each line
      this.angle = options.angle || PI/4;  // Single angle for the entire bird
      this.strokeWeight = options.strokeWeight || 2;  // Line thickness
      this.color = options.color || color(255);  // Default white
      this.growRate = options.growRate || 10;

      // Lifespan parameters
      this.age = 0;
      this.lifespan = random(200, 400); // Random lifespan between 200-400 frames
      this.fadeStart = this.lifespan * 0.7; // Start fading at 70% of lifespan
    }
  
    draw() {
      push();
      // Calculate opacity based on age
      let opacity = 255;
      if (this.age > this.fadeStart) {
        opacity = map(this.age, this.fadeStart, this.lifespan, 255, 0);
      }
      
      // Apply opacity to color
      let c = color(red(this.color), green(this.color), blue(this.color), opacity);
      stroke(c);
      
      translate(this.x, this.y);
      strokeWeight(this.strokeWeight);
      noFill();
  
      if (this.lineCount === 2) {
        // Two lines in a V shape
        this._drawTwoLines();
      } else {
        // Four lines in an inverted W shape
        this._drawFourLines();
      }
  
      // Increment age
      this.age++;
      
      pop();
    }
  
    _drawTwoLines() {
      // Vertex point (bottom center)
      let vertexX = 0;
      let vertexY = this.lineLength/2;
  
      // Calculate angle-based spread
      let spreadFactor = this.lineLength * tan(this.angle/2);
  
      // First line (left side)
      line(
        vertexX - spreadFactor, 
        vertexY, 
        vertexX, 
        -this.lineLength/2
      );
  
      // Second line (right side)
      line(
        vertexX + spreadFactor, 
        vertexY, 
        vertexX, 
        -this.lineLength/2
      );
    }
  
    _drawFourLines() {
      // Calculate spread factors based on angle
      let spreadFactor = this.lineLength * tan(this.angle/2);

      // Center point
      let centerX = 0;
      let centerY = 0;

      // Calculate endpoints for top V
      let leftTopX = centerX - spreadFactor;
      let rightTopX = centerX + spreadFactor;
      let topY = -this.lineLength/2;

      // Calculate endpoints for bottom lines using the same angle
      let leftBottomX = leftTopX - spreadFactor;  // Additional spread for bottom point
      let rightBottomX = rightTopX + spreadFactor;  // Additional spread for bottom point
      let bottomY = this.lineLength/2;

      // Draw top V
      line(leftTopX, topY, centerX, centerY);
      line(rightTopX, topY, centerX, centerY);

      // Draw angled bottom lines
      line(leftTopX, topY, leftBottomX, bottomY);
      line(rightTopX, topY, rightBottomX, bottomY);
    }
  
    randomize() {
      this.x = random(0, 2200/4);
      this.y = random(0, 2800/4);
      this.lineLength = random(100, 600);
      this.angle = random(PI/8, PI/2);
      this.strokeWeight = random(1, 4);
    }

    grow() {
      if (this.lineCount === 2) {
        this.lineCount = 4;
      } else {
        this.lineCount = 2;
      }
      if (this.lineLength <= 360) {
        this.lineLength += this.growRate;
      } else {
        this.lineLength = 0;
        this.y = this.initialY;
        this.x = this.initialX;
      }
      this.y -= 16;
      this.x -= 8;
    }
  
    isComplete() {
      return this.age >= this.lifespan;
    }
}
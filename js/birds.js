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
    }
  
    draw() {
      push();
      translate(this.x, this.y);
      stroke(this.color);
      strokeWeight(this.strokeWeight);
      noFill();
  
      if (this.lineCount === 2) {
        // Two lines in a V shape
        this._drawTwoLines();
      } else {
        // Four lines in an inverted W shape
        this._drawFourLines();
      }
  
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
  
  }
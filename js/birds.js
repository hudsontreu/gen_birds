class Bird {
    constructor(x, y, options = {}) {
      // Position
      this.x = x;
      this.y = y;
  
      // Configuration options
      this.lineCount = options.lineCount || 2;  // 2 or 4 lines
      this.lineLength = options.lineLength || 50;  // Length of each line
      this.angle = options.angle || PI/4;  // Single angle for the entire bird
      this.strokeWeight = options.strokeWeight || 2;  // Line thickness
      this.color = options.color || color(255);  // Default white
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
      // Calculate angle-based spread for top lines
      let topSpreadFactor = this.lineLength * tan(this.angle/2);
  
      // Calculate angle-based spread for bottom lines (opposite direction)
      let bottomSpreadFactor = this.lineLength * tan(this.angle/2);
  
      // First two lines (creating the base V)
      let vertexX = 0;
      let vertexY = 0;
      let leftTopEndX = vertexX - topSpreadFactor;
      let rightTopEndX = vertexX + topSpreadFactor;
      let leftBottomEndX = vertexX - bottomSpreadFactor;
      let rightBottomEndX = vertexX + bottomSpreadFactor;
      let topY = -this.lineLength/2;
      let bottomY = this.lineLength/2;
  
      // First two lines of the V (top)
      line(leftTopEndX, topY, vertexX, vertexY);
      line(rightTopEndX, topY, vertexX, vertexY);
  
      // Additional two lines connecting to the endpoints (bottom)
      line(leftTopEndX, topY, leftBottomEndX, bottomY);
      line(rightTopEndX, topY, rightBottomEndX, bottomY);
    }
  
    // Optional: Randomize bird characteristics
    randomize() {
      // this.x = random(0, 2200/4);
      // this.y = random(0, 2800/4);
      this.lineCount = random([2, 4]);
      this.lineLength = random(100, 600);
      this.angle = random(PI/8, PI/2);
      this.strokeWeight = random(1, 4);
    }
  }
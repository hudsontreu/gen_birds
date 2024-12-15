class TextLine {
    constructor(key, value, size, x, y) {
        this.key = key;
        this.value = value;
        this.size = size;
        this.x = x;
        this.y = y;
    }

    draw() {
        push();
        textSize(this.size);
        textAlign(LEFT);
        fill(255); // White for key
        text(this.key, this.x, this.y);
        fill(255, 0, 0); // Red for value
        text(this.value, this.x + textWidth(this.key + ' '), this.y);
        pop();
    }
}

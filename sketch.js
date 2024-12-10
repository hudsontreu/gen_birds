let bgImage;
let font;
let text_primary;
let birds = [];
let numBirds;

function preload() {
  bgImage = loadImage("assets/texture.png");
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
}

function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(10);
  smooth();

  text_primary = color(255, 0, 0);
  

  numBirds = random(2, 10);
  for (let i = 0; i < numBirds; i++) {
    birds.push(new Bird(random(0, width), random(0, height), {
      lineCount: random([2, 4]),
      lineLength: random(100, 600),
      color: color(255, 255, 255),  
      strokeWeight: random(1, 4),
      angle: random(PI/8, PI/2)
    }));
  }

}

function draw() {
  translate(-width/2, -height/2);

  tint(70, 70, 70);
  image(bgImage, 0, 0, width, height);
  filter(THRESHOLD,  0.22)

  textFont(font);
  fill(text_primary);
  textSize(180);
  textAlign(CENTER, CENTER);
  text("Gen_ASCII", width/2, height/2);

  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    bird.randomize();
  }

}

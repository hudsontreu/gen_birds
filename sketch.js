let bgImage;
let bgImage_buffer;

let font;
let text_primary;
let generativeText = '';
let text_buffer;

let birds = [];
let numBirds;
let birds_buffer;


function preload() {
  bgImage = loadImage("assets/texture.png");
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
}

function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(18);
  smooth();

  //BUFFERS
  birds_buffer = createFramebuffer();
  bgImage_buffer = createFramebuffer();
  text_buffer = createFramebuffer();

  //TEXT SETUP
  text_primary = color(255, 0, 0);
  generativeText = generateRandomASCIIString(12);
  
  //BIRDS SETUP
  numBirds = random(2, 10);
  for (let i = 0; i < numBirds; i++) {
    birds.push(new Bird(random(-width/2, width/2), random(-height/2, height/2), {
      lineCount: random([2, 4]),
      lineLength: random(100, 600),
      color: color(getRandomPaletteColor()), 
      // color: color(random(255), random(255), random(255)), 
      strokeWeight: random(1, 4),
      angle: random(PI/8, PI/2)
    }));
  }

}


function draw() {
  translate(-width/2, -height/2);

  //BACKGROUND
  // bgImage_buffer.begin();
  tint(70, 70, 70);
  // imageMode(CENTER);
  image(bgImage, 0, 0, width, height);
  filter(THRESHOLD,  0.22)
  // bgImage_buffer.end();
  // image(bgImage_buffer, 0, 0, width, height);

  //BIRDS
  birds_buffer.begin();
  // clear();
  blendMode(ADD);
  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    bird.randomize();
  }
  birds_buffer.end();
  image(birds_buffer, 0, 0, width, height);


  //TEXT
  generativeText = generateRandomASCIIString(12);
  textFont(font);
  fill(text_primary);
  textSize(180);
  textAlign(CENTER, CENTER);
  
  text_buffer.begin();
  clear();
  text(generativeText, 0, 0);
  text_buffer.end();
  image(text_buffer, 0, 0, width, height);
}
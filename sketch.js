// Util_1: Birds
// Util_2: Grain textures

let BIRD_RATE = 6;
let STRIPE_COUNT = 40;


function preload() {
  bgImage = loadImage("assets/reflection.png");
  bgVid = createVideo(["assets/water.mov"]);
  bgVid.hide();
  bgVid.loop();  
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
  
  // LOAD GRAIN TEXTURES
  for (let i = 1; i <= 11; i++) {
    grainTextures.push(loadImage(`assets/grain/grain_${i}.jpg`));
  }
}


function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(30);
  smooth();
  angleMode(DEGREES);
  imageMode(CENTER);
  textFont(font);

  //SHADERS
  rectGlitchShader = createFilterShader(shaderSrc);

  //BUFFERS
  birds_buffer = createFramebuffer();
  bgImage_buffer = createFramebuffer();
  text_buffer = createFramebuffer();

  //GENERATIVE TEXT SETUP
  text_primary = color(255, 0, 0);
  generativeText = generateRandomASCIIString(12);
  
  // Initialize text lines with different update rates
  textLines = [
    new TextLine("STATUS:", "ERROR", 100, -width/2 + 50, -height/2 + 50, 45),
    new TextLine("SYSTEM:", "ERROR", 100, -width/2 + 50, -height/2 + 100, 30),
    new TextLine("MEMORY:", "ERROR", 100, -width/2 + 50, -height/2 + 150, 60),
    new TextLine("OUTPUT:", "ERROR", 100, -width/2 + 50, -height/2 + 200, 15)
  ];

  //BIRDS SETUP
  numBirds = random(2, 10);
  for (let i = 0; i < numBirds; i++) {
    birds.push(new Bird(random(-width/2, width/2), random(-height/2, height/2), {
      lineCount: random([2, 4]),
      lineLength: random(100, 600),
      color: color(getRandomPaletteColor()), 
      strokeWeight: random(2, 12),
      angle: random(PI/8, PI/2)
    }));
  }

  //BARCODES SETUP
  barcodes.push(new Barcode(width/4, height/3, width/2, height/4, 40, 1));  // Fast update, medium stripes
  barcodes.push(new Barcode(width/4, height/6, width/2, height/8, 20, 2));  // Slower update, fewer stripes
  barcodes.push(new Barcode(width/4, height/8, width/2, height/8, 60, 6));  // Medium update, many stripes
}




function draw() {
  //TIMER AND FRAMERATE MODS
  count++;
  updateBirds = (count % BIRD_RATE === 0);

  //SETUP PARAMETERS
  imageMode(CENTER);


  //BACKGROUND
  push();
  tint(180, 130, 120);
  image(bgImage, 0, 0, width*2, height*2);
  filter(THRESHOLD, 0.25);
  rectGlitchShader.setUniform('time', millis() / 1000.0);
  rectGlitchShader.setUniform('resolution', [width, height]);
  rectGlitchShader.setUniform('u_shiftMax', glitchParams.shiftMax);
  rectGlitchShader.setUniform('u_sortAmount', glitchParams.sortAmount);
  rectGlitchShader.setUniform('u_shiftSpeed', glitchParams.shiftSpeed);
  rectGlitchShader.setUniform('u_blockNumX', glitchParams.blockNumX);
  rectGlitchShader.setUniform('u_blockNumY', glitchParams.blockNumY);
  filter(rectGlitchShader);
  pop();

  //BIRDS
  birds_buffer.begin();
  if (!util_1) {clear()};
  

  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    if(updateBirds) {bird.randomize()};
  }
  
  birds_buffer.end();
  image(birds_buffer, -width/4, 0, width/2, height/2);

  //TEXT
  generativeText = generateRandomASCIIString(12);
  text_buffer.begin();
  clear();
  textFont(font);
  textSize(200);
  fill(text_primary);
  textAlign(CENTER, CENTER);
  text(generativeText, 0, 0);
  text_buffer.end();
  image(text_buffer, 0, 0, width, height);

  //BARCODES
  for (let barcode of barcodes) {
    barcode.update();
    barcode.draw();
  }

  //GRAIN OVERLAY
  if (util_2) {
    selectedGrain = random(grainTextures);
    push();
    blendMode(ADD);
    tint(255, 30);
    image(selectedGrain, 0, 0, width, height);
    pop();
  }

  // Draw text lines
  for (let line of textLines) {
    line.draw();
  }

}
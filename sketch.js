// Util_1: Birds
// Util_2: Grain textures
// Util_3: Center text
// Util_4: Generative text bottom
// Util_5: Generative text top
// Util_6: BG shader random params
// Util_7: Image flash
// Util_8: Barcodes Update
// Util_9: Fullscreen

let BIRD_RATE = 8;
let STRIPE_COUNT = 40;

function preload() {
  bgImage = loadImage("assets/reflection.png");
  testImage = loadImage("assets/dalle.png");
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
  imageMode(CENTER);
  textFont(font);

  //SHADERS
  rectGlitchShader = createFilterShader(shaderSrc);

  //SHADER PARAMS
  glitchParams = {
    shiftMax: random(0.05, 0.15),
    sortAmount: random(0.01, 0.05),
    shiftSpeed: random(0.01, 0.05),
    blockNumX: random(100.0, 300.0),
    blockNumY: random(50.0, 150.0)
  };

  //BUFFERS
  birds_buffer = createFramebuffer();
  bgImage_buffer = createFramebuffer();
  flash_buffer = createFramebuffer();

  //GENERATIVE TEXT SETUP
  text_primary = color(255, 0, 0);
  generativeText = generateRandomASCIIString(12);
  
  // Initialize text lines
  textLines = [
    new TextLine("DREAMS:", "<<<<>>>>", 80, -width/2.5 + 800, -height/3 + 200),
    new TextLine("NIGHTMARES:", "<<<<>>>>", 80, -width/2.5 + 800, -height/3 + 300),
    new TextLine("REALITY:", "<<<<>>>>", 80, -width/2.5 + 800, -height/3 + 400),
    new TextLine("--- --- --- --- ----", "", 80, -width/2.5 + 800, -height/3 + 500),
    new TextLine("ORIGIN ID:", 'TEST', 80, -width/2.5 + 800, -height/3 + 800)
  ];

  //BIRDS SETUP
  numBirds = random(2, 10);
  const regionX = -width/2;  // Start from left edge
  const regionWidth = width/3;  // Use one-third of canvas width
  const regionY = -height/4;  // Middle height region
  const regionHeight = height/2;  // Half of canvas height
  
  for (let i = 0; i < numBirds; i++) {
    const birdX = random(regionX + 100, regionX + regionWidth - 100);
    const birdY = random(regionY + 100, regionY + regionHeight - 100);
    
    birds.push(new Bird(birdX, birdY, {
      lineCount: random([2, 4]),
      lineLength: random(100, 600),
      color: color(getRandomPaletteColor()), 
      strokeWeight: 3,
      angle: random(PI/12, PI/1.8),
      growRate: random(2, 30)
    }));
  }

  //BARCODES SETUP
  barcodes.push(new Barcode(width/6, height/6, width/1.5, height/8, 200, 2));  // Slower update, fewer stripes
  barcodes.push(new Barcode(width/6, height/5, width/1.5, height/8, 180, 6));  // Medium update, many stripes
  barcodes.push(new Barcode(width/6, height/3, width/1.5, height/4, 600, 1));  // Fast update, medium stripes

}




function draw() {
  //TIMER AND FRAMERATE MODS
  count++;
  updateBirds = (count % BIRD_RATE === 0);

  //SETUP PARAMETERS
  imageMode(CENTER);

  //BACKGROUND
  push();
  blendMode(DARKEST);
  // tint(180, 130, 120);
  tint(255, 0, 0, 200);
  image(bgImage, 0, 0, width*2, height*2);
  // filter(THRESHOLD, 0.25);
  rectGlitchShader.setUniform('time', millis() / 1000.0);
  rectGlitchShader.setUniform('resolution', [width, height]);
  rectGlitchShader.setUniform('u_shiftMax', glitchParams.shiftMax);
  rectGlitchShader.setUniform('u_sortAmount', glitchParams.sortAmount);
  rectGlitchShader.setUniform('u_shiftSpeed', glitchParams.shiftSpeed);
  rectGlitchShader.setUniform('u_blockNumX', glitchParams.blockNumX);
  rectGlitchShader.setUniform('u_blockNumY', glitchParams.blockNumY);
  filter(rectGlitchShader);
  pop();

  if(util_6) {
    glitchParams = {
      shiftMax: random(0.05, 0.15),
      sortAmount: random(0.01, 0.05),
      shiftSpeed: random(0.01, 0.05),
      blockNumX: random(2.0, 400.0),
      blockNumY: random(2.0, 400.0)
    };
    util_6 = false;
  }

  //IMAGE FLASH
  if(util_7) {
    if(random(1) < 0.1) {
      flash_buffer.begin();
      clear();
      imageMode(CENTER);
      image(testImage, 0, 0, width, height);
      filter(THRESHOLD, 0.72);
      flash_buffer.end();
      image(flash_buffer, 0, 0);
    }
  }

  //BIRDS
  birds_buffer.begin();
  if (!util_1) {clear()};
  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    if(updateBirds) {bird.grow()};
  }
  birds_buffer.end();
  image(birds_buffer, 0, 0, width, height);  // Draw buffer at full canvas size


  //TEXT
  generativeText = generateRandomASCIIString(8);
  generativeText_2 = generateRandomASCIIString(8);
  generativeText_3 = generateRandomASCIIString(8);
  generativeText_4 = generateRandomASCIIString(8);

  if(util_3) {
    textFont(font);
    textSize(200);
    fill(text_primary);
    textAlign(CENTER, CENTER);
    text(generativeText, 0, 0);
  };

  // TEXT LINES
  for (let line of textLines) {
    line.draw();
  }

  if(!util_4) {textLines[4].value = generativeText};
  if(util_5) {
    textLines[0].value = generativeText_2;
    textLines[1].value = generativeText_3;
    textLines[2].value = generativeText_4;
  };


  //BARCODES
  for (let barcode of barcodes) {
    if(!util_8) {barcode.update()};
    barcode.draw();
  }

  //GRAIN OVERLAY
  if (util_2) {
    selectedGrain = random(grainTextures);
    push();
    blendMode(SCREEN);
    tint(255, 30);
    image(selectedGrain, 0, 0, width, height);
    pop();
  }

}
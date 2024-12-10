
function preload() {
  bgImage = loadImage("assets/reflection.png");
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
}

function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(30);
  smooth();

  rectGlitchShader = createFilterShader(shaderSrc);

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
      strokeWeight: random(2, 12),
      angle: random(PI/8, PI/2)
    }));
  }

}


function draw() {
  // translate(-width/2, -height/2);

  //BACKGROUND
  // bgImage_buffer.begin();
  imageMode(CENTER);

  tint(180, 130, 120);
  image(bgImage, 0, 0, width*2, height*2);
  filter(THRESHOLD, 0.28);
  rectGlitchShader.setUniform('time', millis() / 1000.0);
  rectGlitchShader.setUniform('resolution', [width, height]);
  rectGlitchShader.setUniform('u_shiftMax', glitchParams.shiftMax);
  rectGlitchShader.setUniform('u_sortAmount', glitchParams.sortAmount);
  rectGlitchShader.setUniform('u_shiftSpeed', glitchParams.shiftSpeed);
  rectGlitchShader.setUniform('u_blockNumX', glitchParams.blockNumX);
  rectGlitchShader.setUniform('u_blockNumY', glitchParams.blockNumY);
  filter(rectGlitchShader);
  // bgImage_buffer.end();
  // image(bgImage_buffer, 0, 0, width, height);
  

  //BIRDS
  birds_buffer.begin();
  if (util_1) {clear()};

  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    bird.randomize();
  }
  
  birds_buffer.end();
  image(birds_buffer, 0, 0, width, height);
  blendMode(ADD);

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
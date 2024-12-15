let prev, next;

function preload() {
  bgImage = loadImage("assets/reflection.png");
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
  waterMovie = createVideo('assets/water.mp4');

}

function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(22);
  smooth();

  //BACKGROUND
  waterMovie.loop();
  waterMovie.hide();

  rectGlitchShader = createFilterShader(shaderSrc);

  //BUFFERS
  birds_buffer = createFramebuffer();
  bgImage_buffer = createFramebuffer();
  text_buffer = createFramebuffer();
  prev = createFramebuffer({ format: FLOAT });
  next = createFramebuffer({ format: FLOAT });

  //TEXT SETUP
  text_primary = '#7d0000';
  generativeText = generateRandomASCIIString(12);
  
  //BIRDS SETUP
  numBirds = random(2, 10);
  for (let i = 0; i < numBirds; i++) {
    birds.push(new Bird(random(-width/2, width/2), random(-height/2, height/2), {
      lineCount: random([2, 4]),
      lineLength: random(2, 10),
      color: color(getRandomPaletteColor()), 
      // color: color(random(255), random(255), random(255)), 
      strokeWeight: random(2, 12),
      angle: random(PI/8, PI/2)
    }));
  }

}


function draw() {
  imageMode(CENTER);
  [prev, next] = [next, prev];

  //FEEDBACK BIRDS
  next.begin();
  clear();
  push();
  scale(1.01);
  image(prev, 0, 0);
  pop();

  if (util_1) {clear()};

  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    bird.randomize();
  }
  next.end();
  //BACKGROUND
  // tint(180, 130, 120);
  image(waterMovie, 0, 0, width*2, height*2);
  // filter(THRESHOLD, 0.1);
  rectGlitchShader.setUniform('time', millis() / 1000.0);
  rectGlitchShader.setUniform('resolution', [width, height]);
  rectGlitchShader.setUniform('u_shiftMax', glitchParams.shiftMax);
  rectGlitchShader.setUniform('u_sortAmount', glitchParams.sortAmount);
  rectGlitchShader.setUniform('u_shiftSpeed', glitchParams.shiftSpeed);
  rectGlitchShader.setUniform('u_blockNumX', glitchParams.blockNumX);
  rectGlitchShader.setUniform('u_blockNumY', glitchParams.blockNumY);
  filter(rectGlitchShader);

  image(next, 0, 0);


  //TEXT
  generativeText = generateRandomASCIIString(12);
  textFont(font);
  fill(text_primary);
  textSize(180);
  textAlign(CENTER, CENTER);
  
  text_buffer.begin();
  clear();
  text(generativeText, 0, height/4);
  text_buffer.end();
  image(text_buffer, 0, 0, width, height);

  
  //BLENDING
  if (util_2) {
    blendMode(ADD);
  } else {
    blendMode(BLEND);
  }

} 
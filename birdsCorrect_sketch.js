let BIRD_RATE = 6;
let STRIPE_COUNT = 40;

function preload() {
  bgImage = loadImage("assets/reflection.png");
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

  //SHADERS
  rectGlitchShader = createFilterShader(shaderSrc);

  //AUDIO SETUP
  synth = new Tone.Synth({
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.004,
      decay: 0.4,
      sustain: 0.2,
      release: 0.2
    }
  }).toDestination();
  synth.volume.value = -10;

  //BUFFERS
  birds_buffer = createFramebuffer();
  bgImage_buffer = createFramebuffer();
  text_buffer = createFramebuffer();
  barcode_buffer = createFramebuffer();

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
      strokeWeight: random(2, 12),
      angle: random(PI/8, PI/2)
    }));
  }

   // Initialize barcode stripes
   for (let i = 0; i < STRIPE_COUNT; i++) {
    barcodeStripes.push(random() > 0.5 ? 0 : 255); // Random black or white
  }

  // Add click handler for audio initialization
  window.addEventListener('mousedown', async () => {
    console.log('Click detected, audio initialized:', audioInitialized);
    if (!audioInitialized) {
      await Tone.start();
      audioInitialized = true;
      console.log('Audio is now ready');
      synth.triggerAttackRelease("D2", "8n");
    }
  });
}

function draw() {
  count++;
  updateBirds = (count % BIRD_RATE === 0);

  // Play beep when birds update
  if (updateBirds) {
    console.log('Birds updating, audio initialized:', audioInitialized);
    if (audioInitialized) {
      console.log('Playing beep at count:', count);
      synth.triggerAttackRelease("D3", "8n", Tone.now());
    }
  }

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
  // if (util_1) {clear()};
  if (!util_1) {clear()};

  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    bird.draw();
    if(updateBirds) {bird.randomize()};
  }
  
  birds_buffer.end();
  
  image(birds_buffer, -width/4, 0, width/2, height/2);
 
  
  // blendMode(ADD);

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

  //BARCODE
  for (let i = 0; i < STRIPE_COUNT; i++) {
    if (random() < 0.3) { // 30% chance to flip each stripe
      barcodeStripes[i] = barcodeStripes[i] === 0 ? 255 : 0;
    }
  }
  barcode_buffer.begin();
  clear();
  noStroke();
  let stripeWidth = width/3 / STRIPE_COUNT;
  for (let i = 0; i < STRIPE_COUNT; i++) {
    fill(barcodeStripes[i]);
    rect(i * stripeWidth - width/6, -height/8, stripeWidth, height/4);
  }
  barcode_buffer.end();

  image(barcode_buffer, width/4, height/4, width/2, height/8);
  image(barcode_buffer, width/4, height/6, width/2, height/8);
  image(barcode_buffer, width/4, height/8, width/2, height/8);


  // Apply grain overlay
  selectedGrain = random(grainTextures);
  push();
  blendMode(ADD);
  tint(255, 60); // Adjust opacity of grain
  image(selectedGrain, 0, 0, width, height);
  pop();

}
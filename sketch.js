let bgImage;
let bgImage_buffer;

let font;
let text_primary;
let generativeText = '';
let text_buffer;

let birds = [];
let numBirds;
let birds_buffer;

let rectGlitchShader;
let shaderSrc = `
precision mediump float;

uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float time;
uniform vec2 resolution;

// Controllable parameters
uniform float u_shiftMax;      // former SHIFT_MAX
uniform float u_sortAmount;    // former SORT_AMOUNT
uniform float u_shiftSpeed;    // former SHIFT_SPEED
uniform float u_blockNumX;     // former BLOCK_NUM_X
uniform float u_blockNumY;     // former BLOCK_NUM_Y

// Function to generate a pseudo-random number based on a 2D vector
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Define the number of blocks along x and y axes
    vec2 blockCount = vec2(u_blockNumX, u_blockNumY);
    vec2 blockSize = vec2(1.0) / blockCount;

    // Determine which block the current pixel belongs to
    vec2 blockCoord = floor(uv / blockSize);

    // Generate a pseudo-random offset for each block
    float randomOffset = random(blockCoord);

    // Calculate the shift amount
    float shiftAmount = mod(time * u_shiftSpeed + randomOffset, u_shiftMax);

    // Apply the vertical shift to the UV coordinates
    vec2 shiftedUV = uv;
    shiftedUV.y += shiftAmount;

    // Sort effect
    float sortOffset = random(vec2(blockCoord.x, floor(time * 10.0)));
    if(sortOffset < u_sortAmount) {
        shiftedUV.y = mod(shiftedUV.y + sortOffset, 1.0);
    }

    // Sample the texture with the modified coordinates
    gl_FragColor = texture2D(tex0, shiftedUV);
}
`;

let glitchParams = {
  shiftMax: 0.05,
  sortAmount: 0.003,
  shiftSpeed: 0.009,
  blockNumX: 200.0,
  blockNumY: 20.0
};

function preload() {
  bgImage = loadImage("assets/texture.png");
  font = loadFont('assets/fonts/SourceCodePro-VariableFont_wght.ttf')
}

function setup() {
  createCanvas(2200, 2800, WEBGL);
  frameRate(8);
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
  clear();
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
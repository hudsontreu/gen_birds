//UTILITY VARIABLES
let count = 0;
let util_1 = false;
let util_2 = false;
let util_3 = false;
let util_4 = false;
let util_5 = false;
let util_6 = false;
let util_7 = false;
let util_8 = false;
let util_9 = false;

//BG IMAGE
let bgImage;
let bgImage_buffer;
let bgVid;

//FILM & GRAIN TEXTURES
let grainTextures = [];
let selectedGrain;
let filmTextures = [];
let selectedFilm;

//TEXT LINES
let textLines = [];

//TEXT
let font;
let text_primary;
let generativeText = '';

//BIRDS
let birds = [];
let numBirds;
let birds_buffer;
let updateBirds;

//BARCODES
let barcodes = [];

//BARCODE GLITCH
let barcode_buffer;
let barcodeStripes = [];

//RECT GLITCH SHADER
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
    shiftMax: 0.1,
    sortAmount: 0.003,
    shiftSpeed: 0.019,
    blockNumX: 200.0,
    blockNumY: 100.0
  };

//FRAMERATE MODULATIONS
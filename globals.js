let util_1 = false;
let util_2 = false;

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
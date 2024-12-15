
function keyPressed() {
    key === 's' && (isLooping() ? noLoop() : loop());
    key === '1' && (util_1 = !util_1);
    key === '2' && (util_2 = !util_2);
    key === '3' && (util_3 = !util_3);
    key === '4' && (util_4 = !util_4);
    key === '5' && (util_5 = !util_5);
    key === '6' && (util_6 = !util_6);
    key === '7' && (util_7 = !util_7);
    key === '8' && (util_8 = !util_8);
    key === '9' && fullscreen(!fullscreen());
    key === '0' && (util_0 = !util_0);
  }

  function generateRandomASCIIString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(floor(random(0, 127)));
    }
    return result;
  }

  // const COLOR_PALETTE = [
//     '#3acfa2',
//     '#F2BE22', 
//     '#f25acf',
//     '#f0b24f'
//   ];

const COLOR_PALETTE = [
  '#ffffff',
];
  
  function getRandomPaletteColor() {
    return COLOR_PALETTE[floor(random(COLOR_PALETTE.length))];
  }
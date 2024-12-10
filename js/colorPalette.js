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
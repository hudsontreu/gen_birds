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

class TextScramble {
  constructor(finalText, charSet) {
    this.finalText = finalText;
    this.currentText = '';
    this.chars = charSet || '!<>-_\\/[]{}—=+*^?#________';
    this.startTime = millis();
    this.duration = 4000; // 4 seconds
    this.updateInterval = 50; // How often to update scramble
    this.lastUpdate = 0;
    this.isComplete = false;
    
    // Initialize current text with random chars
    this.currentText = Array(this.finalText.length)
      .fill()
      .map(() => this.chars[Math.floor(random(this.chars.length))])
      .join('');
  }

  update() {
    if (this.isComplete) return this.finalText;
    
    let currentTime = millis();
    let progress = (currentTime - this.startTime) / this.duration;
    
    // If we've exceeded duration, complete the animation
    if (progress >= 1) {
      this.isComplete = true;
      return this.finalText;
    }
    
    // Only update at specified intervals
    if (currentTime - this.lastUpdate < this.updateInterval) {
      return this.currentText;
    }
    
    this.lastUpdate = currentTime;
    
    // As we progress, more characters should settle into their final position
    let settleThreshold = progress * 1.5; // Adjust this multiplier to change settling speed
    
    this.currentText = Array.from(this.finalText)
      .map((char, index) => {
        // If this character should be settled based on progress
        if (random() < settleThreshold) {
          return this.finalText[index];
        }
        return this.chars[Math.floor(random(this.chars.length))];
      })
      .join('');
    
    return this.currentText;
  }
}

// Store scramble instances for each line
let lineScrambles = [];

// Different character sets for variety
const CHAR_SETS = [
  '!<>-_\\/[]{}—=+*^?#________',
  '┌┐└┘├┤┬┴┼━┃┏┓┗┛┣┫┳┻╋',
  '░▒▓█▄▀■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯',
  '♠♡♢♣♤♥♦♧♨♩♪♫♬♭♮♯'
];

function generateRandomASCIIString(length, lineIndex = 0) {
  if (util_5) {
    // Initialize scrambles for all lines if not exists or if previous animation complete
    if (!lineScrambles[lineIndex] || lineScrambles[lineIndex].isComplete) {
      // Remove used words to avoid repetition
      let availableWords = poeticWords.filter(word => 
        !lineScrambles.map(s => s?.finalText).includes(word)
      );
      
      // If we've used all words, reset the filter
      if (availableWords.length === 0) {
        availableWords = [...poeticWords];
      }
      
      // Select a random word and character set for this line
      let targetWord = random(availableWords);
      let charSet = random(CHAR_SETS);
      lineScrambles[lineIndex] = new TextScramble(targetWord, charSet);
    }
    
    return lineScrambles[lineIndex].update();
  } else {
    // Reset scrambles when util_5 is turned off
    lineScrambles = [];
    // Return random ASCII string as before
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(floor(random(33, 127)));
    }
    return result;
  }
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
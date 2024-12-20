class TextLine {
    constructor(key, value, size, x, y) {
        this.key = key;
        this.value = value;
        this.size = size;
        this.x = x;
        this.y = y;
    }

    draw() {
        push();
        textSize(this.size);
        textAlign(LEFT);
        fill(255); // White for key
        text(this.key, this.x, this.y);
        fill(255, 0, 0); // Red for value
        text(this.value, this.x + textWidth(this.key + ' '), this.y);
        pop();
    }
}

class TextScramble {
    constructor(finalText, charSet) {
      this.finalText = finalText;
      this.currentText = '';
      this.chars = charSet || '!<>-_\\/[]{}—=+*^?#________';
      this.startTime = millis();
      this.duration = 6000; // 4 seconds
      this.updateInterval = 10; // How often to update scramble
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
    '♠♡♢♣♤┴┼━┃♥♦♧♨♩▫▬▭▮♪♫♬♭♮♯'
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

function keyPressed() {
    key === 's' && (isLooping() ? noLoop() : loop());
    key === '1' && (util_1 = !util_1);
    key === '2' && (util_2 = !util_2);
  }

  function generateRandomASCIIString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(floor(random(0, 127)));
    }
    return result;
  }
//PAUSE LOOP
function keyPressed() {
    if (key === 's' || key === 'S') {
      if (isLooping()) {
        noLoop();
      } else {
        loop();
      }
    }
  }

  function generateRandomASCIIString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(floor(random(0, 127)));
    }
    return result;
  }
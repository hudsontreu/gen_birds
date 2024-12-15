
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
    key === '9' && (util_9 = !util_9);
  }

  function generateRandomASCIIString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(floor(random(0, 127)));
    }
    return result;
  }
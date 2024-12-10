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

console.log("starting")
console.log(window.DeviceOrientationEvent)
is_running = false


if (typeof motion_callbacks == "undefined") {
  motion_callbacks = []
}
if (typeof orientation_callbacks == "undefined") {
  orientation_callbacks = []
}

function handleOrientation(event) {
  const coords = {
    alpha: event.alpha,
    beta:  event.beta, 
    gamma: event.gamma
  }

  for (const callback of orientation_callbacks) {
    callback(coords)
  }
}
let x = 0;
let y = 0;
let alpha = 0;
let beta = 0;
let gamma = 0;
let image_count = 20;
let lastTime = undefined;
function handleMotionEvent(event) {
    if (lastTime != undefined) {
      let deltatime = (Date.now() - lastTime)/1000


      alpha += event.rotationRate.alpha*deltatime
      beta += event.rotationRate.beta*deltatime
      gamma += event.rotationRate.gamma*deltatime

      const dx = event.rotationRate.beta*100*image_count/360*deltatime
      const dy = event.rotationRate.alpha*100*image_count/360*deltatime

      const cos = Math.cos(Math.PI*gamma/180)
      const sin = Math.sin(Math.PI*gamma/180)

      x += cos*dx + sin*dy;
      y += cos*dy - sin*dx;

      const coords = {
        x, y, alpha, beta, gamma
      }

      for (const callback of motion_callbacks) {
        callback(coords)
      }
    }
    
    lastTime = Date.now()
}

function enable_gyro(message) {
    console.log(message)
    console.log(is_running)
    
    // Request permission for iOS 13+ devices
    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
      DeviceMotionEvent.requestPermission();
    }
    
    if (!is_running) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("devicemotion", handleMotionEvent, true);
      is_running = false;
    }
    console.log(is_running)
}

function keypress(event) {
  let rotation_rate = {
    'alpha': 0,
    'beta': 0,
    'gamma': 0,
  }
  switch (event.key) {
    case "a":
      rotation_rate['beta'] = 10
      break;
    case "d":
      rotation_rate['beta'] = -10
      break;
    case "w":
      rotation_rate['alpha'] = 10
      break;
    case "s":
      rotation_rate['alpha'] = -10
      break;
    case "q":
      rotation_rate['gamma'] = -45
      break;
    case "e":
      rotation_rate['gamma'] = 45
      break;
  }
  handleMotionEvent({'rotationRate': rotation_rate})
}
window.addEventListener('keydown', keypress, true)

document.addEventListener("click", () => enable_gyro("click"))
enable_gyro("gyro start")
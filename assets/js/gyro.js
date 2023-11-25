
console.log("starting")

document.addEventListener("click", () => {

    let gyroscope = new Gyroscope({ frequency: 60 });
    console.log(gyroscope.toString())
    gyroscope.addEventListener("reading", (e) => {
      console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
      console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
      console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
    });
    gyroscope.onerror = (e) => {
        console.log(e)
    }
    gyroscope.start();
})
function handleOrientation(event) {
    console.log("triggered")
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    report = alpha + ", " + beta + ", " + gamma
    console.log(report)
    report_box =  document.getElementById('report_box')
    if (report_box != undefined) report_box.innerHTML = report
}
window.addEventListener('deviceorientation', handleOrientation);


let gyroscope = new Gyroscope({ frequency: 60 });
gyroscope.addEventListener("reading", (e) => {
  console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
  console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
  console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
});
gyroscope.onerror = (e) => {
    console.log(e)
}
gyroscope.start();
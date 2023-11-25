
console.log("starting")
console.log(window.DeviceOrientationEvent)

document.addEventListener("click", () => {
    console.log("hi")
    console.log(2)
    console.log(window.DeviceOrientationEvent)
})
window.addEventListener('deviceorientation', handleOrientation, true);
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
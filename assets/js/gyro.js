
console.log("starting")

document.addEventListener("click", () => console.log("hi"))
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
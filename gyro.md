---
layout: page
title: Gyro
permalink: /gyro/
---

<div id="report_box"></div>
<div id="ball"></div>

<script>
   let sensor = new Gyroscope()
   let x,y,z,report;
   sensor.start()
      document.getElementById("report_box").innerHTML = "Starting"
   sensor.onreading = () => {
      report = "X: " + sensor.x + "<br>"
      report += "Y: " + sensor.y + "<br>"
      report += "Z: " + sensor.z + "<br>"
      document.getElementById("report_box").innerHTML = report
      console.log(report)
   }
   sensor.onerror = (e) => {
      document.getElementById("report_box").innerHTML = e.error.message
      console.log(e)
   }
</script>
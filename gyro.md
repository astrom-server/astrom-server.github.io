---
layout: gyro
title: Gyro
permalink: /gyro/
---

<div id="report_box"></div>
<div id="ball"></div>


<script>

   function handleOrientation(event) {
   const alpha = event.alpha;
   const beta = event.beta;
   const gamma = event.gamma;
   report = alpha + ", " + beta + ", " + gamma
   console.log(report)
   document.getElementById('report_box').innerHTML = report
   }
   console.log("starting")
   window.addEventListener('deviceorientation', handleOrientation);
</script>

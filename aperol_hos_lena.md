---
layout: aperol
title: Aperol hos Lena
permalink: /aperol_hos_lena/
---


<script>
    document.body.background = "/assets/aperol-gif.gif"
    document.body.style="background-size: cover;"
</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<image src="/assets/aperol_logo.jpeg" id="aperol_logo"></image>
<div id="hos_lena">hos Lena</div>

<div id="buttons"> 
    <button id="btn1" class="aperol_button" style="top:25%; left:50%"><i class="fa fa-music"></i></button>
    <div class="aperol_button_text" style="top:calc(25% + 15vw); left:50%">MUSIK</div>
    <button id="btn2" class="aperol_button" style="top:75%; left:50%"><i class="fa fa-wine-bottle"></i></button>
    <div class="aperol_button_text" style="top:calc(75% - 15vw); left:50%">$$$</div>
    <button id="btn3" class="aperol_button" style="top:50%; left:25%"><i class="fa fa-champagne-glasses"></i></button>
    <div class="aperol_button_text" style="top:calc(50% - 2.5vw); left:calc(25% + 7.5vw); transform: rotate(-90deg);">RECEPT</div>
    <button id="btn4" class="aperol_button" style="top:50%; left:75%"><i class="fa fa-search"></i></button>
    <div class="aperol_button_text" style="top:calc(50% - 2.5vw); left:calc(75% - 22.5vw); transform: rotate(90deg);">INFO</div>
<div>

<script>
    document.getElementById("btn1").addEventListener("click", () => {
        //Music
        window.open("https://open.spotify.com/playlist/47AnWUl1xlNCzH795vnWva?si=881ddf3e9ab242ba")
    })
    document.getElementById("btn2").addEventListener("click", () => {
        //Buy
        window.open("https://www.systembolaget.se/produkt/vin/aperol-72901/")
    })
    document.getElementById("btn3").addEventListener("click", () => {
        //Recipes
        window.open("/aperol_hos_lena/recipes")
    })
    document.getElementById("btn4").addEventListener("click", () => {
        //Search
        window.open("https://www.aperol.com/en-us/our-story/")
    })
</script>
---
layout: aperol
title: Aperolrecept
permalink: /aperol_hos_lena/recipes/
---

<image src="/assets/aperol_logo.jpeg" id="aperol_logo" style="position:relative"></image>
<div id="hos_lena">hos Lena</div>

<div id="recipes" style="padding: 8px">
</div>



<script>
    var client = new XMLHttpRequest();
    client.open('GET', '/assets/aperol_recipes.json');
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            let recipes = JSON.parse(client.responseText)
            let el = document.getElementById("recipes")
            console.log(recipes)
            let text = ""
            for (const name in recipes) {
               text += "<div>"
               text += "<h2 class='aperol_title'>" + name + "</h2>"
               text += "<ul>"
               for (const ingredient of recipes[name]['ingredients']) {
                  text += "<li>" + ingredient + "</li>"
               }
               text += "</ul>"
               text += "<img src='" + recipes[name].image + "' class='aperol_img'>"
               text += "</div>"
            }
            el.innerHTML = text
        }
    }
    client.send();


</script>

const node = document.createElement("h1");
const text = document.createTextNode("Hello world");
node.appendChild(text);
document.body.appendChild(node);

import { World } from "./world.js";

// Create the canvas
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

const world = new World(canvas, context);

// Load a trial level
world.create_from_tilemap("tiled-level/new_level.json");

function auto_rescale_window(fixed = false) {
    /*
     * If fixed is true, the style of the canvas is set to match
     * exactly with the resolution.
     */

    // Get the current aspect ratio
    let aspect_ratio = canvas.width / canvas.height;
    let good_height = window.innerWidth / aspect_ratio;

    // Set the window that keeps the same aspect ratio fitting the browser
    var width = 0;
    var height = 0;
    if (good_height <= window.innerHeight) {
        width =  window.innerWidth;
        height = good_height;
    } else {
        width =  window.innerHeight * aspect_ratio;
        height =  window.innerHeight;
    }

    if (fixed) {
        width = canvas.width;
        height = canvas.height;
    }

    canvas.style.width = "" + width + "px";
    canvas.style.height = "" + height + "px";

    // Set the position to always be at the center of the screen
    canvas.style.left = ""  + Math.floor(window.innerWidth/2 -  width / 2) + "px";
    canvas.style.top = ""  + Math.floor(window.innerHeight/2 - height / 2) + "px";
}


// Autoresize the game window on resize event
auto_rescale_window();
document.body.addEventListener("resize", (event) => {
    auto_rescale_window();
});

function animate(deltaTime) {
    // Stabilize to avoid jumps
    let dt = deltaTime / 1000;
    if (dt > 0.05) dt = 0.05;

    context.clearRect(0,0, canvas.width, canvas.height);

    if (world.is_loaded()) {
        world.update(dt);
        world.draw();
    }

    /*
    context.fillStyle = "#000";
    context.fillRect(0,0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(100,100, canvas.width/2, canvas.height/2);*/

    requestAnimationFrame(animate);
}

animate();
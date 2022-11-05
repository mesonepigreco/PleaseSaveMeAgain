export function draw_color_circle(context, canvas, pos, radius) {
    context.save();

    context.globalCompositeOperation = "color";

    // Create a gradient
    var gradient = context.createRadialGradient(pos.x, pos.y, 
        radius*.5, pos.x, pos.y, radius*1.5);

    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.9, "rgba(255,255,255,.8)");
    gradient.addColorStop(0.95, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,1)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);


    // Create a gradient for lighting
    /*context.globalCompositeOperation = "lighter";
    var newgradient = context.createRadialGradient(pos.x, pos.y, 
        radius*.5, pos.x, pos.y, radius*1.5);

    newgradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    newgradient.addColorStop(0.9, "rgba(20,20,20,1)");
    newgradient.addColorStop(0.95, "rgba(20,20,20,1)");
    newgradient.addColorStop(1, "rgba(20,20,20,1)");

    context.fillStyle = newgradient;
    context.fillRect(0, 0, canvas.width, canvas.height);*/


    context.restore();
}
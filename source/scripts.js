$(document).ready(function() {
    canvas = document.getElementById("first");
    context = canvas.getContext("2d");

    context.rect(20, 20, 200, 100);
    context.fillStyle = "#8ED6FF";
    context.shadowColor = "#bbbbbb";
    context.shadowBlur = 20;
    context.shadowOffsetX = 15;
    context.shadowOffsetY = 15;
    context.fill();
});
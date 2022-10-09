function toggleDiv() {
    var launcher = document.getElementById("launcher");
    var timeline = document.getElementsByClassName("timeline")[0];

    var dir = launcher.style.transform == "rotate(90deg)" ? -1 : 1;

    if(dir == 1){
        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(90deg)";
        // Add the timeline after the animation ends
        setTimeout(function() {
            timeline.style.display = "block";
        }, 500);
    }
    else{
        // Remove the timeline before the animation starts
        timeline.style.display = "none";
        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(0deg)";
    }
}
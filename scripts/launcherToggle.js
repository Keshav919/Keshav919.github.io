function toggleLauncher() {
    var launcher = document.getElementById("launcher");
    var timeline = document.getElementsByClassName("timeline")[0];
    var hamburger = document.getElementById("hamburger");
    var menu = document.getElementById("menu");

    var dir = launcher.style.transform == "rotate(90deg)" ? -1 : 1;

    if(dir == 1){
        
        menu.style.display = "none";
        hamburger.style.transition = "transform 0.5s ease";
        hamburger.style.transform = "rotate(0deg)";

        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(90deg)";

        // Add the timeline after the animation ends
        setTimeout(function() {
            timeline.style.display = "block";
            menu.style.display = "none";
        }, 500);
    }
    else{
        // Remove the timeline before the animation starts
        timeline.style.display = "none";
        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(0deg)";
    }
}
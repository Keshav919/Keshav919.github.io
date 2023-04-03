function toggleHamburger() {
    var hamburger = document.getElementById("hamburger");
    var menu = document.getElementById("menu");
    var launcher = document.getElementById("launcher");
    var timeline = document.getElementsByClassName("timeline")[0];

    var dir = hamburger.style.transform == "rotate(90deg)" ? -1 : 1;

    if(dir == 1){

        timeline.style.display = "none";
        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(0deg)";

        hamburger.style.transition = "transform 0.5s ease";
        hamburger.style.transform = "rotate(90deg)";
        setTimeout(function() {
            menu.style.display = "block";
        }, 500);
    }
    else{
        // Remove the timeline before the animation starts
        menu.style.display = "none";
        hamburger.style.transition = "transform 0.5s ease";
        hamburger.style.transform = "rotate(0deg)";
    }
}
function toggleLauncher() {
    var launcher = document.getElementById("launcher");
    var timeline = document.getElementsByClassName("timeline")[0];
    var hamburger = document.getElementById("hamburger");
    var menu = document.getElementById("menu");

    var dir = launcher.style.transform == "rotate(90deg)" ? -1 : 1;

    var height=document.documentElement.scrollHeight;

    // Turn the timeline on by first rotating the toggle and then making the timeline visible
    if(dir == 1){
        
        hideMenu(menu, hamburger);

        launcher.style.transition = "transform 0.5s ease";
        launcher.style.transform = "rotate(90deg)";

        // Add the timeline after the animation ends
        setTimeout(function() {
            timeline.style.display = "block";
            menu.style.display = "none";
            smoothScroll(height, 333)
        }, 500);
    }
    else{
        smoothScroll(0, 333)
        // Remove the timeline before the animation starts
        setTimeout( function() {
            timeline.style.display = "none";
            launcher.style.transition = "transform 0.5s ease";
            launcher.style.transform = "rotate(0deg)";
        }, 333)
    }
}
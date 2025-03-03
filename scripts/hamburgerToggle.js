function hideMenu(menu, hamburger) {
    // Remove the meny
    menu.style.display = "none";
    hamburger.style.transition = "transform 0.5s ease";
    hamburger.style.transform = "rotate(0deg)";
}

function toggleHamburger() {
    var hamburger = document.getElementById("hamburger");
    var menu = document.getElementById("menu");
    var launcher = document.getElementById("launcher");
    var timeline = document.getElementsByClassName("timeline")[0];

    var dir = hamburger.style.transform == "rotate(90deg)" ? -1 : 1;
    var launcherdir = launcher.style.transform == "rotate(90deg)" ? -1 : 1;
    var delay = launcherdir == -1 ? 333: 0

    // Add the menu to the view
    if(dir == 1){

        // If you are somewhere else, scroll up to the top before adding menu

        smoothScroll(0, delay);
        setTimeout(function() {
            timeline.style.display = "none";
            launcher.style.transition = "transform 0.5s ease";
            launcher.style.transform = "rotate(0deg)";

            hamburger.style.transition = "transform 0.5s ease";
            hamburger.style.transform = "rotate(90deg)";
        }, delay);
        setTimeout(function() {
            menu.style.display = "block";
        }, 500);
    }
    else{
        hideMenu(menu, hamburger)
    }
}
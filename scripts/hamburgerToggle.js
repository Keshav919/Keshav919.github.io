function toggleHamburger() {
    var hamburger = document.getElementById("hamburger");

    var dir = hamburger.style.transform == "rotate(90deg)" ? -1 : 1;

    if(dir == 1){
        hamburger.style.transition = "transform 0.5s ease";
        hamburger.style.transform = "rotate(90deg)";
    }
    else{
        // Remove the timeline before the animation starts
        hamburger.style.transition = "transform 0.5s ease";
        hamburger.style.transform = "rotate(0deg)";
    }
}
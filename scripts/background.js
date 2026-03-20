(function () {
    const images = [
        "../images/backgrounds/pb_grad_vert.png",
        "../images/backgrounds/VP_Events.png",
        "../images/backgrounds/mn.png",
    ];
    
    chosen = images[Math.floor(Math.random() * images.length)];
    sessionStorage.setItem("landingBg", chosen);

    document.documentElement.style.setProperty("--landing-bg", `url(${chosen})`);
})();

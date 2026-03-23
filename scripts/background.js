(function () {
    const images = [
        "../images/backgrounds/pb_grad_vert.png",
        "../images/backgrounds/mn.png",
        "../images/backgrounds/boston.png",
    ];

    const chosen = images[Math.floor(Math.random() * images.length)];
    document.documentElement.style.setProperty("--landing-bg", `url(${chosen})`);
})();

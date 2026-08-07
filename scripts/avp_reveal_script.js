var theatreModel = document.getElementById("theatre");

function buildImmersiveTransform() {
  var transform = new DOMMatrix();
  // Enter immersive: fix orientation so ceiling up, floor down, facing the stage
  // Stand in the room center at standing height
  transform.translateSelf(0, -2, -23.5);   // X, Y, Z from origin — stand inside room
  transform.rotateSelf(0, -90, 0);         // Face forward into the space (Y rotation)
  transform.scaleSelf(1.5, 1.5, 1.5);      // Face forward into the space (Y rotation)
  return transform;
}

function setupImmersiveExperience() {
  theatreModel.style.display = "none";

  var container = document.createElement("div");
  container.id = "immersiveContainer";
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  document.body.appendChild(container);

  var btn = document.createElement("button");
  btn.id = "enterImmersiveBtn";
  btn.innerHTML = "<span>Enter Immersive Theatre</span>";
  container.appendChild(btn);

  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    e.stopPropagation();
    var isImmersive = !!document.immersiveElement;
    if (!isImmersive) {
      console.log("=== Click: Attempting requestImmersive() ===");
      try {
        await theatreModel.requestImmersive();
        console.log("requestImmersive resolved, waiting for scene...");
        // Let the compositor finish setting up the scene before we apply transform
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error("requestImmersive failed:", err);
        alert("Could not enter immersive mode: " + err.message);
      }
    } else {
      console.log("=== Click: Attempting exitImmersive() ===");
      try {
        await document.exitImmersive();
      } catch (err) {
        console.error("exitImmersive failed:", err);
      }
    }
  });

  // Debug helper for the console
  window._tryImmersion = function () {
    return theatreModel.requestImmersive().then(
      function (s) {
        console.log("Success:", s);
      },
      function (e) {
        console.error("Failed:", e);
      }
    );
  };

  // Build the video overlay for the immersive environment
  var videoOverlay = document.createElement("div");
  videoOverlay.id = "immersiveVideoOverlay";
  videoOverlay.style.position = "absolute";
  videoOverlay.style.inset = "0";
  videoOverlay.style.display = "none";
  videoOverlay.style.alignItems = "center";
  videoOverlay.style.justifyContent = "center";
  container.appendChild(videoOverlay);

  var trailerVideo = document.createElement("video");
  trailerVideo.id = "trailerVideo";
  trailerVideo.src = "artifacts/TestVideo.MP4";
  trailerVideo.muted = false;
  trailerVideo.preload = "auto";
  trailerVideo.controls = true;
  trailerVideo.addEventListener("error", function () {
    console.error("trailerVideo failed to load:", trailerVideo.error);
  });
  trailerVideo.addEventListener("loadedmetadata", function () {
    console.log("trailerVideo loaded ok, duration:", trailerVideo.duration);
  });
  videoOverlay.appendChild(trailerVideo);

  // Stop playback when the video is un-docked (user exits fullscreen)
  function handleFullscreenExit() {
    var fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsElement !== trailerVideo) {
      trailerVideo.pause();
      trailerVideo.currentTime = 0;
      console.log("Exited fullscreen — trailerVideo paused and reset.");
    }
  }
  document.addEventListener("fullscreenchange", handleFullscreenExit);
  document.addEventListener("webkitfullscreenchange", handleFullscreenExit);

  // Button that docks the video onto the tagged screen in the scene.
  // requestFullscreen() on a <video> inside an immersive environment
  // is what tells visionOS Safari to dock it onto the mesh tagged
  // as the docking region in the USDZ (tagged in Blender).
  var demoButton = document.createElement("button");
  demoButton.id = "demoButton";
  demoButton.textContent = "Play Trailer";
  container.appendChild(demoButton);

  demoButton.addEventListener("click", async () => {
    try {
      await trailerVideo.play();
      console.log("Video playback started.");
    } catch (err) {
      console.error("trailerVideo.play() failed:", err);
    }
    try {
      await trailerVideo.requestFullscreen();
      console.log("Requested fullscreen — video should dock onto the tagged screen.");
    } catch (err) {
      console.error("requestFullscreen failed:", err);
    }
  });

  // Listen for immersive state changes — Apple's recommended pattern
  theatreModel.addEventListener("immersivechange", async function () {
    var isImmersive = !!document.immersiveElement;
    console.log("=== IMMERSIVECHANGE ===", isImmersive, "element:", document.immersiveElement);

    if (isImmersive) {
      btn.innerHTML = "<span>Exit Immersive Theatre</span>";
      // Small delay ensures visionOS has a chance to initialize the scene
      await new Promise((r) => setTimeout(r, 50));

      var transform = buildImmersiveTransform();
      console.log(
        "Applying immersive transform: a=" + transform.a.toFixed(4) +
        " e=" + transform.e.toFixed(2) + " f=" + transform.f.toFixed(2)
      );
      theatreModel.entityTransform = transform;

      // Apply the transform, then reveal the button that docks the video
      await new Promise((r) => setTimeout(r, 2000));
      demoButton.style.display = "block";
    } else {
      btn.innerHTML = "<span>Enter Immersive Theatre</span>";
      demoButton.style.display = "none";
    }
  });
}

function setupInlinePreview() {
  // Non-visionOS: show model with transform as inline preview
  if (theatreModel.ready && window.HTMLModelElement) {
    theatreModel.ready.then(function () {
      var frameMatrix = new DOMMatrix(theatreModel.entityTransform);
      var transform = new DOMMatrix(frameMatrix);
      transform.rotateSelf(-90, 0, 0); // fix ceiling/floor
      transform.rotateSelf(0, 15, -90); // face forward
      theatreModel.entityTransform = transform;
      console.log("Done. Check the view.");
    });
  }
}

if (document.immersiveEnabled === true) {
  setupImmersiveExperience();
} else {
  setupInlinePreview();
}
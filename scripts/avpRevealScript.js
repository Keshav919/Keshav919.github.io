var theatreModel = document.getElementById("theatre");
var toggleImmersiveBtn = document.getElementById("toggleImmersiveBtn");
var toggleBtnLabel = document.getElementById("toggleBtnLabel");
var startVideoBtn = document.getElementById("startVideoBtn");
var trailerVideo = document.getElementById("trailerVideo");

// Resolve to a fully-qualified URL up front — the native <model> element's
// src has been unreliable with plain relative paths, which is what was
// causing the "invalid URL" error on click.
var THEATRE_MODEL_SRC = new URL("artifacts/Theatre.usdz", document.baseURI).href;

function buildImmersiveTransform() {
  var transform = new DOMMatrix();
  // Enter immersive: fix orientation so ceiling up, floor down, facing the stage
  // Stand in the room center at standing height
  transform.translateSelf(0, -2, -23.5);   // X, Y, Z from origin — stand inside room
  transform.rotateSelf(0, -90, 0);         // Face forward into the space (Y rotation)
  transform.scaleSelf(1.5, 1.5, 1.5);
  return transform;
}

function setNonImmersiveUI() {
  toggleImmersiveBtn.classList.remove("loading");
  toggleImmersiveBtn.disabled = false;
  toggleBtnLabel.textContent = "Watch Reveal";
  startVideoBtn.style.display = "none";
}

function setImmersiveUI() {
  toggleImmersiveBtn.classList.remove("loading");
  toggleImmersiveBtn.disabled = false;
  toggleBtnLabel.textContent = "Exit Immersive";
  startVideoBtn.style.display = "inline-block";
}

function setLoadingUI() {
  toggleImmersiveBtn.classList.add("loading");
  toggleImmersiveBtn.disabled = true;
  toggleBtnLabel.textContent = "Loading...";
}

// --- Single toggle button: enters immersive mode, or exits it ---
toggleImmersiveBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  e.stopPropagation();

  var isImmersive = !!document.immersiveElement;

  if (!isImmersive) {
    console.log("=== Click: Attempting requestImmersive() ===");
    setLoadingUI();
    try {
      // Only load the model right before entering immersive — this keeps the
      // native <model> element source-less (and thumbnail-free) on page load.
      theatreModel.setAttribute("src", THEATRE_MODEL_SRC);
      await new Promise((r) => setTimeout(r, 50));
      await theatreModel.requestImmersive();
      console.log("requestImmersive resolved, waiting for scene...");
      // Let the compositor finish setting up the scene before we apply transform
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("requestImmersive failed:", err);
      alert("Could not enter immersive mode: " + err.message);
      // Make sure the UI doesn't get stuck in an inconsistent state
      theatreModel.removeAttribute("src");
      setNonImmersiveUI();
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

// --- "Start Video" -> play the trailer and dock it onto the tagged screen ---
// requestFullscreen() on a <video> inside an immersive environment is what
// tells visionOS Safari to dock it onto the mesh tagged as the docking
// region in the USDZ (tagged in Blender).
startVideoBtn.addEventListener("click", async function () {
  try {
    await trailerVideo.requestFullscreen();
    console.log("Requested fullscreen — video should dock onto the tagged screen.");
  } catch (err) {
    console.error("requestFullscreen failed:", err);
  }
  try {
    await trailerVideo.play();
    console.log("Video playback started.");
  } catch (err) {
    console.error("trailerVideo.play() failed:", err);
  }
});

trailerVideo.addEventListener("error", function () {
  console.error("trailerVideo failed to load:", trailerVideo.error);
});
trailerVideo.addEventListener("loadedmetadata", function () {
  console.log("trailerVideo loaded ok, duration:", trailerVideo.duration);
});

// Stop playback when the video is un-docked.
// Per Apple's own escape-room demo (WWDC26 "Explore immersive website
// environments in visionOS"), video docking on visionOS Safari goes through
// the STANDARD Fullscreen API (requestFullscreen / exitFullscreen), not the
// iOS native-player webkitbeginfullscreen/webkitendfullscreen events — those
// don't apply to this docking mechanism.
function handleFullscreenExit() {
  var fsElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (fsElement !== trailerVideo) {
    trailerVideo.pause();
    trailerVideo.currentTime = 0;
    console.log("Video un-docked — trailerVideo paused and reset.");
  }
}

const dockedVideo = document.querySelector('video');

function stopVideoCompletely() {
    if (dockedVideo && !dockedVideo.paused) {
        dockedVideo.pause();
        // Force track reload if the audio stream hangs in Safari cache
        dockedVideo.src = dockedVideo.src; 
    }
}

// Triggered when the native back button collapses the theater view
dockedVideo.addEventListener('webkitendfullscreen', stopVideoCompletely);

// Triggered if visionOS background-throttles the tab layout 
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopVideoCompletely();
    }
});


document.addEventListener("fullscreenchange", handleFullscreenExit);
document.addEventListener("webkitfullscreenchange", handleFullscreenExit);

// Also stop (and undock) when the video finishes naturally, matching
// Apple's recommended pattern for triggering what comes next.
trailerVideo.addEventListener("ended", async function () {
  try {
    if (document.fullscreenElement === trailerVideo || document.webkitFullscreenElement === trailerVideo) {
      await (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen());
    }
  } catch (err) {
    console.error("exitFullscreen on ended failed:", err);
  }
});

// Listen for immersive state changes — Apple's recommended pattern
theatreModel.addEventListener("immersivechange", async function () {
  var isImmersive = !!document.immersiveElement;
  console.log("=== IMMERSIVECHANGE ===", isImmersive, "element:", document.immersiveElement);

  if (isImmersive) {
    // Small delay ensures visionOS has a chance to initialize the scene
    await new Promise((r) => setTimeout(r, 50));

    var transform = buildImmersiveTransform();
    console.log(
      "Applying immersive transform: a=" + transform.a.toFixed(4) +
      " e=" + transform.e.toFixed(2) + " f=" + transform.f.toFixed(2)
    );
    theatreModel.entityTransform = transform;

    // Swap "Watch Reveal" for "Exit Immersive" and reveal "Start Video" once the transform has settled
    await new Promise((r) => setTimeout(r, 2000));
    setImmersiveUI();
  } else {
    setNonImmersiveUI();
    trailerVideo.pause();
    trailerVideo.currentTime = 0;
    // Drop the model source again so no AR thumbnail lingers after exiting
    theatreModel.removeAttribute("src");
    console.log("Exited immersive mode — trailerVideo paused and reset.");
  }
});
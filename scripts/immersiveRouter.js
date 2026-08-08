// immersiveRouter.js
//
// Decides what happens when someone clicks "Immersive Space" in the menu.
// There are three possible cases:
//
//   1. Device supports the SAME immersive API avpReveal.html already uses
//      (Apple's proprietary visionOS Safari <model> + requestImmersive()).
//      -> Go to avpReveal.html unchanged.
//
//   2. Device has no immersive web capability at all (the vast majority of
//      desktop/mobile browsers today).
//      -> Skip straight to the YouTube recording of the reveal.
//
//   3. Device has SOME immersive capability, but not the one avpReveal.html
//      is built for (e.g. Meta Quest Browser, Android XR / Galaxy XR Chrome,
//      Samsung Internet, Opera - all standard WebXR, not Apple's <model>
//      element). We don't have a dedicated WebXR build of the reveal yet, so
//      for now this also falls back to YouTube - but we tag it separately
//      (console + optional analytics hook) so we can tell, from real
//      traffic, whether it's worth building a proper WebXR version.

var YOUTUBE_FALLBACK_URL = "https://www.youtube.com/live/GYkq9Rgoj8E?t=4849s";

function supportsAppleModelImmersive() {
  try {
    // document.immersiveEnabled is the capability flag Apple documents for
    // this: it's supposed to be true only where requestImmersive() can
    // actually transition into a surrounding immersive space (visionOS
    // Safari), and false on macOS/iOS Safari even though those also
    // support the inline <model> element as of this year's Safari update.
    // https://developer.apple.com/videos/play/wwdc2026/320/ (7:16 - "Detect feature availability")
    var flagSaysImmersive = document.immersiveEnabled === true;

    // Defensive cross-check: this API is brand new and we've already been
    // burned once by a single signal false-positiving on macOS (the old
    // "does requestImmersive exist" check). WebXR (navigator.xr) is
    // consistently documented as visionOS-only among Apple platforms -
    // unsupported on macOS/iOS Safari - so require it to agree before we
    // trust the immersive-capable branch. If the two signals disagree,
    // fail closed (treat as NOT visionOS) rather than risk sending a
    // non-immersive visitor into avpReveal.html again.
    var hasWebXRSignal = !!navigator.xr;

    if (flagSaysImmersive && !hasWebXRSignal) {
      console.warn(
        "[immersiveRouter] document.immersiveEnabled was true but navigator.xr is absent - " +
        "signals disagree, treating this as NOT visionOS to be safe. " +
        "Worth re-checking Apple's docs/this device once this API has settled."
      );
      return false;
    }

    return flagSaysImmersive && hasWebXRSignal;
  } catch (err) {
    return false;
  }
}

function supportsStandardWebXRImmersive() {
  if (!("xr" in navigator) || !navigator.xr || typeof navigator.xr.isSessionSupported !== "function") {
    return Promise.resolve(false);
  }
  return Promise.all([
    navigator.xr.isSessionSupported("immersive-vr").catch(function () { return false; }),
    navigator.xr.isSessionSupported("immersive-ar").catch(function () { return false; })
  ]).then(function (results) {
    return results[0] || results[1];
  }).catch(function () {
    return false;
  });
}

// Placeholder hook - swap in real analytics later (e.g. gtag/plausible)
// so we can see, from actual traffic, how often case 3 happens.
function logImmersiveRouteCase(caseLabel, detail) {
  console.log("[immersiveRouter] case:", caseLabel, detail || "");
  // Example: window.plausible && window.plausible('immersive-route', { props: { case: caseLabel } });
}

async function routeImmersiveSpaceClick(event) {
  event.preventDefault();

  // Case 1: same API this page already uses - no change in behavior.
  if (supportsAppleModelImmersive()) {
    logImmersiveRouteCase("apple-model-immersive");
    window.location.href = "avpReveal.html";
    return;
  }

  // Case 3: some other immersive capability (standard WebXR), not yet
  // supported by our reveal page. Tag it distinctly, then fall back to
  // YouTube for now.
  var hasWebXR = await supportsStandardWebXRImmersive();
  if (hasWebXR) {
    logImmersiveRouteCase("webxr-immersive-unhandled", "device supports WebXR but not the Apple <model> API used by avpReveal.html");
    window.location.href = YOUTUBE_FALLBACK_URL;
    return;
  }

  // Case 2: no immersive capability of any kind.
  logImmersiveRouteCase("no-immersive-support");
  window.location.href = YOUTUBE_FALLBACK_URL;
}

document.addEventListener("DOMContentLoaded", function () {
  // Bind to every "go to the immersive reveal" link on the page - not just
  // the menu one. The timeline entry ("Shipped Apple Vision Pro.") links to
  // avpReveal.html too and was bypassing the router entirely because it had
  // no id and no listener attached to it.
  var links = document.querySelectorAll(".immersiveSpaceLink, #immersiveSpaceLink");
  links.forEach(function (link) {
    link.addEventListener("click", routeImmersiveSpaceClick);
  });
});
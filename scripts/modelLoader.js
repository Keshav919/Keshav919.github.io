// modelLoader.js
// Handles loading state, spinner, and retry for <model> elements
// Strategy: fallback image is always visible by default.
// Spinner overlays on top while loading.
// On success: model renders and fallback hides.
// On error: spinner hides, retry button appears over fallback.
// On unsupported browser: fallback stays visible, no spinner.

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("model[data-loader]").forEach(function (modelEl) {
        const wrapperId = modelEl.getAttribute("data-loader");
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) return;

        const spinner = wrapper.querySelector(".model-spinner");
        const retryBtn = wrapper.querySelector(".model-retry");
        const fallback = modelEl.querySelector(".ModelFallback");

        function showSpinner() {
            if (spinner) spinner.style.display = "flex";
            if (retryBtn) retryBtn.style.display = "none";
        }

        function hideSpinner() {
            if (spinner) spinner.style.display = "none";
        }

        function showRetry() {
            hideSpinner();
            if (retryBtn) retryBtn.style.display = "flex";
        }

        function loadModel() {
            // Browser doesn't support <model> — leave fallback visible, do nothing
            if (!window.HTMLModelElement) {
                return;
            }

            showSpinner();

            modelEl.ready
                .then(function () {
                    hideSpinner();
                    // Model loaded successfully — hide the fallback image
                    if (fallback) fallback.style.display = "none";
                })
                .catch(function () {
                    showRetry();
                    // Keep fallback visible on error
                });
        }

        // Wire up retry button
        if (retryBtn) {
            retryBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const src = modelEl.getAttribute("src");
                modelEl.removeAttribute("src");
                setTimeout(function () { modelEl.setAttribute("src", src); }, 50);
                loadModel();
            });
        }

        loadModel();
    });
});

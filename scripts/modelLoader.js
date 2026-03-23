// modelLoader.js
// Handles loading state, spinner, retry, and auto-scaling for <model> elements.
// Strategy: fallback image is always visible by default.
// Spinner overlays on top while loading.
// On success: model renders, fallback hides, model is scaled to fit the container.
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

        // Scale the model so it fits inside the container without clipping.
        function fitModelToContainer() {
            try {
                // Debug: log what's actually available on the model element
                console.log("modelLoader: entityBoundingBox=", modelEl.entityBoundingBox,
                    "entityTransform=", modelEl.entityTransform,
                    "availableProps=", Object.getOwnPropertyNames(Object.getPrototypeOf(modelEl)).join(", "));

                if (!modelEl.entityBoundingBox || !modelEl.entityTransform) {
                    console.warn("modelLoader: entityBoundingBox or entityTransform not available");
                    return;
                }

                const box = modelEl.entityBoundingBox;
                const fullW = box.x * 2;
                const fullH = box.y * 2;
                const fullD = box.z * 2;
                const maxDim = Math.max(fullW, fullH, fullD);
                if (!maxDim) {
                    console.warn("modelLoader: maxDim is 0, skipping scale");
                    return;
                }

                const containerRect = wrapper.getBoundingClientRect();
                const containerSize = Math.min(containerRect.width, containerRect.height);
                if (!containerSize) {
                    console.warn("modelLoader: container has no size");
                    return;
                }

                const targetSize = containerSize * 0.85;
                const scale = targetSize / maxDim;

                console.log("modelLoader: box", fullW, fullH, fullD, "container", containerRect.width, containerRect.height, "scale", scale);

                modelEl.entityTransform = new DOMMatrix([
                    scale, 0, 0, 0,
                    0, scale, 0, 0,
                    0, 0, scale, 0,
                    0, 0, 0, 1
                ]);
            } catch (e) {
                console.warn("modelLoader: auto-scale failed", e);
            }
        }

        function loadModel() {
            // Browser doesn't support <model> — leave fallback visible, do nothing
            if (!window.HTMLModelElement) {
                return;
            }

            showSpinner();

            modelEl.ready
                .then(function () {
                    loaded = true;
                    console.log("modelLoader: model.ready resolved");
                    hideSpinner();
                    if (fallback) fallback.style.display = "none";

                    // Retry fitting with increasing delays — entityBoundingBox
                    // may not be populated immediately after ready resolves
                    [150, 500, 1000, 2000].forEach(function (delay) {
                        setTimeout(function () {
                            console.log("modelLoader: fit attempt at", delay, "ms");
                            fitModelToContainer();
                        }, delay);
                    });

                    if (window.ResizeObserver) {
                        const ro = new ResizeObserver(function () {
                            console.log("modelLoader: ResizeObserver fired");
                            fitModelToContainer();
                        });
                        ro.observe(wrapper);
                    }

                    window.addEventListener("resize", function () {
                        console.log("modelLoader: window resize fired");
                        fitModelToContainer();
                    });
                })
                .catch(function (e) {
                    console.warn("modelLoader: model.ready rejected", e);
                    showRetry();
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

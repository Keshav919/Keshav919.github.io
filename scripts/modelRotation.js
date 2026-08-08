// modelRotation.js
// Once model has loaded up we want to spin it at a constant rate
document.addEventListener("DOMContentLoaded", function () {
    function spinModel() {
        if (!window.HTMLModelElement) {
            return;
        }
        const modelEl = document.getElementById("SpinnableModel");

        modelEl.ready
            .then(function () {
                const matrix = modelEl.entityTransform; // DOMMatrixReadOnly
                const newMatrix = matrix.rotateAxisAngle(0, 1, 0, 0.125); // Aix, degree (y axis, 0.125 degrees)
                modelEl.entityTransform = newMatrix;
                setTimeout(spinModel, 50)
            })
    }

    spinModel();
});
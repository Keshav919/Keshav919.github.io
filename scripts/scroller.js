function smoothScroll(targetY, duration) {
    const startY = window.scrollY;
    const startTime = performance.now();
  
    function scroll(currentTime) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Ensure progress doesn't exceed 1
      window.scrollTo(0, startY + (targetY - startY) * progress);
  
      if (timeElapsed < duration) {
        requestAnimationFrame(scroll);
      }
    }
  
    requestAnimationFrame(scroll);
}
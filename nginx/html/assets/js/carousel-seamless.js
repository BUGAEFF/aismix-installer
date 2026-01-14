// ===================================================================
// SEAMLESS INFINITE CAROUSEL - JavaScript version
// TRUE smooth loop without any jump
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
  
  const topTrack = document.querySelector('.logos-track--top');
  const bottomTrack = document.querySelector('.logos-track--bottom');
  
  if (!topTrack || !bottomTrack) {
    console.error('Carousel tracks not found');
    return;
  }
  
  // ===================================================================
  // SEAMLESS SCROLL FUNCTION
  // ===================================================================
  
  function initSeamlessScroll(track, direction = 'left', speed = 50) {
    
    const allItems = Array.from(track.children);
    const totalItems = allItems.length; // Should be 24 (3 sets of 8)
    const itemsPerSet = totalItems / 3; // Should be 8
    
    let oneSetWidth = 0;
    let position = 0;
    let isPaused = false;
    let animationId = null;
    
    // Function to calculate current set width
    function calculateSetWidth() {
      let width = 0;
      
      // Sum widths of first set items
      for (let i = 0; i < itemsPerSet; i++) {
        width += allItems[i].offsetWidth;
      }
      
      // Add gap widths between items in one set
      const computedStyle = window.getComputedStyle(track);
      const gap = parseFloat(computedStyle.gap) || 0;
      width += gap * (itemsPerSet - 1);
      
      // Add one final gap after the last item of the set
      width += gap;
      
      return width;
    }
    
    // Initialize
    function initialize() {
      oneSetWidth = calculateSetWidth();
      position = -oneSetWidth; // Start from middle
      track.style.transform = `translateX(${position}px)`;
      console.log(`Track ${direction}: One set width = ${oneSetWidth}px, Total items = ${totalItems}`);
    }
    
    initialize();
    
    // Pause on hover
    const container = track.closest('.logos-carousel');
    container.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    
    container.addEventListener('mouseleave', () => {
      isPaused = false;
    });
    
    // Recalculate on window resize with debounce
    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log('Window resized, recalculating carousel dimensions...');
        initialize();
      }, 250); // Debounce 250ms
    }
    
    window.addEventListener('resize', handleResize);
    
    // Main animation loop
    function animate() {
      if (!isPaused) {
        
        if (direction === 'left') {
          // Move left
          position -= speed / 60; // Normalize for ~60fps
          
          // When we've scrolled past TWO sets, reset to ONE set
          if (position <= -oneSetWidth * 2) {
            position = -oneSetWidth;
          }
        } else {
          // Move right
          position += speed / 60;
          
          // When we've scrolled back to zero, reset to ONE set
          if (position >= 0) {
            position = -oneSetWidth;
          }
        }
        
        track.style.transform = `translateX(${position}px)`;
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Return cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }
  
  // ===================================================================
  // INITIALIZE BOTH TRACKS
  // ===================================================================
  
  // Top track - scroll left at 50px per second
  const cleanupTop = initSeamlessScroll(topTrack, 'left', 50);
  
  // Bottom track - scroll right at 55px per second (slightly different speed)
  const cleanupBottom = initSeamlessScroll(bottomTrack, 'right', 55);
  
  // Optional: cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cleanupTop();
    cleanupBottom();
  });
  
  console.log('✅ Seamless infinite carousel initialized');
});

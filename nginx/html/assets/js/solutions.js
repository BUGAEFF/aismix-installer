// ===================================================
// SOLUTIONS FILTER FUNCTIONALITY
// Used on: /solutions/index.html
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Get all filter buttons and solution cards
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.solution-indexcard');
  
  // Add click event to each filter button
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      
      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter cards based on selected category
      cards.forEach(card => {
        // Custom card is always visible
        if (card.classList.contains('custom-card')) {
          card.style.display = 'block';
        } 
        // Show only cards matching the selected category
        else if (card.dataset.category === category) {
          card.style.display = 'block';
        } 
        // Hide cards that don't match
        else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Don't auto-filter on load - show all cards initially
  // User clicks a button to filter
  
});

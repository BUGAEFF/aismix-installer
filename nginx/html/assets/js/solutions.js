// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.solution-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    cards.forEach(card => {
      if (card.classList.contains('custom-card')) {
        card.style.display = 'block';
      } else if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

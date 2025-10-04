ScrollReveal().reveal('.project-card', { delay: 200, origin: 'bottom', distance: '20px' });
document.getElementById('filter').addEventListener('change', function(e) {
  const value = e.target.value;
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = (value === 'all' || card.classList.contains(value)) ? 'block' : 'none';
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("dark-mode-toggle");
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});



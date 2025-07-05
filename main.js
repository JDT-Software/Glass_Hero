document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  function toggleMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('nav-blur', navLinks.classList.contains('active'));
  }

  // Toggle menu on hamburger click
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  

  // Smooth scroll and close menu on nav link click
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

      // Close the menu after navigating
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
      document.body.classList.remove('nav-blur');
    });
  });

  // Close menu if clicking outside nav or hamburger
  document.addEventListener('click', event => {
    if (
      navLinks.classList.contains('active') &&
      !navLinks.contains(event.target) &&
      !hamburger.contains(event.target)
    ) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
      document.body.classList.remove('nav-blur');
    }
  });
});

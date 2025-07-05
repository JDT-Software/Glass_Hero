document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.nav-links');

  function toggleMenu() {
    nav.classList.toggle('active');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('nav-blur', nav.classList.contains('active'));
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu on nav link click & smooth scroll
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      nav.classList.remove('active');
      hamburger.classList.remove('open');
      document.body.classList.remove('nav-blur');
    });
  });

  // Close menu if clicking outside nav or hamburger
  document.addEventListener('click', e => {
    if (
      nav.classList.contains('active') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      nav.classList.remove('active');
      hamburger.classList.remove('open');
      document.body.classList.remove('nav-blur');
    }
  });
});

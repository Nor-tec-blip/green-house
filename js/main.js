// Inject footer component
async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(file);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn('Gagal memuat komponen:', file, e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('footer-placeholder', 'components/footer.html');

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

// Dark mode toggle
const darkBtn = document.createElement('button');
darkBtn.innerHTML = '🌙';
darkBtn.title = 'Toggle Dark Mode';
darkBtn.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:999; width:48px; height:48px; border-radius:50%; border:none; background:#4f46e5; color:#fff; font-size:20px; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,.3);';
document.body.appendChild(darkBtn);

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  darkBtn.innerHTML = '☀️';
}

darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkBtn.innerHTML = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
});

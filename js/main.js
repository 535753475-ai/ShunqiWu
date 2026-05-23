// 导航栏滚动效果
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);

// 移动端菜单
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', function() {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// 点击导航链接后关闭菜单
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Intersection Observer — 滚动淡入动画
var revealElements = document.querySelectorAll('.card, .project-card, .about-grid, .contact-item, .section-title, .gallery-item');
revealElements.forEach(function(el) { el.classList.add('reveal'); });

var observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

revealElements.forEach(function(el) { observer.observe(el); });

// 图片轮播切换
function switchGallery(btn, direction) {
  var container = btn.parentElement;
  var imgs = container.querySelectorAll('.gallery-img');
  var dots = container.querySelectorAll('.gallery-dot');
  var activeIdx = -1;
  for (var i = 0; i < imgs.length; i++) {
    if (imgs[i].classList.contains('active')) { activeIdx = i; break; }
  }
  if (activeIdx === -1) return;

  imgs[activeIdx].classList.remove('active');
  imgs[activeIdx].style.display = 'none';
  if (dots[activeIdx]) {
    dots[activeIdx].classList.remove('active');
  }

  var newIdx = (activeIdx + direction + imgs.length) % imgs.length;

  imgs[newIdx].classList.add('active');
  imgs[newIdx].style.display = 'block';
  if (dots[newIdx]) {
    dots[newIdx].classList.add('active');
  }
}

// Lightbox
function openLightbox(src, caption) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = caption;
  cap.textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

// ESC 关闭 lightbox
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// 触摸滑动切换
var touchStartX = 0;
var touchStartY = 0;

document.addEventListener('touchstart', function(e) {
  var gallery = e.target.closest('.card-gallery');
  if (!gallery) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  var gallery = e.target.closest('.card-gallery');
  if (!gallery) return;
  var dx = (e.changedTouches[0] ? e.changedTouches[0].clientX : 0) - touchStartX;
  var dy = (e.changedTouches[0] ? e.changedTouches[0].clientY : 0) - touchStartY;
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
  e.preventDefault();
  var btn = gallery.querySelector('.gallery-btn');
  if (btn) switchGallery(btn, dx < 0 ? 1 : -1);
});

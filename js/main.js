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

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// 点击导航链接后关闭菜单
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Intersection Observer — 滚动淡入动画
const revealElements = document.querySelectorAll(
  '.skill-card, .project-card, .about-grid, .contact-item, .section-title'
);

// 为卡片添加 delay 类
revealElements.forEach((el, i) => {
  if (el.classList.contains('skill-card') || el.classList.contains('project-card')) {
    el.classList.add('reveal');
    // 同行卡片同步出现（每行最多3个，所以用 mod 3）
    const delayClass = 'reveal-delay-' + ((i % 3) + 1);
    el.classList.add(delayClass);
  } else if (el.classList.contains('contact-item')) {
    el.classList.add('reveal');
    el.classList.add('reveal-delay-' + ((i % 4) + 1));
  } else {
    el.classList.add('reveal');
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => observer.observe(el));

// 平滑滚动兼容（针对不支持 scroll-behavior 的浏览器）
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 工法证书图片切换
function switchGallery(btn, direction) {
  doSwitchGallery(btn.parentElement, direction);
}

function doSwitchGallery(container, direction) {
  const imgs = container.querySelectorAll('.gallery-img');
  const dots = container.querySelectorAll('.gallery-dot');
  const activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
  if (activeIdx === -1) return;
  imgs[activeIdx].classList.remove('active');
  imgs[activeIdx].style.display = 'none';
  dots[activeIdx].classList.remove('active');
  dots[activeIdx].style.background = 'rgba(255,255,255,0.6)';
  const newIdx = (activeIdx + direction + imgs.length) % imgs.length;
  imgs[newIdx].classList.add('active');
  imgs[newIdx].style.display = 'block';
  dots[newIdx].classList.add('active');
  dots[newIdx].style.background = '#FFB800';
}

// PDF 页面切换
function switchPdfGallery(btn, direction) {
  const container = btn.parentElement;
  const pages = container.querySelectorAll('.gallery-pdf');
  const dots = container.querySelectorAll('.pdf-dot');
  const activeIdx = Array.from(pages).findIndex(p => p.classList.contains('active'));
  if (activeIdx === -1) return;
  pages[activeIdx].classList.remove('active');
  pages[activeIdx].style.display = 'none';
  dots[activeIdx].classList.remove('active');
  dots[activeIdx].style.background = 'rgba(255,255,255,0.6)';
  const newIdx = (activeIdx + direction + pages.length) % pages.length;
  pages[newIdx].classList.add('active');
  pages[newIdx].style.display = 'block';
  dots[newIdx].classList.add('active');
  dots[newIdx].style.background = '#FFB800';
}

// 鼠标滚轮 + 键盘切换
document.addEventListener('wheel', function(e) {
  const gallery = e.target.closest('.project-image');
  if (!gallery) return;
  if (gallery.querySelector('.gallery-img')) {
    e.preventDefault();
    doSwitchGallery(gallery, e.deltaY > 0 ? 1 : -1);
  } else if (gallery.querySelector('.gallery-pdf')) {
    e.preventDefault();
    const pages = gallery.querySelectorAll('.gallery-pdf');
    const activeIdx = Array.from(pages).findIndex(p => p.classList.contains('active'));
    if (activeIdx === -1) return;
    // Simulate button click for PDF gallery
    switchPdfGallery(gallery.querySelector('.gallery-btn'), e.deltaY > 0 ? 1 : -1);
  }
}, { passive: false });

document.addEventListener('keydown', function(e) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const hovered = document.querySelector(':hover');
  if (!hovered) return;
  const gallery = hovered.closest('.project-image');
  if (!gallery) return;
  e.preventDefault();
  if (gallery.querySelector('.gallery-img')) {
    doSwitchGallery(gallery, e.key === 'ArrowRight' ? 1 : -1);
  } else if (gallery.querySelector('.gallery-pdf')) {
    switchPdfGallery(gallery.querySelector('.gallery-btn'), e.key === 'ArrowRight' ? 1 : -1);
  }
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));

// ── HAMBURGER MENU ──
function toggleMenu() {
  const navLinksEl = document.getElementById('navLinks');
  navLinksEl.classList.toggle('open');
}

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ── LOGIN MODAL ──
function openLoginModal() {
  document.getElementById('loginModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal(event) {
  if (!event || event.target === document.getElementById('loginModal')) {
    document.getElementById('loginModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLoginModal();
});

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  closeLoginModal();
  showToast(`Welcome back! Signed in as ${email}`);
}

// ── CONTACT FORM ──
function handleContact(e) {
  e.preventDefault();
  e.target.reset();
  showToast('Message sent! We\'ll get back to you within 24 hours.');
}

// ── SCROLL TO TOP ──
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── TOAST NOTIFICATION ──
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── ENROLL / BOOK BUTTONS ──
document.querySelectorAll('.btn-course').forEach(btn => {
  btn.addEventListener('click', function () {
    const courseName = this.closest('.course-card').querySelector('h3').textContent;
    showToast(`Enrolling in "${courseName}"... Redirecting to checkout.`);
  });
});

// ── CHATBOT ──
const chatResponses = {
  courses: {
    keywords: ['course', 'learn', 'study', 'curriculum', 'enroll', 'class', 'training', 'stack', 'full stack', 'cloud', 'devops', 'ai', 'data', 'security', 'mobile'],
    reply: `We offer 6 career-focused courses: 🖥️ <b>Full Stack Development</b> ($199), ☁️ <b>Cloud & DevOps</b> ($179), 🤖 <b>AI & Machine Learning</b> ($219), 📊 <b>Data Science</b> ($189), 🛡️ <b>Cybersecurity</b> ($199), and 📱 <b>Mobile Development</b> ($169). All include lifetime access and a certificate! <a href="#courses" style="color:var(--red)">Browse Courses →</a>`
  },
  interview: {
    keywords: ['mock', 'interview', 'practice', 'job', 'prepare', 'prep', 'hire', 'hiring'],
    reply: `Our Mock Interviews are conducted by senior engineers! 🎤<br><br>💼 <b>Single Interview</b> — $15<br>📦 <b>Bundle (5 interviews)</b> — $50<br>♾️ <b>Monthly Unlimited</b> — $89<br><br>Each session includes detailed feedback & KPI reports. <a href="#mock-interview" style="color:var(--red)">Book Now →</a>`
  },
  evaluator: {
    keywords: ['evaluator', 'assessment', 'test', 'exam', 'quiz', 'grade', 'kpi', 'adjudicator', 'lockdown'],
    reply: `The Evaluator is our AI-powered assessment tool! 🤖<br><br>✅ Randomized question sets per student<br>✅ Lockdown mode with tab monitoring<br>✅ AI-powered strict grading<br>✅ Detailed KPI performance reports<br><br><a href="#evaluator" style="color:var(--red)">Learn More →</a>`
  },
  pricing: {
    keywords: ['price', 'pricing', 'cost', 'pay', 'fee', 'cheap', 'expensive', 'afford', 'money', 'dollar', '$'],
    reply: `Here's a quick pricing overview 💰:<br><br>📚 Courses from <b>$169</b><br>🎤 Mock Interview from <b>$15</b><br>📦 Interview Bundle (5x) — <b>$50</b><br>♾️ Monthly Unlimited — <b>$89</b><br><br>All courses include lifetime access & certification!`
  },
  contact: {
    keywords: ['contact', 'email', 'support', 'help', 'reach', 'talk', 'speak', 'message', 'question'],
    reply: `You can reach us anytime! 📬<br><br>📧 <b>hello@nextstacktech.com</b><br>🕒 Support hours: Mon–Fri, 9am–6pm EST<br><br>Or use our <a href="#contact" style="color:var(--red)">Contact Form →</a>`
  },
  certificate: {
    keywords: ['certif', 'certificate', 'certification', 'badge', 'credential'],
    reply: `Yes! 🎓 Every NextStack course includes an <b>industry-recognized certificate</b> upon completion. Certificates are shareable on LinkedIn and are trusted by top employers worldwide.`
  },
  hello: {
    keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings', 'good morning', 'good evening', 'sup'],
    reply: `Hey there! 👋 Welcome to <b>NextStack</b>! I'm here to help you with:<br><br>📚 Courses &amp; pricing<br>🎤 Mock Interview booking<br>🤖 The Evaluator (AI assessment)<br>📞 Getting in touch<br><br>What would you like to know?`
  },
  default: `I'm not sure about that, but I'd love to help! Try asking about our 📚 <b>Courses</b>, 🎤 <b>Mock Interviews</b>, 💰 <b>Pricing</b>, or 📞 <b>Contact</b>. You can also email us at <b style="color:var(--red)">hello@nextstacktech.com</b>`
};

function getChatReply(input) {
  const lower = input.toLowerCase();
  for (const key of Object.keys(chatResponses)) {
    if (key === 'default') continue;
    if (chatResponses[key].keywords.some(kw => lower.includes(kw))) {
      return chatResponses[key].reply;
    }
  }
  return chatResponses.default;
}

function toggleChat() {
  const win = document.getElementById('chatWindow');
  const unread = document.getElementById('chatUnread');
  const icon = document.getElementById('chatLauncherIcon');
  win.classList.toggle('open');
  if (win.classList.contains('open')) {
    unread.classList.add('hidden');
    icon.innerHTML = '&#10005;';
    document.getElementById('chatInput').focus();
    scrollChatToBottom();
  } else {
    icon.innerHTML = '&#128172;';
  }
}

function scrollChatToBottom() {
  const msgs = document.getElementById('chatMessages');
  setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
}

function getChatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(text, sender) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.innerHTML = `<div class="chat-bubble">${text}</div><span class="chat-time">${getChatTime()}</span>`;
  msgs.appendChild(div);
  scrollChatToBottom();
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(typing);
  scrollChatToBottom();
  return typing;
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  // Remove suggestions if still visible
  const suggestions = document.querySelector('.chat-suggestions');
  if (suggestions) suggestions.remove();

  appendMessage(text, 'user');
  const typing = showTyping();

  setTimeout(() => {
    typing.remove();
    const reply = getChatReply(text);
    appendMessage(reply, 'bot');
  }, 900 + Math.random() * 400);
}

function sendSuggestion(btn) {
  const text = btn.textContent.replace(/[^a-zA-Z ]/g, '').trim();
  document.getElementById('chatInput').value = text;
  sendChatMessage();
}

function chatKeyDown(e) {
  if (e.key === 'Enter') sendChatMessage();
}

// ── SCROLL REVEAL ANIMATION ──
const revealElements = document.querySelectorAll(
  '.course-card, .about-card, .eval-feature-card, .mock-feature, .trust-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

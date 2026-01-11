/**
 * AISMIX Contact Form Handler
 * Protected contact form with n8n integration
 * Anti-spam: Honeypot + Time-based + Email validation + Rate limiting
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    // Твой n8n webhook URL (замени на свой!)
    webhookURL: 'https://n8n.yourdomain.com/webhook/contact-form',
    
    // Минимальное время заполнения формы (в секундах)
    minFillTime: 3,
    
    // Rate limiting (кол-во попыток за период)
    rateLimit: {
      maxAttempts: 3,
      periodMinutes: 60
    },
    
    // Google reCAPTCHA v3 site key (получи на google.com/recaptcha)
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY'
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const honeypot = document.getElementById('website');
  const timestampInput = document.getElementById('formTimestamp');
  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('formStatus');

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    if (!form) {
      console.error('Contact form not found');
      return;
    }

    // Установить timestamp при загрузке
    timestampInput.value = Date.now();

    // Обработчик отправки формы
    form.addEventListener('submit', handleSubmit);

    // Валидация в реальном времени
    emailInput.addEventListener('blur', validateEmailField);
    
    console.log('✅ Contact form initialized');
  }

  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  async function handleSubmit(e) {
    e.preventDefault();

    // Очистить предыдущие сообщения
    clearStatus();

    // Валидация всех защит
    const validationResult = validateForm();
    if (!validationResult.valid) {
      showStatus(validationResult.message, 'error');
      return;
    }

    // Показать загрузку
    setLoading(true);

    try {
      // Собрать данные формы
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        language: navigator.language
      };

      // Отправить в n8n webhook
      const response = await fetch(CONFIG.webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Успешная отправка
      showStatus('✅ Message sent successfully! We\'ll respond within 24 hours.', 'success');
      form.reset();
      timestampInput.value = Date.now(); // Сбросить timestamp

      // Сохранить попытку отправки для rate limiting
      saveSubmitAttempt();

    } catch (error) {
      console.error('Form submission error:', error);
      showStatus('❌ Error sending message. Please try again or email us directly at contact@aismix.com', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // VALIDATION
  // ============================================
  function validateForm() {
    // 1. Проверка honeypot (должно быть пустым)
    if (honeypot.value !== '') {
      console.warn('🤖 Bot detected: honeypot filled');
      return { valid: false, message: 'Spam detected' };
    }

    // 2. Проверка времени заполнения (защита от автоматических ботов)
    const formTimestamp = parseInt(timestampInput.value);
    const currentTime = Date.now();
    const fillTime = (currentTime - formTimestamp) / 1000; // в секундах

    if (fillTime < CONFIG.minFillTime) {
      console.warn(`⚡ Form filled too quickly: ${fillTime}s`);
      return { 
        valid: false, 
        message: 'Please take your time filling the form' 
      };
    }

    // 3. Проверка rate limiting
    if (isRateLimited()) {
      return { 
        valid: false, 
        message: 'Too many submissions. Please try again later.' 
      };
    }

    // 4. Валидация имени
    const name = nameInput.value.trim();
    if (name.length < 2) {
      return { valid: false, message: 'Please enter your name' };
    }

    // 5. Валидация email
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    // 6. Валидация сообщения
    const message = messageInput.value.trim();
    if (message.length < 10) {
      return { 
        valid: false, 
        message: 'Please enter a message (at least 10 characters)' 
      };
    }

    return { valid: true };
  }

  // ============================================
  // EMAIL VALIDATION
  // ============================================
  function isValidEmail(email) {
    // RFC 5322 compliant regex (упрощенная версия)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Базовая проверка
    if (!emailRegex.test(email)) {
      return false;
    }

    // Дополнительные проверки
    const [localPart, domain] = email.split('@');
    
    // Проверка локальной части
    if (localPart.length > 64) return false;
    
    // Проверка домена
    if (domain.length > 255) return false;
    
    // Проверка на подозрительные паттерны
    const suspiciousPatterns = [
      /\.{2,}/, // Две точки подряд
      /^\./, // Начинается с точки
      /\.$/, // Заканчивается точкой
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return false;
    }

    return true;
  }

  function validateEmailField() {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
      emailInput.setCustomValidity('Please enter a valid email address');
      emailInput.reportValidity();
    } else {
      emailInput.setCustomValidity('');
    }
  }

  // ============================================
  // RATE LIMITING
  // ============================================
  function isRateLimited() {
    const attempts = getSubmitAttempts();
    const now = Date.now();
    const periodMs = CONFIG.rateLimit.periodMinutes * 60 * 1000;

    // Фильтровать попытки за последний период
    const recentAttempts = attempts.filter(timestamp => {
      return now - timestamp < periodMs;
    });

    // Обновить список попыток
    saveSubmitAttempts(recentAttempts);

    return recentAttempts.length >= CONFIG.rateLimit.maxAttempts;
  }

  function getSubmitAttempts() {
    try {
      const stored = localStorage.getItem('contactFormAttempts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSubmitAttempts(attempts) {
    try {
      localStorage.setItem('contactFormAttempts', JSON.stringify(attempts));
    } catch (e) {
      console.warn('Could not save submit attempts:', e);
    }
  }

  function saveSubmitAttempt() {
    const attempts = getSubmitAttempts();
    attempts.push(Date.now());
    saveSubmitAttempts(attempts);
  }

  // ============================================
  // UI HELPERS
  // ============================================
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `form-status form-status--${type}`;
    statusDiv.style.display = 'block';

    // Автоматически скрыть через 10 секунд
    setTimeout(() => {
      if (type === 'success') {
        clearStatus();
      }
    }, 10000);
  }

  function clearStatus() {
    statusDiv.textContent = '';
    statusDiv.className = 'form-status';
    statusDiv.style.display = 'none';
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending...' : 'Send Message';
    
    if (isLoading) {
      submitBtn.classList.add('btn-loading');
    } else {
      submitBtn.classList.remove('btn-loading');
    }
  }

  // ============================================
  // START
  // ============================================
  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

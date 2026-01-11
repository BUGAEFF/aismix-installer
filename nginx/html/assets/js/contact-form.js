/**
 * AISMIX Contact Form Handler
 * Protected contact form with n8n integration
 * Multi-layer spam protection: Honeypot + Time-based + Email validation + Rate limiting
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    // n8n webhook URL (replace with your actual webhook URL)
    webhookURL: 'https://appix1.aismix.com/webhook/contact-form',
    
    // API Key for webhook protection (CHANGE THIS!)
    apiKey: 'aismix_contact_form_secret_key_2025',
    
    // Minimum form fill time in seconds (anti-bot)
    minFillTime: 3,
    
    // Rate limiting
    rateLimit: {
      maxAttempts: 3,
      periodMinutes: 60
    }
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

    // Set timestamp on load
    timestampInput.value = Date.now();

    // Form submit handler
    form.addEventListener('submit', handleSubmit);

    // Real-time email validation
    emailInput.addEventListener('blur', validateEmailField);
    
    console.log('✅ Contact form initialized');
  }

  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  async function handleSubmit(e) {
    e.preventDefault();

    // Clear previous messages
    clearStatus();

    // Validate all protections
    const validationResult = validateForm();
    if (!validationResult.valid) {
      showStatus(validationResult.message, 'error');
      return;
    }

    // Show loading state
    setLoading(true);

    try {
      // Collect form data
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        language: navigator.language
      };

      // Send to n8n webhook
      const response = await fetch(CONFIG.webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': CONFIG.apiKey
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Success
      showStatus('✅ Message sent successfully! We\'ll respond within 24 hours.', 'success');
      form.reset();
      timestampInput.value = Date.now();

      // Save submit attempt for rate limiting
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
    // 1. Check honeypot (must be empty)
    if (honeypot.value !== '') {
      console.warn('🤖 Bot detected: honeypot filled');
      return { valid: false, message: 'Spam detected' };
    }

    // 2. Check fill time (anti-bot)
    const formTimestamp = parseInt(timestampInput.value);
    const currentTime = Date.now();
    const fillTime = (currentTime - formTimestamp) / 1000; // in seconds

    if (fillTime < CONFIG.minFillTime) {
      console.warn(`⚡ Form filled too quickly: ${fillTime}s`);
      return { 
        valid: false, 
        message: 'Please take your time filling the form' 
      };
    }

    // 3. Check rate limiting
    if (isRateLimited()) {
      return { 
        valid: false, 
        message: 'Too many submissions. Please try again later.' 
      };
    }

    // 4. Validate name
    const name = nameInput.value.trim();
    if (name.length < 2) {
      return { valid: false, message: 'Please enter your name' };
    }

    // 5. Validate email
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    // 6. Validate message
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
    // RFC 5322 compliant regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Basic check
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    const [localPart, domain] = email.split('@');
    
    // Check local part length
    if (localPart.length > 64) return false;
    
    // Check domain length
    if (domain.length > 255) return false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.{2,}/, // Two dots in a row
      /^\./, // Starts with dot
      /\.$/, // Ends with dot
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

    // Filter attempts within period
    const recentAttempts = attempts.filter(timestamp => {
      return now - timestamp < periodMs;
    });

    // Update attempts list
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

    // Auto-hide after 10 seconds
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
  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

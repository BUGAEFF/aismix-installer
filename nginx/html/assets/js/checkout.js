// Checkout page functionality for AISMIX.com
// Handles URL parameters, promo codes, payment selection, and form validation

// ============================================
// CONFIGURATION
// ============================================

// Solution names for display
const solutionNames = {
  'office': 'Office Automation',
  'video': 'Video Making Automation',
  'leads': 'Leads Generation',
  'social': 'Social Media Automation',
  'sales': 'Sales Automation',
  'email': 'Email & Documents Automation',
  'custom': 'Custom Integration'
};

// Promo codes database
// type: 'percentage' or 'fixed'
// value: discount amount (10 = 10% or $10)
const promoCodes = {
  'WELCOME10': { type: 'percentage', value: 10, description: '10% off' },
//  'SAVE20': { type: 'percentage', value: 20, description: '20% off' },
// 'FIRST500': { type: 'fixed', value: 500, description: '$500 off' },
//  'EARLY2025': { type: 'percentage', value: 15, description: '15% off' },
//  'VIP1000': { type: 'fixed', value: 1000, description: '$1000 off' }
};

// ============================================
// STATE MANAGEMENT
// ============================================

let originalPrice = 0;
let currentDiscount = 0;
let appliedPromoCode = '';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const solution = urlParams.get('solution') || 'office';
const price = urlParams.get('price') || '2499';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializePage();
  setupPromoCode();
  setupPaymentSelection();
  setupLegalCheckboxes();
  setupProceedButton();
});

function initializePage() {
  originalPrice = parseInt(price);
  
  // Insert solution name
  const solutionName = solutionNames[solution] || 'Custom Solution';
  document.querySelector('.solution-name').textContent = solutionName;
  
  // Insert original price
  document.querySelector('.original-price').textContent = '$' + originalPrice.toLocaleString();
  
  // Set initial final price
  updateFinalPrice();
}

// ============================================
// PROMO CODE FUNCTIONALITY
// ============================================

function setupPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const applyPromoBtn = document.getElementById('applyPromo');
  
  // Button click
  applyPromoBtn.addEventListener('click', applyPromoCode);
  
  // Enter key
  promoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyPromoCode();
  });
  
  // Input field styling
  promoInput.addEventListener('focus', () => {
    promoInput.style.borderColor = '#667eea';
  });
  
  promoInput.addEventListener('blur', () => {
    if (!promoInput.value) {
      promoInput.style.borderColor = '#ddd';
    }
  });
}

function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const code = promoInput.value.trim().toUpperCase();
  
  if (!code) {
    showMessage('Please enter a promo code', 'error');
    return;
  }
  
  if (promoCodes[code]) {
    const promo = promoCodes[code];
    appliedPromoCode = code;
    
    // Calculate discount
    if (promo.type === 'percentage') {
      currentDiscount = Math.round(originalPrice * promo.value / 100);
    } else {
      currentDiscount = promo.value;
    }
    
    // Ensure discount doesn't exceed price
    if (currentDiscount > originalPrice) {
      currentDiscount = originalPrice;
    }
    
    // Update UI
    document.getElementById('discountCode').textContent = code;
    document.getElementById('discountAmount').textContent = '-$' + currentDiscount.toLocaleString();
    document.getElementById('discountRow').style.display = 'flex';
    
    showMessage(`✓ Promo code applied! ${promo.description}`, 'success');
    updateFinalPrice();
    
    // Change button to "Remove"
    promoInput.disabled = true;
    const applyBtn = document.getElementById('applyPromo');
    applyBtn.textContent = 'Remove';
    applyBtn.onclick = removePromoCode;
    
  } else {
    showMessage('Invalid promo code', 'error');
  }
}

function removePromoCode() {
  appliedPromoCode = '';
  currentDiscount = 0;
  
  const promoInput = document.getElementById('promoCode');
  promoInput.value = '';
  promoInput.disabled = false;
  
  document.getElementById('discountRow').style.display = 'none';
  
  showMessage('Promo code removed', 'info');
  updateFinalPrice();
  
  // Change button back to "Apply"
  const applyBtn = document.getElementById('applyPromo');
  applyBtn.textContent = 'Apply';
  applyBtn.onclick = applyPromoCode;
}

function showMessage(text, type) {
  const colors = {
    success: '#16a34a',
    error: '#dc2626',
    info: '#2563eb'
  };
  
  const promoMessage = document.getElementById('promoMessage');
  promoMessage.textContent = text;
  promoMessage.style.color = colors[type] || colors.info;
  promoMessage.style.fontWeight = type === 'success' ? '600' : '400';
}

function updateFinalPrice() {
  const finalPrice = originalPrice - currentDiscount;
  document.querySelector('.final-price').textContent = '$' + finalPrice.toLocaleString();
}

// ============================================
// PAYMENT METHOD SELECTION
// ============================================

function setupPaymentSelection() {
  const radioButtons = document.querySelectorAll('input[name="payment"]');
  
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      // Reset all labels
      document.querySelectorAll('label').forEach(label => {
        label.style.borderColor = '#ddd';
        label.style.background = '#fff';
      });
      
      // Highlight selected
      e.target.closest('label').style.borderColor = '#667eea';
      e.target.closest('label').style.background = '#f8f9ff';
    });
  });
}

// ============================================
// LEGAL CHECKBOXES
// ============================================

function setupLegalCheckboxes() {
  const termsCheckbox = document.getElementById('terms');
  const disclaimerCheckbox = document.getElementById('disclaimer');
  
  termsCheckbox.addEventListener('change', checkFormValid);
  disclaimerCheckbox.addEventListener('change', checkFormValid);
}

function checkFormValid() {
  const termsCheckbox = document.getElementById('terms');
  const disclaimerCheckbox = document.getElementById('disclaimer');
  const proceedBtn = document.getElementById('proceedBtn');
  
  if (termsCheckbox.checked && disclaimerCheckbox.checked) {
    proceedBtn.disabled = false;
    proceedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    proceedBtn.style.cursor = 'pointer';
  } else {
    proceedBtn.disabled = true;
    proceedBtn.style.background = '#ccc';
    proceedBtn.style.cursor = 'not-allowed';
  }
}

// ============================================
// PROCEED TO PAYMENT
// ============================================

function setupProceedButton() {
  const proceedBtn = document.getElementById('proceedBtn');
  
  proceedBtn.addEventListener('click', () => {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const finalPrice = originalPrice - currentDiscount;
    
    // Build URL with all parameters including promo code if applied
    let url = `/pay/${selectedPayment}.html?solution=${solution}&price=${finalPrice}`;
    
    if (appliedPromoCode) {
      url += `&promo=${appliedPromoCode}&original=${originalPrice}&discount=${currentDiscount}`;
    }
    
    window.location.href = url;
  });
}

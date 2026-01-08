// Cookie Consent Banner Logic
(function() {
  // Create banner HTML
  const bannerHTML = `
    <div id="cookieBanner" class="cookie-banner">
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <p>
            <strong>🍪 We use cookies</strong> to improve your experience on our website. 
            By continuing to browse, you agree to our use of cookies. 
            <a href="/legal/cookies.html">Learn more</a>
          </p>
        </div>
        <div class="cookie-banner-buttons">
          <button id="acceptCookies" class="cookie-accept-btn">Accept All</button>
          <button id="declineCookies" class="cookie-decline-btn">Decline</button>
        </div>
      </div>
    </div>
  `;
  
  // Insert banner into page
  document.body.insertAdjacentHTML('beforeend', bannerHTML);
  
  // Get elements
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  
  // Check if user already made a choice
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  // Show banner if no choice was made
  if (!cookieConsent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 500); // Show after 0.5s delay
  }
  
  // Accept cookies
  acceptBtn.addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('show');
    
    // Here you can enable analytics/tracking
    console.log('Cookies accepted');
  });
  
  // Decline cookies
  declineBtn.addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'declined');
    banner.classList.remove('show');
    
    // Here you can disable analytics/tracking
    console.log('Cookies declined');
  });
})();

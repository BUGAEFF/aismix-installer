// Cookie Consent Banner Logic
(function() {
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

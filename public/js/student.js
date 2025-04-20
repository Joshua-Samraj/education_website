// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentLang = 'en';
    const translateButton = document.getElementById('translateBtn');
    const qrModal = document.getElementById("qrModal");
    const donateTrigger = document.getElementById("donateTrigger");
  
    // Hide Google Translate elements
    const hideGoogleElements = () => {
      const style = document.createElement('style');
      style.textContent = `
        .goog-te-banner-frame, 
        .goog-te-gadget-icon, 
        .goog-te-combo, 
        .goog-logo-link, 
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-text-highlight {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `;
      document.head.appendChild(style);
    };
  
    // Translation function
    const triggerTranslate = () => {
      if (!window.google || !google.translate) {
        console.log('Google Translate not loaded yet, retrying...');
        setTimeout(triggerTranslate, 100);
        return;
      }
  
      currentLang = currentLang === 'en' ? 'ta' : 'en';
      
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = currentLang;
        const event = new Event('change');
        select.dispatchEvent(event);
        
        // Update button text
        translateButton.textContent = currentLang === 'ta' ? 'Show English' : 'Translate to Tamil';
      }
    };
  
    // QR Modal functionality
    if (donateTrigger) {
      donateTrigger.addEventListener("click", function(e) {
        e.preventDefault();
        qrModal.style.display = "flex";
      });
    }
  
    const closeQR = () => {
      qrModal.style.display = "none";
    };
  
    // Initialize
    hideGoogleElements();
    
    // Set up event listeners
    if (translateButton) {
      translateButton.addEventListener('click', triggerTranslate);
    }
  
    // Make closeQR available globally for the onclick handler
    window.closeQR = closeQR;
  });
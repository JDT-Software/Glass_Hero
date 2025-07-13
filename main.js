document.addEventListener('DOMContentLoaded', function() {
  // Get elements first
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const dateInput = document.getElementById('preferred-date');
  const bookingForm = document.getElementById('booking-form');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // Toggle mobile navigation
  function toggleMobileNav() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  }

  // Close mobile navigation
  function closeMobileNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  // Open/close navigation on hamburger click
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  // Close navigation when clicking overlay
  overlay.addEventListener('click', closeMobileNav);

  // Close navigation when clicking on nav links
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        closeMobileNav();
      }
    });
  }

  // Close navigation on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Close navigation on window resize (if going back to desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileNav();
    }
  });

  // Set minimum date to today for date input
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Handle floating labels for all form fields
  const formFields = document.querySelectorAll('.form-field');
  
  formFields.forEach(field => {
    const input = field.querySelector('input, textarea, select');
    const label = field.querySelector('label');
    
    if (input && label) {
      function updateLabel() {
        if (input.value || input.type === 'date' || input === document.activeElement) {
          label.style.top = '-1px';
          label.style.transform = 'translateY(-50%)';
          label.style.fontSize = '12px';
          label.style.color = 'var(--teal)';
          label.style.fontWeight = 'bold';
        } else if (input.type !== 'date') {
          label.style.top = '50%';
          label.style.transform = 'translateY(-50%)';
          label.style.fontSize = '16px';
          label.style.color = 'var(--slate)';
          label.style.fontWeight = 'normal';
        }
      }
      
      input.addEventListener('focus', updateLabel);
      input.addEventListener('blur', updateLabel);
      input.addEventListener('input', updateLabel);
      input.addEventListener('change', updateLabel);
      
      // Initial update
      updateLabel();
    }
  });

  // Modal Functions - Define these BEFORE the form submission handler
  function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      
      // Add click outside to close
      modal.addEventListener('click', function(e) {
          if (e.target === modal) {
              closeModal();
          }
      });
    }
  }

  function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (modal) {
      if (errorMessage) {
          errorMessage.textContent = message;
      }
      
      modal.classList.add('show');
      modal.style.display = 'block';
      
      // Add click outside to close
      modal.addEventListener('click', function(e) {
          if (e.target === modal) {
              closeErrorModal();
          }
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeErrorModal();
    }
  });

  // Form submission handler - LIVE API CONNECTION
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      console.log('Form submission started');
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
      
      // Simple validation
      const requiredFields = ['name', 'phone', 'email', 'address', 'service', 'preferred-date', 'preferred-time'];
      let isValid = true;
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
          isValid = false;
          console.log(`Missing required field: ${fieldId}`);
        }
      });
      
      if (!isValid) {
        showErrorModal('Please fill in all required fields');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        return;
      }
      
      // Collect form data
      const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('countryCode').value + document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        service: document.getElementById('service').value,
        date: document.getElementById('preferred-date').value,
        time: document.getElementById('preferred-time').value,
        notes: document.getElementById('notes').value.trim() || ''
      };

      console.log('Form data collected:', formData);
      
      // Send to backend API - UPDATED TO USE LIVE URL
      try {
        console.log('Sending data to live backend...');
        
        const response = await fetch('https://glassheroes-service.onrender.com/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Success! Backend response:', result);
          
          // Show success modal
          showSuccessModal();
          
          // Reset form
          bookingForm.reset();
          
          // Reset date minimum after form reset
          if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
          }
          
          // Reset all labels
          formFields.forEach(field => {
            const input = field.querySelector('input, textarea, select');
            const label = field.querySelector('label');
            if (input && label && input.type !== 'date') {
              label.style.top = '50%';
              label.style.transform = 'translateY(-50%)';
              label.style.fontSize = '16px';
              label.style.color = 'var(--slate)';
              label.style.fontWeight = 'normal';
            }
          });
          
        } else {
          // Handle error response
          const errorData = await response.json();
          console.error('Backend error:', errorData);
          throw new Error(errorData.error || 'Failed to submit booking');
        }
        
      } catch (error) {
        console.error('Error submitting booking:', error);
        
        // Show different error messages based on error type
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          showErrorModal('Cannot connect to server. Please check your internet connection and try again.');
        } else {
          showErrorModal('Error submitting booking: ' + error.message);
        }
      } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
          if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('nav-open');
          }
      });
  });

  // Test modal function (you can remove this)
  window.testModal = function() {
      showSuccessModal();
  };

  // Make modal functions globally available for inline onclick handlers
  window.closeModal = closeModal;
  window.closeErrorModal = closeErrorModal;
});

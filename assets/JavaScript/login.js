document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
      });
    }
    
    // Form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic form validation
        if (!email || !password) {
          alert('Please fill in all fields');
          return;
        }
        
        // Here you would typically send the login data to your server
        console.log('Login attempt:', { email, password });
        
        // Simulate successful login (replace with actual authentication)
        alert('Login successful! Redirecting to dashboard...');
        
        // Redirect to dashboard or home page
        // window.location.href = 'dashboard.html';
      });
    }
    
    // Social login buttons (these would connect to respective OAuth providers)
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
      googleBtn.addEventListener('click', function() {
        alert('Google login would be initiated here');
        // Implement Google OAuth login
      });
    }
    
    if (facebookBtn) {
      facebookBtn.addEventListener('click', function() {
        alert('Facebook login would be initiated here');
        // Implement Facebook OAuth login
      });
    }
  });
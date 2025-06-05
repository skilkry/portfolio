document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
  
    // For the sign-up button (moves from sign-in to sign-up)
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });
  
    // For the sign-in button (redirects to login page when in sign-up view)
    if (signInButton) {
      signInButton.addEventListener('click', () => {
        // Check if we're currently in the sign-up view
        if (container.classList.contains('right-panel-active')) {
          // Redirect to login page
          window.location.href = "login.html"; // Change this to your actual login page URL
        } else {
          // Just in case you have a sign-in button elsewhere that should do the normal animation
          container.classList.remove("right-panel-active");
        }
      });
    } else {
      console.error("Element with ID 'signIn' not found. Please add this button to your HTML.");
    }
  });
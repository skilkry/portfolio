export function moveEyesAndSmile() {
  const userInput = document.getElementById('user-input'); // Este puede no existir en el formulario de inicio de sesión
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const showPasswordCheckbox = document.getElementById('show-password');
  
  // Verifica si los elementos existen antes de continuar
  if (!emailInput || !passwordInput || !showPasswordCheckbox) {
    console.error('Elementos necesarios para la animación no encontrados');
    return; // Sale de la función si no encuentra los elementos necesarios
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      const togglePassword = document.getElementById('toggle-password');
      const passwordInput = document.getElementById('password-input');
  
      togglePassword.addEventListener('click', () => {
          // Toggle the type attribute
          const isPasswordVisible = passwordInput.getAttribute('type') === 'text';
          passwordInput.setAttribute('type', isPasswordVisible ? 'password' : 'text');
  
          // Update the icon
          togglePassword.classList.toggle('fa-eye', isPasswordVisible);
          togglePassword.classList.toggle('fa-eye-slash', !isPasswordVisible);
      });
  });
  const leftPupil = document.getElementById('left-pupil');
  const rightPupil = document.getElementById('right-pupil');
  const mouth = document.getElementById('mouth');
  const leftHand = document.getElementById('left-hand');
  const rightHand = document.getElementById('right-hand');
  const leftArm = document.querySelector('.left-arm');
  const rightArm = document.querySelector('.right-arm');

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const invalidCharacters = ['-', '\'', '"', '!', '#', '·', '/', '&', '%', '$'];
      let emailValue = emailInput.value;

      if (invalidCharacters.some(char => emailValue.includes(char))) {
        alert('Your email cannot contain invalid characters like: ' + invalidCharacters.join(' '));

        invalidCharacters.forEach(char => {
          emailValue = emailValue.split(char).join('');
        });

        emailInput.value = emailValue;
      }
    });
  }

  // Verificar si el campo de usuario está presente en el DOM
  if (userInput) {
    userInput.addEventListener('input', () => {
      const invalidCharacters = ['@', '.', '-', ','];
      let userValue = userInput.value;

      if (invalidCharacters.some(char => userValue.includes(char))) {
        alert('Oh crap! Your username cannot contain characters like: ' + invalidCharacters.join(' '));

        invalidCharacters.forEach(char => {
          userValue = userValue.split(char).join('');
        });

        userInput.value = userValue;
      }
    });
  }

  // Configurar las transiciones CSS para movimiento suave
  const setTransitions = () => {
    const elements = [leftHand, rightHand, leftArm, rightArm];
    elements.forEach(el => {
      el.style.transition = 'transform 0.3s ease-out';
    });
  };

  // Función para mover las manos a su posición inicial (lados)
  const resetHandsPosition = () => {
    setTransitions();
    leftHand.style.transform = 'translate(-25px, 0)';
    rightHand.style.transform = 'translate(25px, 0)';
    leftArm.style.transform = 'translate(-25px, 0)';
    rightArm.style.transform = 'translate(25px, 0)';
  };

  // Función para mover las manos para tapar los ojos
  const coverEyes = () => {
    setTransitions();
    leftHand.style.transform = 'translate(25px, 0)';
    rightHand.style.transform = 'translate(-25px, 0)';
    leftArm.style.transform = 'translate(25px, 0)';
    rightArm.style.transform = 'translate(-25px, 0)';
  };

  const shouldCoverEyes = () => {
    return passwordInput === document.activeElement && !showPasswordCheckbox.checked;
  };

  const updateHandsPosition = () => {
    leftHand.style.display = 'block';
    rightHand.style.display = 'block';
    leftArm.style.display = 'block';
    rightArm.style.display = 'block';

    if (shouldCoverEyes()) {
      coverEyes();
    } else {
      resetHandsPosition();
    }
  };

  const resetPosition = () => {
    leftPupil.style.transform = 'translateX(0)';
    rightPupil.style.transform = 'translateX(0)';
    mouth.setAttribute('d', 'M40 75 Q60 78 80 75');
  };

  const getTotalInputLength = () => {
    return [userInput, emailInput, passwordInput]
      .filter(field => field !== null)
      .reduce((acc, field) => acc + (field?.value?.length || 0), 0);
  };

  const movePupils = (length) => {
    const maxMove = 6;
    const moveAmount = Math.min(length * 0.5, maxMove);
    leftPupil.style.transform = `translateX(${moveAmount}px)`;
    rightPupil.style.transform = `translateX(${moveAmount}px)`;
  };

  const updateSmile = (length) => {
    const smile = (percentage) => {
      const baseY = 78;
      const maxCurve = 12;
      return `M40 75 Q60 ${baseY + percentage * maxCurve} 80 75`;
    };

    if (length === 0) {
      mouth.setAttribute('d', 'M40 75 Q60 78 80 75');
    } else if (length <= 5) {
      mouth.setAttribute('d', smile(0.1));
    } else if (length <= 10) {
      mouth.setAttribute('d', smile(0.5));
    } else {
      mouth.setAttribute('d', smile(1));
    }
  };

  const updateEmoji = () => {
    const length = getTotalInputLength();
    resetPosition();
    movePupils(length);
    updateSmile(length);
    updateHandsPosition();
  };

  // Event listeners
  [userInput, emailInput].forEach(input => {
    if (input) {
      input.addEventListener('focus', updateEmoji);
      input.addEventListener('input', updateEmoji);
    }
  });

  if (passwordInput) {
    passwordInput.addEventListener('focus', updateEmoji);
    passwordInput.addEventListener('blur', updateEmoji);
    passwordInput.addEventListener('input', updateEmoji);
  }

  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', (e) => {
      if (passwordInput) {
        passwordInput.type = e.target.checked ? 'text' : 'password';
      }
      updateEmoji();
    });
  }

  // Inicialización
  window.addEventListener('load', () => {
    resetHandsPosition();
    updateEmoji();
  });
}


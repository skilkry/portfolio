// textAnimation.js
export function animateText() {
    const textContainer = document.getElementById('text-container-animated');
    const wordsArray = ['Code.', 'Eat.', 'Repeat.'];
    let currentIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = wordsArray[currentIndex];
        
        if (isDeleting) {
            textContainer.textContent = currentWord.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            textContainer.textContent = currentWord.substring(0, letterIndex + 1);
            letterIndex++;
        }
        
        if (!isDeleting && letterIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 1000);
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % wordsArray.length;
        }
        
        const speed = isDeleting ? 100 : 200;
        setTimeout(type, speed);
    }
    
    type();
}
  
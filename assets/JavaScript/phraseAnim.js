document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.getElementById('text-container-anim');
    const phrase = "together!";
    let i = 0;

    function write() {
        if (textContainer) {
            console.log(`Animating: ${phrase[i]}`); // Debugging line
            if (i < phrase.length) {
                textContainer.innerHTML += phrase[i];
                i++;
                setTimeout(write, 95); // 0.4 seconds per letter
            } else {
                setTimeout(() => {
                    textContainer.innerHTML = '';
                    i = 0;
                    write();
                }, 800); // 2 seconds pause before restarting
            }
        } else {
            console.error("Element with ID 'text-container-anim' not found."); // Debugging line
        }
    }

    write();
});
  
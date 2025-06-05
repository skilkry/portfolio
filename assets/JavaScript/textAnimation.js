// Función para animar el texto con efecto de escritura
export function animateText() {
    const textContainer = document.getElementById('text-container-anim');
    const phrase = "Developer by logic, designer by creativity.";
    let i = 0;

    function write() {
        if (i < phrase.length) {
            let char = phrase[i];
            if (
                (i >= phrase.indexOf("Developer") && i < phrase.indexOf("Developer") + 9) || 
                (i >= phrase.indexOf("designer") && i < phrase.indexOf("designer") + 8)
            ) {
                textContainer.innerHTML += `<span class="shiny-text">${char}</span>`;
            } else {
                textContainer.innerHTML += char;
            }
            i++;
            setTimeout(write, 150);
        } else {
            setTimeout(() => {
                textContainer.innerHTML = '';
                i = 0;
                write();
            }, 1000);
        }
    }

    // Iniciar la animación si existe el contenedor
    if (textContainer) {
        write();
    }
}
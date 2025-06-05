console.log("El archivo contact.js se ha cargado y se está ejecutando!");

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const formStatusMessages = document.getElementById('form-status-messages');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const sendButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = sendButton.innerHTML;
            sendButton.disabled = true;
            sendButton.innerHTML = 'ENVIANDO...';

            // Para pruebas locales (funciona)
            const backendUrl = ' https://f764cp49-5001.uks1.devtunnels.ms/api/contact';
            
            // Para ngrok (actualiza con la nueva URL cuando reinicies ngrok)
            // const backendUrl = 'https://TU-NUEVA-URL-NGROK.ngrok-free.app/api/contact';

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true'  // Importante para ngrok
                },
                body: formData
            })
            .then(response => {
                console.log('Status:', response.status);
                console.log('Headers:', response.headers);
                
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Verificar si hay contenido antes de parsear JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.text().then(text => {
                        console.log('Response text:', text);
                        throw new Error('Response is not JSON');
                    });
                }
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (formStatusMessages) {
                    formStatusMessages.innerHTML = `<p class="${data.status}">${data.message}</p>`;
                }

                if (data.status === 'success') {
                    contactForm.reset();
                }
            })
            .catch(error => {
                console.error('Error en el fetch:', error);
                if (formStatusMessages) {
                    formStatusMessages.innerHTML = '<p class="error">Oops! Algo salió mal al intentar enviar el mensaje. Inténtalo de nuevo.</p>';
                }
            })
            .finally(() => {
                sendButton.disabled = false;
                sendButton.innerHTML = originalButtonText;
            });
        });
    } else {
        console.warn('No se encontró el formulario con id="contact-form"');
    }
});
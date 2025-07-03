document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      subject: "Por terminar."
    };

    if (!data.name || !data.email || !data.message) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('https://portfolio-backend-ytqn.onrender.com/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Se ha enviado su mensaje\nEspere su respuesta!');
        form.reset();
      } else {
        alert('Error al enviar el mensaje.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  });
});
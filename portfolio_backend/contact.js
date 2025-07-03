document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      subject: "Formulario contacto"
    };

    if (!data.name || !data.email || !data.message) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('✅ Mensaje enviado correctamente.');
        form.reset();
      } else {
        alert('❌ Error al enviar el mensaje.');
      }
    } catch (error) {
      alert('❌ No se pudo conectar con el servidor.');
      console.error(error);
    }
  });
});

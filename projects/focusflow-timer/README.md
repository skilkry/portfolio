# FocusFlow Timer

Una aplicación web minimalista y flexible estilo Pomodoro para mejorar la concentración y la productividad, creada con HTML, CSS/Sass y JavaScript Vanilla.

## Características

- Temporizador configurable para bloques de enfoque y descansos.
- Ciclos de trabajo/descanso personalizables.
- Controles intuitivos (Start, Pause, Reset, Skip).
- Indicador visual del tiempo y modo actual.
- Notificaciones (visuales, sonoras opcionales).
- Seguimiento de ciclos completados.
- Configuración persistente usando `localStorage`.

## Estructura del Proyecto

```
focusflow-timer/
├── index.html
├── css/
│   └── main.scss
├── js/
│   ├── main.js
│   ├── timer.js
│   ├── ui.js
│   ├── notifications.js
│   └── settings.js
├── assets/
│   ├── sounds/
│   └── icons/
└── README.md
```

## Cómo usar

1.  Clona el repositorio (o descarga los archivos).
2.  Abre `index.html` en tu navegador.
3.  (Opcional) Si usas Sass, compila `css/main.scss` a `css/main.css`:
    ```bash
    sass --watch css/main.scss:css/main.css
    ```

## Desarrollo

- **HTML:** `index.html`
- **Estilos:** `css/main.scss`
- **Lógica Principal:** `js/main.js`
- **Temporizador:** `js/timer.js`
- **Interfaz:** `js/ui.js`
- **Notificaciones:** `js/notifications.js`
- **Configuración:** `js/settings.js`

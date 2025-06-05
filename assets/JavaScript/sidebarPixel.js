// Sidebar retro/pixel toggle logic
const sidebar = document.getElementById('sidebarPixel');
const toggleBtn = document.getElementById('sidebarToggle');

// Sidebar cerrado por defecto SIEMPRE
sidebar.classList.add('closed');

function toggleSidebar() {
    sidebar.classList.toggle('closed');
    document.body.classList.toggle('sidebar-open');
}

toggleBtn.addEventListener('click', toggleSidebar);

// Opcional: glitch animation on open
sidebar.addEventListener('transitionend', () => {
    if (!sidebar.classList.contains('closed')) {
        sidebar.classList.add('glitch');
        setTimeout(() => sidebar.classList.remove('glitch'), 350);
    }
});

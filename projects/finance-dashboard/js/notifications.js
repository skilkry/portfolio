// Notifications functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get notification button and create panel
    const notificationBtn = document.querySelector('.notifications');
    let notificationsPanel = null;
    
    // Sample notifications data
    const notifications = [
        {
            id: 1,
            title: 'Presupuesto excedido',
            message: 'Has excedido tu presupuesto de Comida en un 15%.',
            time: '10 minutos',
            type: 'warning'
        },
        {
            id: 2,
            title: 'Pago recibido',
            message: 'Has recibido un pago de €1,200.00 en tu cuenta.',
            time: '2 horas',
            type: 'success'
        },
        {
            id: 3,
            title: 'Factura pendiente',
            message: 'Tienes una factura de €85.00 pendiente de pago.',
            time: '1 día',
            type: 'info'
        }
    ];
    
    // Toggle notifications panel
    notificationBtn.addEventListener('click', function() {
        if (notificationsPanel) {
            document.body.removeChild(notificationsPanel);
            notificationsPanel = null;
            return;
        }
        
        // Create notifications panel
        notificationsPanel = document.createElement('div');
        notificationsPanel.className = 'notifications-panel';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'notifications-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Notificaciones';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-notifications';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(notificationsPanel);
            notificationsPanel = null;
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create notifications list
        const list = document.createElement('div');
        list.className = 'notifications-list';
        
        // Add notifications
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            
            const icon = document.createElement('div');
            icon.className = `notification-icon ${notification.type}`;
            
            let iconClass = 'fas fa-info-circle';
            if (notification.type === 'success') {
                iconClass = 'fas fa-check-circle';
            } else if (notification.type === 'warning') {
                iconClass = 'fas fa-exclamation-triangle';
            } else if (notification.type === 'danger') {
                iconClass = 'fas fa-times-circle';
            }
            
            icon.innerHTML = `<i class="${iconClass}"></i>`;
            
            const content = document.createElement('div');
            content.className = 'notification-content';
            
            content.innerHTML = `
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">Hace ${notification.time}</span>
            `;
            
            item.appendChild(icon);
            item.appendChild(content);
            list.appendChild(item);
        });
        
        // Assemble panel
        notificationsPanel.appendChild(header);
        notificationsPanel.appendChild(list);
        
        // Add to body
        document.body.appendChild(notificationsPanel);
        
        // Position panel relative to notification button
        const btnRect = notificationBtn.getBoundingClientRect();
        notificationsPanel.style.top = (btnRect.bottom + window.scrollY) + 'px';
        notificationsPanel.style.right = (window.innerWidth - btnRect.right) + 'px';
        
        // Close panel when clicking outside
        document.addEventListener('click', function closePanel(e) {
            if (!notificationsPanel) return;
            
            if (!notificationsPanel.contains(e.target) && e.target !== notificationBtn && !notificationBtn.contains(e.target)) {
                document.body.removeChild(notificationsPanel);
                notificationsPanel = null;
                document.removeEventListener('click', closePanel);
            }
        });
    });
    
    // Update notification badge
    const updateBadge = () => {
        const badge = notificationBtn.querySelector('.badge');
        if (badge) {
            badge.textContent = notifications.length;
        }
    };
    
    updateBadge();
});
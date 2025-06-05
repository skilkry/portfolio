// User profile functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get profile element
    const profileElement = document.querySelector('.profile');
    let userPanel = null;
    
    // Sample user data
    const userData = {
        name: 'Usuario Demo',
        email: 'usuario@ejemplo.com',
        role: 'Usuario Personal',
        joined: '15 de Octubre, 2023',
        avatar: './assets/default-avatar.svg'
    };
    
    // Toggle user panel
    profileElement.addEventListener('click', function() {
        if (userPanel) {
            document.body.removeChild(userPanel);
            userPanel = null;
            return;
        }
        
        // Create user panel
        userPanel = document.createElement('div');
        userPanel.className = 'user-panel';
        userPanel.innerHTML = `
            <div class="user-panel-header">
                <div class="user-avatar">
                    <img src="${userData.avatar}" alt="User Avatar">
                </div>
                <div class="user-info">
                    <h3>${userData.name}</h3>
                    <p>${userData.email}</p>
                </div>
            </div>
            <div class="user-panel-body">
                <div class="user-details">
                    <div class="detail-item">
                        <span class="label">Rol:</span>
                        <span class="value">${userData.role}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Miembro desde:</span>
                        <span class="value">${userData.joined}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="user-action-btn profile-btn">
                        <i class="fas fa-user"></i> Mi Perfil
                    </button>
                    <button class="user-action-btn settings-btn">
                        <i class="fas fa-cog"></i> Configuración
                    </button>
                    <button class="user-action-btn theme-btn">
                        <i class="fas fa-moon"></i> Modo Oscuro
                    </button>
                    <button class="user-action-btn logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(userPanel);
        
        // Position panel relative to profile element
        const profileRect = profileElement.getBoundingClientRect();
        userPanel.style.position = 'absolute';
        userPanel.style.top = (profileRect.bottom + window.scrollY) + 'px';
        userPanel.style.right = (window.innerWidth - profileRect.right) + 'px';
        userPanel.style.width = '300px';
        userPanel.style.backgroundColor = 'var(--card-background, #ffffff)';
        userPanel.style.borderRadius = 'var(--border-radius-lg, 12px)';
        userPanel.style.boxShadow = 'var(--shadow-lg, 0 8px 16px rgba(0, 0, 0, 0.15))';
        userPanel.style.zIndex = '100';
        userPanel.style.overflow = 'hidden';
        userPanel.style.animation = 'slideDown 0.3s forwards';
        
        // Style user panel header
        const header = userPanel.querySelector('.user-panel-header');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.padding = '1rem';
        header.style.borderBottom = '1px solid var(--border-color, #e9ecef)';
        
        // Style avatar
        const avatar = userPanel.querySelector('.user-avatar');
        avatar.style.width = '50px';
        avatar.style.height = '50px';
        avatar.style.borderRadius = '50%';
        avatar.style.overflow = 'hidden';
        avatar.style.marginRight = '1rem';
        
        avatar.querySelector('img').style.width = '100%';
        avatar.querySelector('img').style.height = '100%';
        avatar.querySelector('img').style.objectFit = 'cover';
        
        // Style user info
        const userInfo = userPanel.querySelector('.user-info');
        userInfo.querySelector('h3').style.margin = '0 0 0.25rem 0';
        userInfo.querySelector('h3').style.fontSize = '1.1rem';
        userInfo.querySelector('p').style.margin = '0';
        userInfo.querySelector('p').style.fontSize = '0.85rem';
        userInfo.querySelector('p').style.color = 'var(--text-secondary, #6c757d)';
        
        // Style user panel body
        const body = userPanel.querySelector('.user-panel-body');
        body.style.padding = '1rem';
        
        // Style user details
        const details = userPanel.querySelector('.user-details');
        details.style.marginBottom = '1rem';
        details.style.padding = '0.5rem';
        details.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
        details.style.borderRadius = 'var(--border-radius-md, 8px)';
        
        // Style detail items
        const detailItems = userPanel.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.marginBottom = '0.5rem';
            item.style.fontSize = '0.85rem';
            
            item.querySelector('.label').style.color = 'var(--text-secondary, #6c757d)';
            item.querySelector('.value').style.fontWeight = 'bold';
        });
        
        // Style user actions
        const actions = userPanel.querySelector('.user-actions');
        actions.style.display = 'flex';
        actions.style.flexDirection = 'column';
        actions.style.gap = '0.5rem';
        
        // Style action buttons
        const actionBtns = userPanel.querySelectorAll('.user-action-btn');
        actionBtns.forEach(btn => {
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.padding = '0.75rem';
            btn.style.backgroundColor = 'transparent';
            btn.style.border = 'none';
            btn.style.borderRadius = 'var(--border-radius-md, 8px)';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background-color 0.2s ease';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            
            btn.querySelector('i').style.marginRight = '0.75rem';
            btn.querySelector('i').style.width = '20px';
            btn.querySelector('i').style.textAlign = 'center';
            
            btn.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            });
            
            btn.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
        
        // Add theme toggle functionality
        const themeBtn = userPanel.querySelector('.theme-btn');
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                this.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function closePanel(e) {
            if (!userPanel) return;
            
            if (!userPanel.contains(e.target) && e.target !== profileElement && !profileElement.contains(e.target)) {
                document.body.removeChild(userPanel);
                userPanel = null;
                document.removeEventListener('click', closePanel);
            }
        });
    });
    
    // Update user name in profile
    const updateUserName = () => {
        const nameElement = profileElement.querySelector('span');
        if (nameElement) {
            nameElement.textContent = userData.name.split(' ')[0]; // Show only first name
        }
    };
    
    updateUserName();
});
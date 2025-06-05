// Modelo de datos
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || [
            { id: 'work', name: 'Trabajo', icon: 'fas fa-briefcase' },
            { id: 'personal', name: 'Personal', icon: 'fas fa-user' },
            { id: 'shopping', name: 'Compras', icon: 'fas fa-shopping-cart' }
        ];
        this.currentFilter = {
            category: 'all',
            priority: 'all',
            status: 'all',
            search: ''
        };
    }

    // Métodos para tareas
    addTask(task) {
        task.id = Date.now().toString();
        task.createdAt = new Date().toISOString();
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    updateTask(taskId, updatedTask) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            this.saveTasks();
            return this.tasks[index];
        }
        return null;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Métodos para categorías
    addCategory(category) {
        category.id = category.name.toLowerCase().replace(/\s+/g, '-');
        this.categories.push(category);
        this.saveCategories();
        return category;
    }

    deleteCategory(categoryId) {
        // No permitir eliminar categorías predeterminadas
        if (['work', 'personal', 'shopping'].includes(categoryId)) {
            return false;
        }
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.saveCategories();
        return true;
    }

    saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    // Métodos para filtrado
    setFilter(filterType, value) {
        this.currentFilter[filterType] = value;
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            // Filtro por categoría
            if (this.currentFilter.category !== 'all' && task.category !== this.currentFilter.category) {
                return false;
            }
            
            // Filtro por prioridad
            if (this.currentFilter.priority !== 'all' && task.priority !== this.currentFilter.priority) {
                return false;
            }
            
            // Filtro por estado
            if (this.currentFilter.status !== 'all' && task.status !== this.currentFilter.status) {
                return false;
            }
            
            // Filtro por búsqueda
            if (this.currentFilter.search && !task.title.toLowerCase().includes(this.currentFilter.search.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }
}

// Vista
class TaskView {
    constructor() {
        // Elementos del DOM para tareas
        this.taskGrid = document.getElementById('tasks-grid');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskModal = document.getElementById('task-modal');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.taskForm = document.getElementById('task-form');
        this.modalTitle = document.getElementById('modal-title');
        this.saveTaskBtn = document.getElementById('save-task-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        // Elementos del formulario de tareas
        this.taskTitleInput = document.getElementById('task-title');
        this.taskDescriptionInput = document.getElementById('task-description');
        this.taskCategorySelect = document.getElementById('task-category');
        this.taskPrioritySelect = document.getElementById('task-priority');
        this.taskDueDateInput = document.getElementById('task-due-date');
        this.taskStatusSelect = document.getElementById('task-status');
        
        // Elementos para filtrado
        this.searchInput = document.getElementById('search-input');
        this.filterPriority = document.getElementById('filter-priority');
        this.filterStatus = document.getElementById('filter-status');
        
        // Elementos para categorías
        this.categoryList = document.getElementById('category-list');
        this.addCategoryBtn = document.getElementById('add-category-btn');
        this.categoryModal = document.getElementById('category-modal');
        this.closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
        this.categoryForm = document.getElementById('category-form');
        this.categoryNameInput = document.getElementById('category-name');
        this.iconSelector = document.getElementById('icon-selector');
        this.categoryIconInput = document.getElementById('category-icon-input');
        this.saveCategoryBtn = document.getElementById('save-category-btn');
        this.cancelCategoryBtn = document.getElementById('cancel-category-btn');
    }

    // Métodos para renderizar tareas
    renderTasks(tasks) {
        this.taskGrid.innerHTML = '';
        
        if (tasks.length === 0) {
            this.taskGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks fa-3x"></i>
                    <p>No hay tareas que mostrar</p>
                    <p>Crea una nueva tarea para comenzar</p>
                </div>
            `;
            return;
        }
        
        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            this.taskGrid.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${task.priority}`;
        taskCard.dataset.id = task.id;
        
        // Formatear fecha
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha';
        
        taskCard.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-actions">
                    <button class="task-action-btn edit-task" data-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete-task" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="task-description">${task.description || 'Sin descripción'}</p>
            <div class="task-meta">
                <span class="task-category ${task.category}">
                    <i class="${this.getCategoryIcon(task.category)}"></i> ${this.getCategoryName(task.category)}
                </span>
                <span class="task-meta-item">
                    <i class="fas fa-calendar"></i> ${dueDate}
                </span>
            </div>
            <div class="task-status">
                <span class="status-indicator ${task.status}"></span>
                <span class="status-text">${this.getStatusText(task.status)}</span>
            </div>
        `;
        
        return taskCard;
    }

    // Métodos para renderizar categorías
    renderCategories(categories, activeCategory = 'all') {
        this.categoryList.innerHTML = `
            <li class="category ${activeCategory === 'all' ? 'active' : ''}" data-category="all">
                <i class="fas fa-list"></i> Todas
            </li>
        `;
        
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.className = `category ${activeCategory === category.id ? 'active' : ''}`;
            categoryItem.dataset.category = category.id;
            categoryItem.innerHTML = `
                <i class="${category.icon}"></i> ${category.name}
                ${!['work', 'personal', 'shopping'].includes(category.id) ? 
                    `<button class="delete-category-btn" data-id="${category.id}">
                        <i class="fas fa-times"></i>
                    </button>` : ''}
            `;
            this.categoryList.appendChild(categoryItem);
        });
        
        // Actualizar el select de categorías en el formulario
        this.updateCategorySelect(categories);
    }

    updateCategorySelect(categories) {
        this.taskCategorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            this.taskCategorySelect.appendChild(option);
        });
    }

    // Métodos para modales
    showTaskModal(task = null) {
        this.modalTitle.textContent = task ? 'Editar Tarea' : 'Nueva Tarea';
        
        if (task) {
            this.taskTitleInput.value = task.title;
            this.taskDescriptionInput.value = task.description || '';
            this.taskCategorySelect.value = task.category;
            this.taskPrioritySelect.value = task.priority;
            this.taskStatusSelect.value = task.status;
            this.taskDueDateInput.value = task.dueDate ? task.dueDate.split('T')[0] : '';
            this.taskForm.dataset.id = task.id;
        } else {
            this.taskForm.reset();
            delete this.taskForm.dataset.id;
            // Valores predeterminados
            this.taskPrioritySelect.value = 'medium';
            this.taskStatusSelect.value = 'pending';
        }
        
        this.taskModal.classList.add('active');
    }

    hideTaskModal() {
        this.taskModal.classList.remove('active');
    }

    showCategoryModal() {
        this.categoryForm.reset();
        this.categoryModal.classList.add('active');
        
        // Resetear selección de iconos
        const iconOptions = this.iconSelector.querySelectorAll('.icon-option');
        iconOptions.forEach(option => option.classList.remove('selected'));
        this.categoryIconInput.value = 'fas fa-list';
    }

    hideCategoryModal() {
        this.categoryModal.classList.remove('active');
    }

    // Métodos auxiliares
    getCategoryIcon(categoryId) {
        const category = app.taskManager.categories.find(cat => cat.id === categoryId);
        return category ? category.icon : 'fas fa-list';
    }

    getCategoryName(categoryId) {
        const category = app.taskManager.categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'in-progress': 'En progreso',
            'completed': 'Completada'
        };
        return statusMap[status] || 'Desconocido';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Controlador
class TaskController {
    constructor(taskManager, taskView) {
        this.taskManager = taskManager;
        this.taskView = taskView;
        this.init();
    }

    init() {
        // Renderizar tareas y categorías iniciales
        this.renderAll();
        
        // Event listeners para tareas
        this.taskView.addTaskBtn.addEventListener('click', () => this.taskView.showTaskModal());
        this.taskView.closeModalBtn.addEventListener('click', () => this.taskView.hideTaskModal());
        this.taskView.cancelBtn.addEventListener('click', () => this.taskView.hideTaskModal());
        
        this.taskView.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskFormSubmit();
        });
        
        // Event listeners para filtrado
        this.taskView.searchInput.addEventListener('input', () => {
            this.taskManager.setFilter('search', this.taskView.searchInput.value);
            this.renderTasks();
        });
        
        this.taskView.filterPriority.addEventListener('change', () => {
            this.taskManager.setFilter('priority', this.taskView.filterPriority.value);
            this.renderTasks();
        });
        
        this.taskView.filterStatus.addEventListener('change', () => {
            this.taskManager.setFilter('status', this.taskView.filterStatus.value);
            this.renderTasks();
        });
        
        // Event listeners para categorías
        this.taskView.categoryList.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category');
            if (categoryItem) {
                const categoryId = categoryItem.dataset.category;
                this.handleCategoryClick(categoryId);
            }
            
            const deleteBtn = e.target.closest('.delete-category-btn');
            if (deleteBtn) {
                e.stopPropagation();
                const categoryId = deleteBtn.dataset.id;
                this.handleDeleteCategory(categoryId);
            }
        });
        
        this.taskView.addCategoryBtn.addEventListener('click', () => this.taskView.showCategoryModal());
        this.taskView.closeCategoryModalBtn.addEventListener('click', () => this.taskView.hideCategoryModal());
        this.taskView.cancelCategoryBtn.addEventListener('click', () => this.taskView.hideCategoryModal());
        
        this.taskView.categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCategoryFormSubmit();
        });
        
        // Event listeners para selector de iconos
        this.taskView.iconSelector.addEventListener('click', (e) => {
            const iconOption = e.target.closest('.icon-option');
            if (iconOption) {
                const iconClass = iconOption.dataset.icon;
                this.handleIconSelect(iconOption, iconClass);
            }
        });
        
        // Event listeners para acciones en tarjetas de tareas
        this.taskView.taskGrid.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-task');
            if (editBtn) {
                const taskId = editBtn.dataset.id;
                this.handleEditTask(taskId);
            }
            
            const deleteBtn = e.target.closest('.delete-task');
            if (deleteBtn) {
                const taskId = deleteBtn.dataset.id;
                this.handleDeleteTask(taskId);
            }
        });
    }

    renderAll() {
        this.renderTasks();
        this.renderCategories();
    }

    renderTasks() {
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.taskView.renderTasks(filteredTasks);
    }

    renderCategories() {
        this.taskView.renderCategories(
            this.taskManager.categories, 
            this.taskManager.currentFilter.category
        );
    }

    handleTaskFormSubmit() {
        const taskData = {
            title: this.taskView.taskTitleInput.value,
            description: this.taskView.taskDescriptionInput.value,
            category: this.taskView.taskCategorySelect.value,
            priority: this.taskView.taskPrioritySelect.value,
            status: this.taskView.taskStatusSelect.value,
            dueDate: this.taskView.taskDueDateInput.value || null
        };
        
        const taskId = this.taskView.taskForm.dataset.id;
        
        if (taskId) {
            // Actualizar tarea existente
            this.taskManager.updateTask(taskId, taskData);
            this.taskView.showNotification('Tarea actualizada correctamente');
        } else {
            // Crear nueva tarea
            this.taskManager.addTask(taskData);
            this.taskView.showNotification('Tarea creada correctamente');
        }
        
        this.taskView.hideTaskModal();
        this.renderTasks();
    }

    handleCategoryFormSubmit() {
        const categoryData = {
            name: this.taskView.categoryNameInput.value,
            icon: this.taskView.categoryIconInput.value
        };
        
        this.taskManager.addCategory(categoryData);
        this.taskView.hideCategoryModal();
        this.renderCategories();
        this.taskView.showNotification('Categoría creada correctamente');
    }

    handleCategoryClick(categoryId) {
        this.taskManager.setFilter('category', categoryId);
        this.renderTasks();
        this.renderCategories();
    }

    handleDeleteCategory(categoryId) {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            const success = this.taskManager.deleteCategory(categoryId);
            if (success) {
                // Si la categoría eliminada era la activa, volver a 'all'
                if (this.taskManager.currentFilter.category === categoryId) {
                    this.taskManager.setFilter('category', 'all');
                }
                this.renderCategories();
                this.taskView.showNotification('Categoría eliminada correctamente');
            } else {
                this.taskView.showNotification('No se puede eliminar una categoría predeterminada', 'error');
            }
        }
    }

    handleIconSelect(iconOption, iconClass) {
        // Quitar selección anterior
        const iconOptions = this.taskView.iconSelector.querySelectorAll('.icon-option');
        iconOptions.forEach(option => option.classList.remove('selected'));
        
        // Añadir selección actual
        iconOption.classList.add('selected');
        this.taskView.categoryIconInput.value = iconClass;
    }

    handleEditTask(taskId) {
        const task = this.taskManager.getTaskById(taskId);
        if (task) {
            this.taskView.showTaskModal(task);
        }
    }

    handleDeleteTask(taskId) {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            this.taskManager.deleteTask(taskId);
            this.renderTasks();
            this.taskView.showNotification('Tarea eliminada correctamente');
        }
    }
}

// Inicialización de la aplicación
const app = {
    init() {
        this.taskManager = new TaskManager();
        this.taskView = new TaskView();
        this.taskController = new TaskController(this.taskManager, this.taskView);
        
        // Añadir estilos para notificaciones dinámicamente
        this.addNotificationStyles();
    },
    
    addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                padding: 1rem;
                z-index: 2000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left: 4px solid var(--success);
            }
            
            .notification.error {
                border-left: 4px solid var(--danger);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification.success i {
                color: var(--success);
            }
            
            .notification.error i {
                color: var(--danger);
            }
            
            .empty-state {
                grid-column: 1 / -1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                color: var(--gray-dark);
                text-align: center;
                gap: 1rem;
            }
        `;
        document.head.appendChild(style);
    }
};

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
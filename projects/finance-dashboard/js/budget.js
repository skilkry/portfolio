// Budget data array to store budget categories
let budgets = [];

// Function to add a new budget category
function addBudget(category, limit) {
  const budget = {
    id: Date.now(),
    category,
    limit: parseFloat(limit),
    spent: 0,
    percentage: 0
  };
  
  budgets.push(budget);
  saveBudgets();
  return budget;
}

// Function to delete a budget category
function deleteBudget(id) {
  budgets = budgets.filter(budget => budget.id !== id);
  saveBudgets();
}

// Function to update a budget's spent amount
function updateBudgetSpent(category, amount) {
  const budget = budgets.find(b => b.category === category);
  if (budget) {
    budget.spent = amount;
    budget.percentage = Math.round((budget.spent / budget.limit) * 100);
    saveBudgets();
  }
}

// Function to get all budgets
function getBudgets() {
  return budgets;
}

// Function to save budgets to localStorage
function saveBudgets() {
  localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Function to load budgets from localStorage
function loadBudgets() {
  const savedBudgets = localStorage.getItem('budgets');
  if (savedBudgets) {
    budgets = JSON.parse(savedBudgets);
  } else {
    // Initialize with default budgets if none exist
    budgets = [
      {
        id: 1,
        category: 'Vivienda',
        limit: 1000,
        spent: 950,
        percentage: 95
      },
      {
        id: 2,
        category: 'Comida',
        limit: 500,
        spent: 350,
        percentage: 70
      },
      {
        id: 3,
        category: 'Transporte',
        limit: 200,
        spent: 150,
        percentage: 75
      },
      {
        id: 4,
        category: 'Ocio',
        limit: 300,
        spent: 250,
        percentage: 83
      }
    ];
    saveBudgets();
  }
}

// Initialize budgets
loadBudgets();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Function to show add budget modal
function showAddBudgetModal() {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Categoría de Presupuesto</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="addBudgetForm">
          <div class="form-group">
            <label for="budgetCategory">Categoría</label>
            <select id="budgetCategory" required>
              <option value="Vivienda">Vivienda</option>
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Ocio">Ocio</option>
              <option value="Servicios">Servicios</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
              <option value="Ropa">Ropa</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="form-group">
            <label for="budgetLimit">Límite Mensual (€)</label>
            <input type="number" id="budgetLimit" step="0.01" min="0.01" required>
          </div>
          <button type="submit" class="btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal when clicking the X or outside the modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Handle form submission
  document.getElementById('addBudgetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('budgetCategory').value;
    const limit = document.getElementById('budgetLimit').value;
    
    addBudget(category, limit);
    renderBudgets();
    
    document.body.removeChild(modal);
  });
}



// Function to render budgets in the categories section
function renderBudgets() {
  const budgetCategories = document.getElementById('budgetCategories');
  if (!budgetCategories) return;
  
  budgetCategories.innerHTML = '';
  
  budgets.forEach(budget => {
    const statusClass = budget.percentage >= 90 ? 'danger' : 
                       budget.percentage >= 75 ? 'warning' : 'good';
    
    const budgetCard = document.createElement('div');
    budgetCard.className = 'category-card';
    budgetCard.innerHTML = `
      <div class="category-header">
        <h3>${budget.category}</h3>
        <div class="actions">
          <button class="delete-budget" data-id="${budget.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="budget-details">
        <div class="amount-info">
          <span class="spent">${formatCurrency(budget.spent)}</span>
          <span class="limit">de ${formatCurrency(budget.limit)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress ${statusClass}" style="width: ${budget.percentage}%"></div>
        </div>
        <div class="status ${statusClass}">${budget.percentage}% utilizado</div>
      </div>
    `;
    
    budgetCategories.appendChild(budgetCard);
    
    // Add delete event listener
    budgetCard.querySelector('.delete-budget').addEventListener('click', () => {
      deleteBudget(budget.id);
      renderBudgets();
    });
  });
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Render initial budgets
  renderBudgets();
  
  // Add event listeners for both buttons
  const newBudgetBtn = document.getElementById('newBudgetBtn');
  const addBudgetBtn = document.getElementById('addBudgetBtn');
  
  if (newBudgetBtn) {
    newBudgetBtn.addEventListener('click', showAddBudgetModal);
  }
  
  if (addBudgetBtn) {
    addBudgetBtn.addEventListener('click', showAddBudgetModal);
  }
});



// Export functions for use in other modules
export {
  addBudget,
  deleteBudget,
  updateBudgetSpent,
  getBudgets,
  loadBudgets
};
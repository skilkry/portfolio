// Transaction data array to store transaction records
let transactions = [];

// Function to add a new transaction
function addTransaction(type, description, amount, category, date) {
  const transaction = {
    id: Date.now(),
    type,
    description,
    amount: parseFloat(amount),
    category,
    date: date || new Date().toISOString().split('T')[0]
  };
  
  transactions.push(transaction);
  saveTransactions();
  return transaction;
}

// Function to delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
}

// Function to get all transactions
function getTransactions() {
  return transactions;
}

// Function to save transactions to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to load transactions from localStorage
function loadTransactions() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
}

// Function to calculate total balance
function calculateBalance() {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);
}

// Initialize transactions
loadTransactions();

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the transactions page
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  const addTransactionBtn = document.querySelector('.btn-add');
  
  if (transactionsTableBody) {
    renderTransactions();
    
    // Add event listener for the "Nueva Transacción" button
    if (addTransactionBtn) {
      addTransactionBtn.addEventListener('click', showAddTransactionModal);
    }
  }
});

// Function to render transactions in the table
function renderTransactions() {
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  if (!transactionsTableBody) return;
  
  transactionsTableBody.innerHTML = '';
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${transaction.category}</td>
      <td class="${transaction.type}">${transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</td>
      <td class="amount ${transaction.type}">${formatCurrency(transaction.amount)}</td>
      <td class="actions">
        <button class="edit" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>
        <button class="delete" data-id="${transaction.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    
    transactionsTableBody.appendChild(row);
  });
  
  // Add event listeners for edit and delete buttons
  document.querySelectorAll('.actions .delete').forEach(button => {
    button.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      deleteTransaction(id);
      renderTransactions();
    });
  });
}

// Function to show add transaction modal
function showAddTransactionModal() {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Transacción</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="addTransactionForm">
          <div class="form-group">
            <label for="transactionType">Tipo</label>
            <select id="transactionType" required>
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>
          <div class="form-group">
            <label for="transactionDescription">Descripción</label>
            <input type="text" id="transactionDescription" required>
          </div>
          <div class="form-group">
            <label for="transactionAmount">Cantidad</label>
            <input type="number" id="transactionAmount" step="0.01" min="0.01" required>
          </div>
          <div class="form-group">
            <label for="transactionCategory">Categoría</label>
            <select id="transactionCategory" required>
              <option value="Salario">Salario</option>
              <option value="Freelance">Freelance</option>
              <option value="Inversiones">Inversiones</option>
              <option value="Vivienda">Vivienda</option>
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Ocio">Ocio</option>
              <option value="Servicios">Servicios</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="form-group">
            <label for="transactionDate">Fecha</label>
            <input type="date" id="transactionDate" required>
          </div>
          <button type="submit" class="btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set default date to today
  document.getElementById('transactionDate').valueAsDate = new Date();
  
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
  document.getElementById('addTransactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('transactionDescription').value;
    const amount = document.getElementById('transactionAmount').value;
    const category = document.getElementById('transactionCategory').value;
    const date = document.getElementById('transactionDate').value;
    
    addTransaction(type, description, amount, category, date);
    renderTransactions();
    
    document.body.removeChild(modal);
  });
}

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Export functions for use in other modules
export {
  addTransaction,
  deleteTransaction,
  getTransactions,
  loadTransactions,
  calculateBalance
};

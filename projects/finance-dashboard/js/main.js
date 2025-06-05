// Import modules
import './notifications.js';
import './user.js';
import './export.js';

document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const data = {
        balance: 5800,
        income: 7500,
        expenses: 1700,
        transactions: [
            {
                id: 1,
                date: '2023-10-15',
                description: 'Salario Octubre',
                amount: 3500,
                type: 'income',
                category: 'Salario'
            },
            {
                id: 2,
                date: '2023-10-14',
                description: 'Supermercado',
                amount: 120,
                type: 'expense',
                category: 'Comida'
            },
            {
                id: 3,
                date: '2023-10-12',
                description: 'Pago Freelance',
                amount: 800,
                type: 'income',
                category: 'Freelance'
            },
            {
                id: 4,
                date: '2023-10-10',
                description: 'Alquiler',
                amount: 950,
                type: 'expense',
                category: 'Vivienda'
            },
            {
                id: 5,
                date: '2023-10-08',
                description: 'Cena restaurante',
                amount: 65,
                type: 'expense',
                category: 'Ocio'
            }
        ],
        budgets: [
            {
                category: 'Vivienda',
                limit: 1000,
                spent: 950,
                percentage: 95
            },
            {
                category: 'Comida',
                limit: 500,
                spent: 350,
                percentage: 70
            },
            {
                category: 'Transporte',
                limit: 200,
                spent: 150,
                percentage: 75
            },
            {
                category: 'Ocio',
                limit: 300,
                spent: 250,
                percentage: 83
            }
        ],
        spendingByCategory: {
            'Vivienda': 950,
            'Comida': 350,
            'Transporte': 150,
            'Ocio': 250,
            'Servicios': 0,
            'Otros': 0
        }
    };

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    // Update dashboard values
    // Update dashboard values
    function updateDashboard() {
        // Update balance, income, and expenses
        const totalBalanceElement = document.getElementById('totalBalance');
        const totalIncomeElement = document.getElementById('totalIncome');
        const totalExpensesElement = document.getElementById('totalExpenses');
        
        if (totalBalanceElement) totalBalanceElement.textContent = formatCurrency(data.balance);
        if (totalIncomeElement) totalIncomeElement.textContent = formatCurrency(data.income);
        if (totalExpensesElement) totalExpensesElement.textContent = formatCurrency(data.expenses);
    
        // Update recent transactions
        const transactionsContainer = document.getElementById('recentTransactions');
        if (transactionsContainer) {
            transactionsContainer.innerHTML = '';
    
            data.transactions.slice(0, 5).forEach(transaction => {
                const transactionEl = document.createElement('div');
                transactionEl.className = `transaction ${transaction.type}`;
                
                const date = new Date(transaction.date);
                const formattedDate = date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                
                transactionEl.innerHTML = `
                    <div class="transaction-details">
                        <h3>${transaction.description}</h3>
                        <span>${formattedDate} • ${transaction.category}</span>
                    </div>
                    <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
                `;
                
                transactionsContainer.appendChild(transactionEl);
            });
        }
    
        // Update budget progress
        const budgetContainer = document.getElementById('budgetProgress');
        if (budgetContainer) {
            budgetContainer.innerHTML = '';
    
            data.budgets.forEach(budget => {
                const budgetEl = document.createElement('div');
                budgetEl.className = 'budget-item';
                
                let statusClass = 'good';
                if (budget.percentage >= 90) {
                    statusClass = 'danger';
                } else if (budget.percentage >= 75) {
                    statusClass = 'warning';
                }
                
                budgetEl.innerHTML = `
                    <div class="budget-info">
                        <h3>${budget.category}</h3>
                        <span>${formatCurrency(budget.spent)} / ${formatCurrency(budget.limit)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress ${statusClass}" style="width: ${budget.percentage}%"></div>
                    </div>
                `;
                
                budgetContainer.appendChild(budgetEl);
            });
        }
    
        // Create charts only if we're on the dashboard page
        if (document.getElementById('incomeChart') && 
            document.getElementById('expensesChart') && 
            document.getElementById('spendingChart')) {
            createCharts();
        }
    }

    // Create charts
    function createCharts() {
        // Income chart
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');
        new Chart(incomeCtx, {
            type: 'line',
            data: {
                labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Ingresos',
                    data: [6200, 6800, 7100, 7300, 7500],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [2, 4]
                        }
                    }
                }
            }
        });

        // Expenses chart
        const expensesCtx = document.getElementById('expensesChart').getContext('2d');
        new Chart(expensesCtx, {
            type: 'line',
            data: {
                labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Gastos',
                    data: [1400, 1550, 1600, 1650, 1700],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [2, 4]
                        }
                    }
                }
            }
        });

        // Spending by category chart
        const spendingCtx = document.getElementById('spendingChart').getContext('2d');
        new Chart(spendingCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data.spendingByCategory),
                datasets: [{
                    data: Object.values(data.spendingByCategory),
                    backgroundColor: [
                        '#4361ee', // Vivienda
                        '#3a0ca3', // Comida
                        '#4cc9f0', // Transporte
                        '#f72585', // Ocio
                        '#7209b7', // Servicios
                        '#560bad'  // Otros
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Initialize dashboard
    updateDashboard();

    // Add event listeners for theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }
});
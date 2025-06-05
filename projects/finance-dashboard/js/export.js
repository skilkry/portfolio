// Export functionality for reports
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the reports page
    const exportBtn = document.querySelector('.export-btn');
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', function() {
        // Create export options panel
        const exportPanel = document.createElement('div');
        exportPanel.className = 'export-panel';
        exportPanel.innerHTML = `
            <div class="export-header">
                <h3>Exportar Reporte</h3>
                <button class="close-export"><i class="fas fa-times"></i></button>
            </div>
            <div class="export-body">
                <div class="export-option" data-format="pdf">
                    <i class="fas fa-file-pdf"></i>
                    <div class="option-details">
                        <h4>PDF</h4>
                        <p>Exportar como documento PDF</p>
                    </div>
                </div>
                <div class="export-option" data-format="excel">
                    <i class="fas fa-file-excel"></i>
                    <div class="option-details">
                        <h4>Excel</h4>
                        <p>Exportar como hoja de cálculo Excel</p>
                    </div>
                </div>
                <div class="export-option" data-format="csv">
                    <i class="fas fa-file-csv"></i>
                    <div class="option-details">
                        <h4>CSV</h4>
                        <p>Exportar como archivo CSV</p>
                    </div>
                </div>
            </div>
        `;
        
        // Style export panel
        exportPanel.style.position = 'absolute';
        exportPanel.style.top = '50%';
        exportPanel.style.left = '50%';
        exportPanel.style.transform = 'translate(-50%, -50%)';
        exportPanel.style.width = '400px';
        exportPanel.style.backgroundColor = 'var(--card-background, #ffffff)';
        exportPanel.style.borderRadius = 'var(--border-radius-lg, 12px)';
        exportPanel.style.boxShadow = 'var(--shadow-lg, 0 8px 16px rgba(0, 0, 0, 0.15))';
        exportPanel.style.zIndex = '200';
        exportPanel.style.animation = 'fadeIn 0.3s forwards';
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Style header
        const header = exportPanel.querySelector('.export-header');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '1rem';
        header.style.borderBottom = '1px solid var(--border-color, #e9ecef)';
        
        header.querySelector('h3').style.margin = '0';
        header.querySelector('h3').style.fontSize = '1.1rem';
        
        const closeBtn = header.querySelector('.close-export');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'var(--text-secondary, #6c757d)';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0.25rem';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.transition = 'all 0.3s ease';
        
        closeBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            this.style.color = 'var(--text-primary, #333333)';
        });
        
        closeBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = 'var(--text-secondary, #6c757d)';
        });
        
        // Style body
        const body = exportPanel.querySelector('.export-body');
        body.style.padding = '1rem';
        
        // Style export options
        const options = exportPanel.querySelectorAll('.export-option');
        options.forEach(option => {
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.padding = '1rem';
            option.style.marginBottom = '0.5rem';
            option.style.borderRadius = 'var(--border-radius-md, 8px)';
            option.style.cursor = 'pointer';
            option.style.transition = 'background-color 0.2s ease';
            
            option.querySelector('i').style.fontSize = '2rem';
            option.querySelector('i').style.marginRight = '1rem';
            option.querySelector('i').style.width = '40px';
            option.querySelector('i').style.textAlign = 'center';
            
            const details = option.querySelector('.option-details');
            details.querySelector('h4').style.margin = '0 0 0.25rem 0';
            details.querySelector('p').style.margin = '0';
            details.querySelector('p').style.fontSize = '0.85rem';
            details.querySelector('p').style.color = 'var(--text-secondary, #6c757d)';
            
            option.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            });
            
            option.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // Add click event to export options
            option.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                exportReport(format);
                document.body.removeChild(exportPanel);
                document.body.removeChild(overlay);
            });
        });
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '199';
        
        // Add close functionality
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(exportPanel);
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', function() {
            document.body.removeChild(exportPanel);
            document.body.removeChild(overlay);
        });
        
        // Add to body
        document.body.appendChild(overlay);
        document.body.appendChild(exportPanel);
    });
    
    // Function to handle export based on format
    function exportReport(format) {
        // Get current period from select
        const periodSelect = document.getElementById('reportPeriod');
        const period = periodSelect ? periodSelect.value : 'month';
        
        // Get report data
        const reportData = getReportData(period);
        
        // Show loading toast
        showToast(`Exportando reporte en formato ${format.toUpperCase()}...`);
        
        // Simulate export delay
        setTimeout(() => {
            console.log(`Exported report in ${format} format:`, reportData);
            showToast(`Reporte exportado correctamente en formato ${format.toUpperCase()}.`, 'success');
            
            // In a real application, you would use libraries like jsPDF, xlsx, or papaparse
            // to generate the actual files and trigger downloads
            if (format === 'pdf') {
                // simulateDownload('reporte_financiero.pdf');
            } else if (format === 'excel') {
                // simulateDownload('reporte_financiero.xlsx');
            } else if (format === 'csv') {
                // simulateDownload('reporte_financiero.csv');
            }
        }, 1500);
    }
    
    // Function to get report data based on period
    function getReportData(period) {
        // In a real application, this would fetch data from an API or database
        // Here we're just returning mock data
        return {
            period: period,
            summary: {
                income: 4500,
                expenses: 3200,
                savings: 1300
            },
            categories: {
                income: [
                    { name: 'Salario', amount: 3500 },
                    { name: 'Freelance', amount: 800 },
                    { name: 'Inversiones', amount: 200 }
                ],
                expenses: [
                    { name: 'Vivienda', amount: 1200 },
                    { name: 'Comida', amount: 600 },
                    { name: 'Transporte', amount: 300 },
                    { name: 'Ocio', amount: 400 },
                    { name: 'Servicios', amount: 350 },
                    { name: 'Otros', amount: 350 }
                ]
            },
            transactions: [
                // Sample transactions would go here
            ]
        };
    }
    
    // Function to show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="toast-content">
                <p>${message}</p>
            </div>
        `;
        
        // Style toast
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.padding = '1rem';
        toast.style.backgroundColor = type === 'success' ? 'var(--positive, #22c55e)' : 'var(--info, #3b82f6)';
        toast.style.color = 'white';
        toast.style.borderRadius = 'var(--border-radius-md, 8px)';
        toast.style.boxShadow = 'var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.1))';
        toast.style.zIndex = '300';
        toast.style.animation = 'slideIn 0.3s forwards, fadeOut 0.3s 3s forwards';
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Style icon
        const icon = toast.querySelector('.toast-icon');
        icon.style.marginRight = '0.75rem';
        icon.style.fontSize = '1.5rem';
        
        // Add to body
        document.body.appendChild(toast);
        
        // Remove after 3.5 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3500);
    }
});
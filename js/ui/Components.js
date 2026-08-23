// js/ui/Components.js
// Componentes UI reutilizables

class ComponentsClass {
    // Crear modal
    createModal(title, content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        let html = '';
        if (title) {
            html += `<h2 style="margin-bottom: 1rem; color: #ffd700;">${title}</h2>`;
        }
        html += `<div style="margin-bottom: 1.5rem;">${content}</div>`;
        
        // Botones
        if (options.buttons && options.buttons.length > 0) {
            html += '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">';
            options.buttons.forEach(btn => {
                const className = btn.className || 'action-btn';
                const id = btn.id ? `id="${btn.id}"` : '';
                html += `<button ${id} class="${className}">${btn.text}</button>`;
            });
            html += '</div>';
        }
        
        modal.innerHTML = html;
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        return { overlay, modal };
    }

    // Crear toast/notification
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 20, 0.95);
            border: 1px solid ${this.getToastColor(type)};
            border-radius: 8px;
            padding: 1rem 1.5rem;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getToastColor(type) {
        const colors = {
            info: 'rgba(255, 215, 0, 0.3)',
            success: 'rgba(92, 184, 92, 0.5)',
            error: 'rgba(217, 83, 79, 0.5)',
            warning: 'rgba(255, 140, 0, 0.5)'
        };
        return colors[type] || colors.info;
    }

    // Crear barra de progreso
    createProgressBar(value, max = 100, options = {}) {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        
        const container = document.createElement('div');
        container.style.cssText = `
            width: ${options.width || '100%'};
            height: ${options.height || '8px'};
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        `;
        
        const bar = document.createElement('div');
        bar.style.cssText = `
            width: ${percentage}%;
            height: 100%;
            background: linear-gradient(90deg, ${options.color || '#4a90d9'} 0%, ${options.colorEnd || '#357abd'} 100%);
            transition: width 0.3s ease;
        `;
        
        container.appendChild(bar);
        return container;
    }

    // Crear tooltip
    createTooltip(element, text, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(10, 10, 20, 0.95);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        tooltip.textContent = text;
        
        element.addEventListener('mouseenter', () => {
            const rect = element.getBoundingClientRect();
            
            switch(position) {
                case 'top':
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    break;
                case 'bottom':
                    tooltip.style.top = (rect.bottom + 8) + 'px';
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    break;
                case 'left':
                    tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
                    tooltip.style.left = (rect.left - tooltip.offsetWidth - 8) + 'px';
                    break;
                case 'right':
                    tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
                    tooltip.style.left = (rect.right + 8) + 'px';
                    break;
            }
            
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        document.body.appendChild(tooltip);
        return tooltip;
    }
}

// Exportar instancia global
window.Components = new ComponentsClass();

// Añadir animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(10px); }
    }
`;
document.head.appendChild(style);

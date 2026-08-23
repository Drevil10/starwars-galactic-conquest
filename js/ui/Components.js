class ComponentsClass {
    createModal(title, content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const modal = document.createElement('div');
        modal.className = 'modal';
        let html = '';
        if (title) html += '<h2 style="margin-bottom: 1rem; color: #ffd700;">' + title + '</h2>';
        html += '<div style="margin-bottom: 1.5rem;">' + content + '</div>';
        if (options.buttons && options.buttons.length > 0) {
            html += '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">';
            options.buttons.forEach((btn) => { html += '<button ' + (btn.id ? 'id="' + btn.id + '"' : '') + ' class="' + (btn.className || 'action-btn') + '">' + btn.text + '</button>'; });
            html += '</div>';
        }
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        return { overlay, modal };
    }
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(10,10,20,.95);border:1px solid ' + this.getToastColor(type) + ';border-radius:8px;padding:1rem 1.5rem;z-index:1000;';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }
    getToastColor(type) { return ({ info: 'rgba(255,215,0,.3)', success: 'rgba(92,184,92,.5)', error: 'rgba(217,83,79,.5)', warning: 'rgba(255,140,0,.5)' })[type] || 'rgba(255,215,0,.3)'; }
}
window.Components = new ComponentsClass();

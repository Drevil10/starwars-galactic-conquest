/**
 * Navigation.js
 * Sistema de navegaci�n entre pesta�as
 */

const Navigation = {
    currentTab: Constants.TABS.BASE,
    navButtons: [],

    initialize() {
        console.log('[Navigation] Sistema inicializado');
    },

    start() {
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.changeTab(tab);
            });
        });
        this.changeTab(Constants.TABS.BASE);
        console.log('[Navigation] Navegaci�n iniciada');
    },

    changeTab(tab) {
        if (!Object.values(Constants.TABS).includes(tab)) {
            console.warn(`[Navigation] Pesta�a inv�lida: ${tab}`);
            return;
        }
        this.currentTab = tab;
        this.navButtons.forEach(btn => {
            btn.classList.add('active', btn.dataset.tab === tab ? '' : '');
            if (btn.dataset.tab !== tab) btn.classList.remove('active');
        });
        EventBus.emit(Constants.EVENTS.NAVIGATION.CHANGE_TAB, { tab });
        console.log(`[Navigation] Cambiado a pesta�a: ${tab}`);
    },

    getCurrentTab() { return this.currentTab; }
};

window.Navigation = Navigation;
/**
 * Navigation.js
 * Sistema de navegacion entre pestanas
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
        console.log('[Navigation] Navegacion iniciada');
    },

    changeTab(tab) {
        if (!Object.values(Constants.TABS).includes(tab)) {
            console.warn(`[Navigation] Pestana invalida: ${tab}`);
            return;
        }
        this.currentTab = tab;
        this.navButtons.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        EventBus.emit(Constants.EVENTS.NAVIGATION.CHANGE_TAB, { tab });
        console.log(`[Navigation] Cambiado a pestana: ${tab}`);
    },

    getCurrentTab() { return this.currentTab; }
};

window.Navigation = Navigation;
const ViewRouter = {
    activePage: 'landing-page',
    activeTab: 'home',

    init() {
        document.getElementById('enter-btn').addEventListener('click', () => {
            this.switchPage('store-page');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('id');
                this.switchTab(targetTab);
            });
        });
    },

    switchPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        target.classList.add('active');
        this.activePage = pageId;
    },

    switchTab(tabId) {
        document.querySelectorAll('.nav ul li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.tab-content-view').forEach(v => v.classList.remove('active-view'));

        const activeLink = document.getElementById(tabId);
        if (activeLink) activeLink.parentElement.classList.add('active');

        const viewSection = document.getElementById(`${tabId}-content-section`);
        if (viewSection) viewSection.classList.add('active-view');
        
        this.activeTab = tabId;
    }
};

const StoreCatalog = {
    'FREE FIRE': [
        { name: '100 + 10 Diamonds', price: 'EGP 45.00' },
        { name: '210 + 21 Diamonds', price: 'EGP 90.00' },
        { name: '530 + 53 Diamonds', price: 'EGP 220.00' },
        { name: '1080 + 108 Diamonds', price: 'EGP 430.00' },
        { name: '2200 + 220 Diamonds', price: 'EGP 850.00' }
    ],
    'PUBG MOBILE': [
        { name: '60 UC', price: 'EGP 48.00' },
        { name: '325 UC', price: 'EGP 240.00' },
        { name: '660 UC', price: 'EGP 475.00' },
        { name: '1800 UC', price: 'EGP 1180.00' },
        { name: '3850 UC', price: 'EGP 2350.00' }
    ],
    'CALL OF DUTY': [
        { name: '80 CP', price: 'EGP 50.00' },
        { name: '420 CP', price: 'EGP 250.00' },
        { name: '880 CP', price: 'EGP 500.00' },
        { name: '2400 CP', price: 'EGP 1200.00' }
    ],
    'FIFA MOBILE': [
        { name: '100 FC Points', price: 'EGP 60.00' },
        { name: '500 FC Points', price: 'EGP 280.00' },
        { name: '1050 FC Points', price: 'EGP 550.00' }
    ],
    'PES MOBILE': [
        { name: '100 MyClub Coins', price: 'EGP 55.00' },
        { name: '500 MyClub Coins', price: 'EGP 270.00' },
        { name: '1000 MyClub Coins', price: 'EGP 520.00' }
    ],
    'BLOOD STRIKE': [
        { name: '100 Gold', price: 'EGP 40.00' },
        { name: '500 Gold', price: 'EGP 200.00' },
        { name: '1000 Gold', price: 'EGP 390.00' }
    ]
};

const PurchaseWorkflow = {
    selectedGame: '',
    loginMethod: 'id',
    gameId: '',
    accountEmail: '',
    accountPassword: '',
    selectedProduct: null,

    init() {
        this.setupGameCards();
        this.setupModalControls();
        this.setupInputValidations();
        this.setupSearchEngine();
        this.setupFeedbackSystem();
    },

    setupGameCards() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameTitle = card.querySelector('.game-label').textContent;
                const iconSrc = card.querySelector('.icon-badge img').getAttribute('src');
                this.openGameModal(gameTitle, iconSrc);
            });
        });
    },

    setupModalControls() {
        document.getElementById('close-modal').addEventListener('click', () => this.hideOverlay('game-modal'));
        document.getElementById('back-to-id').addEventListener('click', () => {
            this.hideOverlay('recharge-modal');
            this.showOverlay('game-modal');
        });
        document.getElementById('back-to-recharge').addEventListener('click', () => {
            this.hideOverlay('checkout-modal');
            this.showOverlay('recharge-modal');
        });

        const btnId = document.getElementById('btn-id');
        const btnAcc = document.getElementById('btn-acc');
        const idGroup = document.getElementById('id-input-group');
        const accGroup = document.getElementById('acc-input-group');

        btnId.addEventListener('click', () => {
            btnId.classList.add('active');
            btnAcc.classList.remove('active');
            idGroup.style.display = 'block';
            accGroup.style.display = 'none';
            this.loginMethod = 'id';
            this.validateFormInputs();
        });

        btnAcc.addEventListener('click', () => {
            btnAcc.classList.add('active');
            btnId.classList.remove('active');
            idGroup.style.display = 'none';
            accGroup.style.display = 'block';
            this.loginMethod = 'account';
            this.validateFormInputs();
        });

        document.getElementById('confirm-btn').addEventListener('click', () => {
            this.gameId = document.getElementById('game-id-field').value.trim();
            this.accountEmail = document.getElementById('acc-email-field').value.trim();
            this.accountPassword = document.getElementById('acc-pass-field').value.trim();

            this.hideOverlay('game-modal');
            this.renderRechargeCatalog();
            this.showOverlay('recharge-modal');
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            document.getElementById('success-notification').style.display = 'block';
            document.getElementById('checkout-action-container').style.display = 'none';
        });
    },

    setupInputValidations() {
        const fields = ['game-id-field', 'acc-email-field', 'acc-pass-field'];
        fields.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.validateFormInputs());
        });
    },

    validateFormInputs() {
        const confirmBtn = document.getElementById('confirm-btn');
        if (this.loginMethod === 'id') {
            const idVal = document.getElementById('game-id-field').value.trim();
            confirmBtn.disabled = (idVal.length === 0);
        } else {
            const emailVal = document.getElementById('acc-email-field').value.trim();
            const passVal = document.getElementById('acc-pass-field').value.trim();
            confirmBtn.disabled = (emailVal.length === 0 || passVal.length === 0);
        }
    },

    openGameModal(title, iconSrc) {
        this.selectedGame = title;
        document.getElementById('modal-game-title').textContent = title;
        document.getElementById('modal-game-icon').setAttribute('src', iconSrc);
        
        document.getElementById('game-id-field').value = '';
        document.getElementById('acc-email-field').value = '';
        document.getElementById('acc-pass-field').value = '';
        this.validateFormInputs();

        this.showOverlay('game-modal');
    },

    renderRechargeCatalog() {
        const container = document.querySelector('.recharge-list');
        container.innerHTML = '';
        const items = StoreCatalog[this.selectedGame] || [];

        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'recharge-item';
            row.innerHTML = `
                <span class="diamond-count">${item.name}</span>
                <span class="price-tag">${item.price}</span>
            `;
            row.addEventListener('click', () => {
                this.selectedProduct = item;
                this.hideOverlay('recharge-modal');
                this.renderCheckoutSummary();
                this.showOverlay('checkout-modal');
            });
            container.appendChild(row);
        });
    },

    renderCheckoutSummary() {
        const detailsBox = document.getElementById('order-details');
        document.getElementById('success-notification').style.display = 'none';
        document.getElementById('checkout-action-container').style.display = 'block';

        let credentialsHtml = '';
        if (this.loginMethod === 'id') {
            credentialsHtml = `<div class="summary-row"><span>Game ID</span><span class="val">${this.gameId}</span></div>`;
        } else {
            credentialsHtml = `
                <div class="summary-row"><span>Email</span><span class="val">${this.accountEmail}</span></div>
                <div class="summary-row"><span>Password</span><span class="val">********</span></div>
            `;
        }

        detailsBox.innerHTML = `
            <div class="summary-row"><span>Game</span><span class="val">${this.selectedGame}</span></div>
            <div class="summary-row"><span>Method</span><span class="val">${this.loginMethod.toUpperCase()}</span></div>
            ${credentialsHtml}
            <div class="summary-row"><span>Product</span><span class="val">${this.selectedProduct.name}</span></div>
            <div class="summary-row"><span>Total Cost</span><span class="val" style="color:#00ffcc;">${this.selectedProduct.price}</span></div>
        `;
    },

    setupSearchEngine() {
        const input = document.getElementById('store-search-input');
        const resultsViewport = document.getElementById('search-results-viewport');

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            resultsViewport.innerHTML = '';

            if (query === '') return;

            document.querySelectorAll('.game-card').forEach(card => {
                const title = card.getAttribute('data-game-search-title');
                if (title && title.includes(query)) {
                    const label = card.querySelector('.game-label').textContent;
                    const img = card.querySelector('.icon-badge img').getAttribute('src');

                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <img class="search-item-thumb" src="${img}" alt="">
                        <span class="search-item-name">${label}</span>
                    `;
                    item.addEventListener('click', () => {
                        ViewRouter.switchTab('home');
                        this.openGameModal(label, img);
                    });
                    resultsViewport.appendChild(item);
                }
            });
        });
    },

    setupFeedbackSystem() {
        const submitBtn = document.getElementById('feedback-submit-btn');
        const textarea = document.getElementById('feedback-textarea-field');
        const formBox = document.getElementById('feedback-input-box');
        const thanksBox = document.getElementById('feedback-thanks-box');

        submitBtn.addEventListener('click', () => {
            if (textarea.value.trim() !== '') {
                formBox.style.display = 'none';
                thanksBox.style.display = 'block';
                textarea.value = '';
                
                setTimeout(() => {
                    thanksBox.style.display = 'none';
                    formBox.style.display = 'flex';
                }, 4000);
            }
        });
    },

    showOverlay(id) { document.getElementById(id).style.display = 'flex'; },
    hideOverlay(id) { document.getElementById(id).style.display = 'none'; }
};

document.addEventListener('DOMContentLoaded', () => {
    ViewRouter.init();
    PurchaseWorkflow.init();
});
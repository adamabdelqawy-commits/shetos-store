/* Shetos Store - effects layer. Standalone: does not touch script.js logic. */
(function () {
    'use strict';
    var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* 1) Ripple on every button / card */
    var RIPPLE = '.blue-btn,.confirm-btn,.profile-setup-enter-btn,.profile-save-btn,.feedback-submit-button,.auth-tab,.auth-method,.hub-box,.setting-big-rect-btn,.ff-type-rect,.currency-choice-btn,.language-choice-btn,.recharge-item,.game-card,.account-card,.profile-edit-toggle-btn,.profile-logout-btn,.support-phone-row,.top-settings-icon-btn,.theme-toggle-btn,.acc-phone-link,.acc-delete-btn';
    document.addEventListener('pointerdown', function (e) {
        if (RM) return;
        var el = e.target.closest && e.target.closest(RIPPLE);
        if (!el || el.disabled) return;
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.overflow = 'hidden';
        var r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
        var s = document.createElement('span');
        s.className = 'fx-ripple';
        s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
        el.appendChild(s);
        setTimeout(function () { s.remove(); }, 700);
    }, { passive: true });

    /* 2) 3D tilt + cursor glare on game cards, hub boxes, account cards */
    var TILT = '.game-card,.hub-box,.account-card', cur = null;
    function reset(el) {
        el.classList.remove('is-tilting');
        el.style.removeProperty('--rx'); el.style.removeProperty('--ry');
    }
    if (FINE && !RM) {
        document.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            var el = e.target.closest && e.target.closest(TILT);
            if (el !== cur) { if (cur) reset(cur); cur = el; if (el) el.classList.add('is-tilting'); }
            if (!el) return;
            var r = el.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            el.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
            el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
            el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        }, { passive: true });
        document.documentElement.addEventListener('mouseleave', function () { if (cur) { reset(cur); cur = null; } });
    }

    /* 3) Stagger index for entrance animations (also for lists built later) */
    function stagger(box) {
        Array.prototype.forEach.call(box.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 12)); });
    }
    function watch(sel) {
        var box = document.querySelector(sel);
        if (!box) return;
        stagger(box);
        new MutationObserver(function () { stagger(box); }).observe(box, { childList: true });
    }
    watch('#game-grid-scroll'); watch('.hub-grid'); watch('#accounts-grid'); watch('.recharge-list');

    /* 4) Soft light that follows the mouse (desktop only) */
    if (FINE && !RM) {
        var glow = document.createElement('div');
        glow.className = 'fx-cursor';
        document.body.appendChild(glow);
        var tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty;
        addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
        (function loop() {
            x += (tx - x) * 0.12; y += (ty - y) * 0.12;
            glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
            requestAnimationFrame(loop);
        })();
    }

    /* 5) Scroll progress bar */
    var bar = document.createElement('div');
    bar.className = 'fx-progress';
    document.body.appendChild(bar);
    function onScroll() {
        var se = document.scrollingElement || document.documentElement;
        var max = se.scrollHeight - se.clientHeight;
        bar.style.setProperty('--p', max > 0 ? (se.scrollTop / max).toFixed(3) : 0);
    }
    addEventListener('scroll', onScroll, { passive: true });

    /* 6) Smooth colour fade when switching light / dark */
    document.addEventListener('click', function (e) {
        if (!(e.target.closest && e.target.closest('#theme-toggle-btn'))) return;
        var h = document.documentElement;
        h.classList.add('fx-theme');
        setTimeout(function () { h.classList.remove('fx-theme'); }, 650);
    });
})();
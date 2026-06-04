(function () {
    'use strict';

    var BOOKING_URLS = {
        flexCuts: 'https://book.squareup.com/appointments/blmzonty6dawkp/location/LR9D01TAEXTM6/services',
        lou: 'https://getsquire.com/booking/book/flex-cuts-winnipeg-1/barber/luis-ribeiro-de-lima/services'
    };

    var overlay = document.getElementById('barber-modal-overlay');
    var panel = document.getElementById('barber-modal-panel');
    var closeBtn = document.getElementById('barber-modal-close');
    var flexCutsBtn = document.getElementById('barber-book-flex-cuts');
    var louBtn = document.getElementById('barber-book-lou');

    var pendingFlexCutsUrl = BOOKING_URLS.flexCuts;
    var lastFocusedElement = null;

    function getTriggerUrl(trigger) {
        if (trigger.dataset.bookingUrl) {
            return trigger.dataset.bookingUrl;
        }
        if (trigger.tagName === 'A' && trigger.href) {
            return trigger.href;
        }
        return BOOKING_URLS.flexCuts;
    }

    function openModal(flexCutsUrl) {
        pendingFlexCutsUrl = flexCutsUrl || BOOKING_URLS.flexCuts;
        lastFocusedElement = document.activeElement;

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('barber-modal-open');

        closeBtn.focus();
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('barber-modal-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function handleTriggerClick(event) {
        event.preventDefault();

        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }

        openModal(getTriggerUrl(event.currentTarget));
    }

    function attachBookingListeners() {
        var squareLinks = document.querySelectorAll('a[href*="book.squareup.com"]');
        squareLinks.forEach(function (link) {
            link.addEventListener('click', handleTriggerClick);
        });

        var bookingButtons = document.querySelectorAll('[data-booking-trigger]');
        bookingButtons.forEach(function (button) {
            button.addEventListener('click', handleTriggerClick);
        });
    }

    function getFocusableElements() {
        return panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function handleKeyDown(event) {
        if (!overlay.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        var focusable = getFocusableElements();
        if (!focusable.length) {
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);

    flexCutsBtn.addEventListener('click', function () {
        window.location.href = pendingFlexCutsUrl;
    });

    louBtn.addEventListener('click', function () {
        window.location.href = BOOKING_URLS.lou;
    });

    document.addEventListener('keydown', handleKeyDown);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachBookingListeners);
    } else {
        attachBookingListeners();
    }
})();

(function () {
    'use strict';

    var carousel = document.getElementById('reviews-carousel');
    var track = document.getElementById('reviews-carousel-track');

    if (!carousel || !track) {
        return;
    }

    var slides = track.querySelectorAll('.reviews-carousel-slide');
    if (!slides.length) {
        return;
    }

    var currentIndex = 0;
    var touchStartX = 0;
    var touchDeltaX = 0;
    var autoPlayTimer = null;
    var AUTO_PLAY_INTERVAL = 7000;

    function getSlidesPerView() {
        return window.innerWidth >= 1024 ? 2 : 1;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesPerView());
    }

    function updateCarousel() {
        var slidesPerView = getSlidesPerView();
        var maxIndex = getMaxIndex();

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        var slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';

        slides.forEach(function (slide, index) {
            var isVisible = slidesPerView === 1
                ? index === currentIndex
                : index >= currentIndex && index < currentIndex + slidesPerView;

            slide.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        });
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
        updateCarousel();
    }

    function advanceSlide() {
        if (currentIndex >= getMaxIndex()) {
            goToSlide(0);
        } else {
            goToSlide(currentIndex + 1);
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(advanceSlide, AUTO_PLAY_INTERVAL);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToSlide(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToSlide(currentIndex + 1);
        }
    });

    track.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
        touchDeltaX = 0;
        stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchmove', function (event) {
        touchDeltaX = event.changedTouches[0].screenX - touchStartX;
    }, { passive: true });

    track.addEventListener('touchend', function () {
        if (Math.abs(touchDeltaX) >= 50) {
            if (touchDeltaX < 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }

        startAutoPlay();
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', function (event) {
        if (!carousel.contains(event.relatedTarget)) {
            startAutoPlay();
        }
    });

    window.addEventListener('resize', updateCarousel);

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    updateCarousel();

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        startAutoPlay();
    }
})();

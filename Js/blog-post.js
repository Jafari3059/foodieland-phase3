document.addEventListener('DOMContentLoaded', function () {
    console.log('JS loaded - Blog Post');

    // اسلایدر افقی
    const setupCarousel = () => {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!track || !prevBtn || !nextBtn) return;

        const cards = document.querySelectorAll('.carousel-track .new-card');
        let currentIndex = 0;

        const getCardsPerView = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            if (window.innerWidth <= 1200) return 3;
            return 4;
        };

        const updateCarousel = () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, cards.length - cardsPerView);

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const cardWidth = cards[0]?.offsetWidth + 25 || 0;
            const translateX = currentIndex * cardWidth;

            track.style.transform = `translateX(-${translateX}px)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;

            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        window.addEventListener('resize', () => {
            updateCarousel();
        });

        updateCarousel();
    };

    setupCarousel();

});
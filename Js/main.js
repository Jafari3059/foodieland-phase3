document.addEventListener('DOMContentLoaded', function () {
    console.log('JS loaded - Main');

    //لینک‌های هدر
    const navLinks = [
        'home.html',
        'recipe-details.html',
        'blog-list.html',
        'contact.html',
        'about.html'
    ];

    const navItems = document.querySelectorAll('nav a');
    navItems.forEach((link, index) => {
        if (navLinks[index]) {
            link.href = navLinks[index];
        }
    });

    //لینک‌های فوتر
    const footerLinks = [
        'recipe-details.html',
        'blog-list.html',
        'contact.html',
        'about.html'
    ];

    const footerNavItems = document.querySelectorAll('.footer-nav a');
    footerNavItems.forEach((link, index) => {
        if (footerLinks[index]) {
            link.href = footerLinks[index];
        }
    });

    // کلیک روی کارت‌ها
    const allNewCards = document.querySelectorAll('.new-card');
    allNewCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.like-container')) return;
            window.location.href = 'recipe-details.html';
        });
    });

    const tastyItems = document.querySelectorAll('.tasty-recipe-item');
    tastyItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = 'recipe-details.html';
        });
    });

    // منوی همبرگری
    const hamburger = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            if (navMenu.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Newsletter با LocalStorage
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterInput');
    const subscribeBtn = document.querySelector('.newsletter-btn');

    if (newsletterForm && newsletterInput && subscribeBtn) {
        newsletterForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const userEmail = newsletterInput.value.trim().toLowerCase();
            const originalBtnText = subscribeBtn.innerHTML;

            // اعتبارسنجی ایمیل 
            if (!userEmail) {
                alert('Please enter your email address.');
                return;
            }
            const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
            if (!emailRegex.test(userEmail)) {
                alert('Please enter a valid email address.');
                return;
            }

            // بررسی LocalStorage
            const storedEmails = JSON.parse(
                localStorage.getItem('newsletterEmails')
            ) || [];
            const emailExists = storedEmails.some(
                email => email === userEmail
            );

            if (emailExists) {
                alert('This email is already subscribed.');
                return;
            }

            // حالت Loading
            subscribeBtn.innerHTML = 'Subscribing... <span class="btn-spinner"></span>';
            subscribeBtn.disabled = true;

            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 65000);

            try {
                const response = await fetch(
                    'https://foodieland-oq9b.onrender.com/api/subscribe',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: userEmail
                        }),
                        signal: controller.signal
                    }
                );
                clearTimeout(timeout);

                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error('Invalid email format.');
                    }
                    throw new Error(`HTTP_${response.status}`);
                }
                const data = await response.json();

                // ذخیره ایمیل در LocalStorage
                storedEmails.push(userEmail);
                localStorage.setItem(
                    'newsletterEmails',
                    JSON.stringify(storedEmails)
                );

                alert(data.message || 'Thank you for subscribing.');
                newsletterForm.reset();

            }
            catch (error) {
                console.error(error);
                let errorMessage = getErrorMessage(error);
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please try again.';
                }
                alert(errorMessage);
            }
            finally {
                clearTimeout(timeout);
                subscribeBtn.innerHTML = originalBtnText;
                subscribeBtn.disabled = false;
            }
        });
    }

});
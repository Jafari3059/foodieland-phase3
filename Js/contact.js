document.addEventListener('DOMContentLoaded', function () {
    console.log('Contact form script connected!');

    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('.submit-btn');

    if (!contactForm || !submitBtn) return;

    const originalBtnText = submitBtn.innerHTML;
    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // دریافت اطلاعات فرم
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const subject = document.getElementById('subject').value.trim();
        const enquiryType = document.getElementById('enquiryType').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !enquiryType || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const formData = {
            name,
            email,
            subject,
            enquiryType,
            message
        };

        submitBtn.innerHTML = 'Sending... <span class="btn-spinner"></span>';
        submitBtn.disabled = true;

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 65000);

        try {
            const response = await fetch(
                'https://foodieland-oq9b.onrender.com/api/contact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    signal: controller.signal
                }
            );
            clearTimeout(timeout);

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Please fill in all required fields correctly.');
                }
                if (response.status === 404) {
                    throw new Error('Contact service not found.');
                }
                if (response.status >= 500) {
                    throw new Error('Server error.');
                }
                throw new Error(`HTTP_${response.status}`);
            }

            const data = await response.json();
            alert(data.message || 'Your message has been sent successfully.');
            contactForm.reset();

        } catch (error) {

            console.error('Contact Form Error:', error);
            let errorMessage = getErrorMessage(error);

            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. Please try again.';
            }
            if (error.message.includes('fill in all required fields')) {
                errorMessage = 'Please fill in all required fields correctly.';
            }
            if (error.message === 'Contact service not found.') {
                errorMessage = 'Contact service not found. Please try again later.';
            }
            if (error.message.includes('Server error')) {
                errorMessage = 'Server error. Please try again later.';
            }
            alert(errorMessage);

        } finally {
            clearTimeout(timeout);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

});
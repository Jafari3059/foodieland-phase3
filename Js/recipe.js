document.addEventListener('DOMContentLoaded', async () => {
    console.log('Recipe details connected!');

    const ids = ['cal', 'fat', 'pro', 'carb', 'chol', 'desc'];
    const nutritionGrid = document.querySelector('.nutrition-grid');

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    if (nutritionGrid) {
        nutritionGrid.appendChild(spinner);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 65000);

    try {

        // ارسال درخواست به api
        const response = await fetch(
            'https://foodieland-oq9b.onrender.com/api/recipe-details/1',
            {
                signal: controller.signal
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Recipe not found.');
            }
            throw new Error(`HTTP_${response.status}`);
        }
        const data = await response.json();

        // اعتبارسنجی اطلاعات دریافت شده
        if (!data || typeof data !== 'object' || !data.nutrition) {
            throw new Error('Invalid data format.');
        }
        const nutrition = data.nutrition;

        const setText = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value ?? '—';
            }
        };
        setText('cal', nutrition.calories);
        setText('fat', nutrition.fat ?? nutrition.totalFat);
        setText('pro', nutrition.protein);
        setText('carb', nutrition.carbs ?? nutrition.carbohydrate);
        setText('chol', nutrition.cholesterol);
        setText('desc', data.description ?? 'No description available.');

    } catch (error) {
        console.error('Recipe Details Error:', error);

        // مدیریت خطاها
        let errorMessage = getErrorMessage(error);
        if (error.message === 'Recipe not found.') {
            errorMessage = 'Recipe not found.';
        }
        else if (error.message === 'Invalid data format.') {
            errorMessage = 'Data format error. Please try again later.';
        }

        ids.forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            if (id === 'desc') {
                element.textContent = errorMessage;
            } else {
                element.textContent = '—';
            }
        });
    }
    finally {
        clearTimeout(timeout);

        if (nutritionGrid) {
            nutritionGrid.classList.add('loaded');
        }
        spinner.remove();
    }

});
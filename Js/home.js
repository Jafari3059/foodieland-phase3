document.addEventListener('DOMContentLoaded', function () {
    console.log('JS loaded - Home');

    // تنظیم لینک دکمه Hero
    const viewRecipesBtn = document.querySelector('.hero .btn-black');
    if (viewRecipesBtn) {
        viewRecipesBtn.href = 'recipe-details.html';
    }

    //کلیک روی کارت‌های دستور غذا
    const recipeCards = document.querySelectorAll('.recipe-card, .new-card');
    recipeCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.like-container')) return;
            window.location.href = 'recipe-details.html';
        });
    });

    //دریافت دسته‌بندی‌ها از سرور
    const categoriesContainer = document.getElementById('categoriesContainer');

    if (categoriesContainer) {
        const catSpinner = document.createElement('div');
        catSpinner.className = 'spinner';
        categoriesContainer.appendChild(catSpinner);

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 65000);

        // ارسال درخواست به api
        fetch(
            'https://foodieland-oq9b.onrender.com/api/categories',
            {
                signal: controller.signal
            }
        )
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Categories not found.');
                    }
                    throw new Error(`HTTP_${response.status}`);
                }
                return response.json();
            })

            // اعتبارسنجی و نمایش اطلاعات
            .then(categories => {
                if (!Array.isArray(categories) || categories.length === 0) {
                    throw new Error('Invalid data format.');
                }
                categoriesContainer.innerHTML = '';
                categories.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'category-card';

                    card.innerHTML = `
                        <div class="category-img"
                             style="background-image:url('${cat.image || ''}')">
                        </div>
                        <span class="category-name">
                            ${cat.name || 'Unknown'}
                        </span>
                    `;
                    categoriesContainer.appendChild(card);
                });
            })

            // مدیریت خطاها
            .catch(error => {
                console.error('Categories Error:', error);
                let errorMessage = getErrorMessage(error);

                if (error.message === 'Categories not found.') {
                    errorMessage = 'Categories not found.';
                } else if (error.message === 'Invalid data format.') {
                    errorMessage = 'Data format error. Please try again later.';
                }
                categoriesContainer.innerHTML = `
                    <p class="error-state">
                        ${errorMessage}
                    </p>
                `;
            })
            .finally(() => {
                clearTimeout(timeout);
                catSpinner.remove();
            });
    }

});
document.addEventListener('DOMContentLoaded', function () {
    console.log('JS loaded - Blog List');

    // جستجو + صفحه‌بندی
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.querySelector('.pagination');

    if (searchInput && paginationContainer) {

        let allPosts = Array.from(document.querySelectorAll('.blog-post-card'));
        let currentPage = 1;
        let filteredPosts = [...allPosts];

        const getPostsPerPage = (pageNum) => {
            if (pageNum === 1) return 6;
            return 3;
        };

        const renderPosts = () => {
            allPosts.forEach(post => post.style.display = 'none');

            let start = 0;
            for (let i = 1; i < currentPage; i++) {
                start += getPostsPerPage(i);
            }
            const end = start + getPostsPerPage(currentPage);

            filteredPosts.slice(start, end).forEach(post => {
                post.style.display = 'flex';
            });

            document.querySelectorAll('.pagination .page').forEach(btn => {
                if (btn.classList.contains('next') || btn.textContent === '...') return;
                const btnPage = parseInt(btn.textContent);
                if (btnPage === currentPage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        };

        const filterPosts = (searchTerm) => {
            const term = searchTerm.toLowerCase().trim();

            filteredPosts = allPosts.filter(post => {
                const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
                return term === '' || title.includes(term);
            });

            currentPage = 1;
            renderPosts();
        };

        searchInput.addEventListener('input', (e) => {
            filterPosts(e.target.value);
        });

        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                filterPosts(searchInput.value);
            });
        }

        document.querySelectorAll('.pagination .page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                if (btn.textContent === '...') return;

                if (btn.classList.contains('next')) {
                    if (currentPage < 5) {
                        currentPage++;
                        renderPosts();
                    }
                } else {
                    const pageNum = parseInt(btn.textContent);
                    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 5) {
                        currentPage = pageNum;
                        renderPosts();
                    }
                }
            });
        });

        renderPosts();
    }

});
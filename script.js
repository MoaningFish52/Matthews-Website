function handleScroll(targetHref) {
    if (targetHref === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const targetElement = document.querySelector(targetHref);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function resetMenuIcon(button) {
    const iconContainer = button.querySelector('i');
    if (iconContainer && typeof lucide !== 'undefined') {
        iconContainer.innerHTML = lucide.createIcons({'tag': 'i', 'name': 'menu', 'attributes': {'class': 'w-6 h-6'}}).outerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 100); 
    }

    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            const iconContainer = menuButton.querySelector('i');
            
            if (!isHidden && typeof lucide !== 'undefined') {
                iconContainer.innerHTML = lucide.createIcons({'tag': 'i', 'name': 'x', 'attributes': {'class': 'w-6 h-6'}}).outerHTML;
            } else if (isHidden) { 
                resetMenuIcon(menuButton);
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    resetMenuIcon(menuButton);
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            handleScroll(this.getAttribute('href'));
        });
    });

    const scrollTopButton = document.getElementById('scroll-to-top');
    const scrollThreshold = 300; 
    
    if (scrollTopButton) {
        window.addEventListener('scroll', function() {
            if (document.body.scrollTop > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });

        scrollTopButton.addEventListener('click', function() {
            handleScroll('#');
        });
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile navigation element if it doesn't exist
    if (!document.querySelector('.mobile-nav')) {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        // Clone the desktop navigation menu
        const desktopNav = document.querySelector('.main-nav ul');
        if (desktopNav) {
            mobileNav.innerHTML = `<ul>${desktopNav.innerHTML}</ul>`;
            document.body.appendChild(mobileNav);
        }
        
        // Create overlay for mobile menu
        if (!document.querySelector('.overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
        }
    }
    
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav ul li a');
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (hamburger.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on the overlay
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a navigation link
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Scroll down functionality
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            // Scroll to the section below hero or a specified distance
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});
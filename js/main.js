// Main JavaScript file for Energy Wise website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle between hamburger and close icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    if (testimonials.length > 0 && prevBtn && nextBtn) {
        // Initialize testimonials
        updateTestimonials();
        
        // Previous button click
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonials();
        });
        
        // Next button click
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonials();
        });
        
        // Auto slide every 5 seconds
        setInterval(function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonials();
        }, 5000);
        
        function updateTestimonials() {
            testimonials.forEach((testimonial, index) => {
                if (index === currentIndex) {
                    testimonial.style.display = 'block';
                    testimonial.classList.add('animate-fade-in');
                } else {
                    testimonial.style.display = 'none';
                    testimonial.classList.remove('animate-fade-in');
                }
            });
        }
    }
    
    // Accessibility features
    const accessibilitySettings = {
        highContrast: false,
        largeText: false
    };
    
    // Function to toggle high contrast mode
    function toggleHighContrast() {
        accessibilitySettings.highContrast = !accessibilitySettings.highContrast;
        document.body.classList.toggle('high-contrast', accessibilitySettings.highContrast);
        localStorage.setItem('highContrast', accessibilitySettings.highContrast);
    }
    
    // Function to toggle large text mode
    function toggleLargeText() {
        accessibilitySettings.largeText = !accessibilitySettings.largeText;
        document.body.classList.toggle('large-text', accessibilitySettings.largeText);
        localStorage.setItem('largeText', accessibilitySettings.largeText);
    }
    
    // Load saved accessibility settings
    if (localStorage.getItem('highContrast') === 'true') {
        accessibilitySettings.highContrast = true;
        document.body.classList.add('high-contrast');
    }
    
    if (localStorage.getItem('largeText') === 'true') {
        accessibilitySettings.largeText = true;
        document.body.classList.add('large-text');
    }
    
    // Expose accessibility functions globally
    window.toggleHighContrast = toggleHighContrast;
    window.toggleLargeText = toggleLargeText;
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const animateElements = document.querySelectorAll('.feature-card, .step, .impact-stat');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animate-fade-in');
        });
    }
});
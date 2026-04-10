// School Management Website - Main JavaScript
// Author: AI Assistant
// Date: April 2026

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functions
    initNavigation();
    initModals();
    initSliders();
    initCounters();
    initForms();
});

// Navigation Toggle for Mobile
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav ul');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Modal Functions
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closes = document.querySelectorAll('.close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });
    
    closes.forEach(close => {
        close.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Slider Functions
function initSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const items = slider.querySelectorAll('.slider-item');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        
        let currentIndex = 0;
        
        function updateSlider() {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % items.length;
                updateSlider();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateSlider();
            });
        }
        
        // Auto slide
        setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateSlider();
        }, 5000);
    });
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Form Validation
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Special handling for feedback form
                if (form.id === 'feedback-form') {
                    submitFeedbackForm(form);
                } else {
                    // Simulate form submission
                    alert('Form submitted successfully!');
                    form.reset();
                }
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            field.style.borderColor = 'red';
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function submitFeedbackForm(form) {
    const formData = new FormData(form);
    
    const feedback = {
        name: formData.get('name'),
        email: formData.get('email'),
        type: formData.get('type'),
        rating: formData.get('rating'),
        message: formData.get('message'),
        submittedDate: new Date().toISOString()
    };
    
    // Save to localStorage
    const feedbacks = getFromLocalStorage('feedbacks') || [];
    feedbacks.push(feedback);
    saveToLocalStorage('feedbacks', feedbacks);
    
    showNotification('Thank you for your feedback! We appreciate your input.', 'success');
    form.reset();
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
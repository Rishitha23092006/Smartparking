// Common utility functions

// CSRF token for Django
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return cookieValue;
}

// Toast notification system
class Toast {
    static show(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';

        toast.innerHTML = `
            <i class="${icon}"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// API helper
class API {
    static async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            credentials: 'same-origin',
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Network error' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    static get(url) {
        return this.request(url);
    }

    static post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

// Loading state management
class Loading {
    static show(element) {
        element.style.display = 'block';
    }

    static hide(element) {
        element.style.display = 'none';
    }
}

// Make classes globally available
window.Toast = Toast;
window.API = API;
window.Loading = Loading;
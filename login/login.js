document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const signupLink = document.getElementById('signupLink');
    const signupContainer = document.querySelector('.signup-container');
    const loginContainer = document.querySelector('.login-container');
    const signupForm = document.getElementById('signupForm');
    const signupErrorMessage = document.getElementById('signupErrorMessage');
    const loginLink = document.getElementById('loginLink');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            errorMessage.textContent = 'Please fill in all fields.';
            return;
        }
        
        // Simple validation - in a real app, this would be server-side
        if (username.length < 3 || password.length < 6) {
            errorMessage.textContent = 'Invalid credentials. Username must be at least 3 characters, password at least 6.';
            return;
        }
        
        // Store login status
        localStorage.setItem('nutrilens_logged_in', 'true');
        localStorage.setItem('nutrilens_username', username);
        
        // Redirect to main app
        window.location.href = '../nutrilens_mobile.html';
    });

    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
        errorMessage.textContent = '';
        signupErrorMessage.textContent = '';
    });

    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        errorMessage.textContent = '';
        signupErrorMessage.textContent = '';
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const signupUsername = document.getElementById('signupUsername').value.trim();
        const signupEmail = document.getElementById('signupEmail').value.trim();
        const signupPassword = document.getElementById('signupPassword').value.trim();

        if (!signupUsername || !signupEmail || !signupPassword) {
            signupErrorMessage.textContent = 'Please fill in all fields.';
            return;
        }

        if (signupUsername.length < 3) {
            signupErrorMessage.textContent = 'Username must be at least 3 characters.';
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(signupEmail)) {
            signupErrorMessage.textContent = 'Please enter a valid email address.';
            return;
        }

        if (signupPassword.length < 6) {
            signupErrorMessage.textContent = 'Password must be at least 6 characters.';
            return;
        }

        // Save user data to localStorage (for demo purposes only)
        const users = JSON.parse(localStorage.getItem('nutrilens_users') || '{}');
        if (users[signupUsername]) {
            signupErrorMessage.textContent = 'Username already exists.';
            return;
        }

        users[signupUsername] = {
            email: signupEmail,
            password: signupPassword
        };
        localStorage.setItem('nutrilens_users', JSON.stringify(users));

        alert('Sign up successful! You can now log in.');

        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        signupForm.reset();
        signupErrorMessage.textContent = '';
    });
});

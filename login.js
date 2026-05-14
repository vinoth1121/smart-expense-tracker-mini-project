// =============================
// LOGIN SYSTEM
// =============================

const loginForm =
    document.getElementById('login-form');

// =============================
// LOGIN EVENT
// =============================

loginForm.addEventListener(
    'submit',
    function (e) {

        e.preventDefault();

        // Get Values

        const email =
            document.getElementById('email').value;

        const password =
            document.getElementById('password').value;

        // Demo Login Validation

        if (
            email === 'admin@gmail.com'
            &&
            password === 'admin123'
        ) {

            // Save Login Status

            localStorage.setItem(
                'isLoggedIn',
                'true'
            );

            // Success Message

            alert('Login Successful 🚀');

            // Redirect

            window.location.href =
                'index.html';
        }

        else {

            alert(
                'Invalid Email or Password'
            );
        }
    }
);

// =============================
// AUTO LOGIN CHECK
// =============================

if (
    localStorage.getItem('isLoggedIn')
    === 'true'
) {

    window.location.href =
        'index.html';
}
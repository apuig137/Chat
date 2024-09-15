const form = document.getElementById('login-form-items');
const userInput = document.querySelector('.user-input');
const passwordInput = document.querySelector('.password-input');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('https://livechat-zk2w.onrender.com/user/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if (result.status === 200) {
            window.location.replace('/');
        } else {
            userInput.value = "";
            passwordInput.value = "";
            alert("Error al iniciar sesión");
        }
    })
    .catch(error => {
        console.error('Error en la solicitud fetch:', error);
    });
});
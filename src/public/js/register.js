const form = document.getElementById('register-form-items');

form.addEventListener('submit', e => {
    console.log("inicio")
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('https://livechat-zk2w.onrender.com/user/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if (result.status === 200) {
            window.location.replace('/login');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud fetch:', error);
    });
});
let user = localStorage.getItem('user');
if (user) {
    window.location.href = '/index.html';
}

document.getElementById('login').addEventListener('click', function () {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (username && password) {
        let data = {
            username: username,
            password: password
        };
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }).then(function (response) {
            response.json().then(function (data) {
                if (response.status === 200) {
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = '/index.html';
                } else {
                    alert(data.message);
                }
            });
        }).catch(function (error) {
            alert('Der er sket en ukendt fejl')
            console.log(error);
        });
    } else {
        alert('Indtast brugernavn og adgangskode');
    }
});
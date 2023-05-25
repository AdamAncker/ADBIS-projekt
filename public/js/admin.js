let user = localStorage.getItem('user');
if (!user) {
    window.location.href = '/login.html';
} else {
    user = JSON.parse(user);
    document.getElementById('username').innerHTML = user.username;
}

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});
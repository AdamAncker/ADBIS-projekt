let user = localStorage.getItem('user');
if (!user) {
    window.location.href = '/login.html';
} else {
    user = JSON.parse(user);
    document.getElementById('username').innerHTML = user.username;
}

fetchCustomers();
function fetchCustomers() {
    fetch(`/api/users/${user.id}/customers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    }).then(function (response) {
        response.json().then(function (data) {
            if (response.status === 200) {
                let customersTableBody = "";
                for (let i = 0; i < data.length; i++) {
                    customersTableBody += `<tr>
                    <td>${data[i].name}</td>
                    </tr>`;
                }
                document.getElementById('customer-table-body').innerHTML = customersTableBody;
            } else {
                alert(data.message);
            }
        });
    }).catch(function (error) {
        alert('Der er sket en ukendt fejl')
        console.log(error);
    });
}

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});
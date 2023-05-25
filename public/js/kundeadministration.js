let user = localStorage.getItem('user');
if (!user) {
    window.location.href = '/login.html';
} else {
    user = JSON.parse(user);
    document.getElementById('username').innerHTML = user.username;
}

function showAlert(event) {
  alert("Tildeling af datakategori(er) udført.");
  event.preventDefault();
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
        let customerDropdownOptions = "";
        let customerCheckboxes = "";
        for (let i = 0; i < data.length; i++) {
          const customerName = data[i].name;
          customerDropdownOptions += `<option value="${customerName}">${customerName}</option>`;
          customerCheckboxes += `<div>
            <input type="checkbox" id="${customerName}" name="customer" value="${customerName}">
            <label for="${customerName}">${customerName}</label>
          </div>`;
        }
        document.getElementById('customer-dropdown').innerHTML = customerDropdownOptions;
        document.getElementById('customer-checkboxes').innerHTML = customerCheckboxes;
      } else {
        alert(data.message);
      }
    });
  }).catch(function (error) {
    alert('An unknown error has occurred');
    console.log(error);
  });
}

function addCustomCategory(event) {
  event.preventDefault();
  
  const categoryContainer = document.getElementById('category-checkboxes');
  const customCategory = prompt('Indtast navnet for den nye datakategori:');
  
  if (customCategory !== null && customCategory.trim() !== '') {
    const customCategoryCheckbox = document.createElement('div');
    customCategoryCheckbox.innerHTML = `
      <div>
        <input type="checkbox" id="${customCategory}" name="category" value="${customCategory}">
        <label for="${customCategory}">${customCategory}</label>
        <div class="remove-button">
          <button onclick="removeCategory('${customCategory}')" class="btn">Fjern</button>
        </div>
      </div>
    `;
    
    categoryContainer.appendChild(customCategoryCheckbox);
  }
}

function removeCategory(categoryId) {
  const categoryElement = document.getElementById(categoryId);
  categoryElement.parentNode.remove();
}


document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});
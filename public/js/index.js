let user = localStorage.getItem('user');
if (!user) {
    window.location.href = '/login.html';
} else {
    user = JSON.parse(user);
    document.getElementById('username').innerHTML = user.username;
}

let questionPage = 0;
let data = {};
let questions = [
    {
        title: "Vælg ticket type",
        type: "select",
        choices: ["Ny data", "Mangelfuld data"],
        property: "ticketType"
    },
    {
        title: "Vælg dato",
        type: "date",
        property: "date"
    },
    {
        title: "Vælg kunde",
        type: "select",
        choices: [],
        property: "customer"
    },
    {
        title: "Vælg miljø",
        type: "select",
        choices: [],
        property: "environment"
    },
    {
        title: "Vælg datakategori",
        type: "select",
        choices: [],
        property: "dataCategory"
    }
]

generateForm(questions[questionPage]);

function generateForm(question) {
    document.getElementById("content-box").innerHTML = "";

    //Header
    document.getElementById("content-box").innerHTML += `<img src="./images/kmd-vector-dark.svg"><h3 class="mb-4">${question.title}</h3>`;

    //Content
    switch (question.type) {
        case "select":
            let options = "<option value='' selected disabled>Vælg en mulighed</option>";
            for (let i = 0; i < question.choices.length; i++) {
                if (typeof question.choices[i] == 'object') {
                    options += `<option value="${question.choices[i].id}">${question.choices[i].name}</option>`
                } else {
                    options += `<option value="${question.choices[i]}">${question.choices[i]}</option>`
                }
            }
            document.getElementById("content-box").innerHTML += `<div class="form-floating">
            <select class="form-select" id="valueInput">
               ${options}
            </select>
            <label for="valueInput">${question.title}</label>
            </div>`
            break;
        case "text":
            break;
        case "date":
            document.getElementById("content-box").innerHTML += `<div class="input-group mb-3">
                <input id="valueInput" type="date" class="form-control">
              </div>`
    }

    //Footer
    document.getElementById("content-box").innerHTML += `
            <div class="d-flex mt-4 justify-content-between">
               ${questionPage != 0 ? '<button type="button" class="btn btn-secondary" onclick="previousQuestion()">Tilbage</button>' : '<div></div>'}
               <button type="button" class="btn btn-success" onclick="nextQuestion()">${questionPage == questions.length - 1 ? 'Opret' : 'Næste'}</button>
            </div>`
}

function previousQuestion() {
    //Skip page if 'Ny data' is selected
    if (questions[questionPage - 1].property == "date" && data.ticketType == "Ny data") {
        questionPage--;
    }

    questionPage--;
    data[questions[questionPage].property] = "";
    generateForm(questions[questionPage]);
}

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
                questions[questionPage].choices = [];
                for (let i = 0; i < data.length; i++) {
                    questions[questionPage].choices.push(data[i]);
                }
                generateForm(questions[questionPage]);
            } else {
                alert(data.message);
            }
        });
    }).catch(function (error) {
        alert('Der er sket en ukendt fejl')
        console.log(error);
    });
}

function fetchEnvironments() {
    fetch(`/api/customers/${data[questions[2].property]}/environments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    }).then(function (response) {
        response.json().then(function (data) {
            if (response.status === 200) {
                questions[questionPage].choices = [];
                for (let i = 0; i < data.length; i++) {
                    questions[questionPage].choices.push(data[i]);
                }
                generateForm(questions[questionPage]);
            } else {
                alert(data.message);
            }
        });
    }).catch(function (error) {
        alert('Der er sket en ukendt fejl')
        console.log(error);
    });
}

function fetchCategories() {
    fetch(`/api/customers/${data[questions[2].property]}/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        }
    }).then(function (response) {
        response.json().then(function (data) {
            if (response.status === 200) {
                questions[questionPage].choices = [];
                for (let i = 0; i < data.length; i++) {
                    questions[questionPage].choices.push(data[i]);
                }
                generateForm(questions[questionPage]);
            } else {
                alert(data.message);
            }
        });
    }).catch(function (error) {
        alert('Der er sket en ukendt fejl')
        console.log(error);
    });
}

function nextQuestion() {
    data[questions[questionPage].property] = document.getElementById("valueInput").value;

    //Skip page if 'Ny data' is selected
    if (questions[questionPage].property == "ticketType" && data.ticketType == "Ny data") {
        data[questions[questionPage + 1].property] = "-"
        questionPage++;
    }

    if (!data[questions[questionPage].property]) {
        alert("Du skal indtaste noget for at gå videre");
    } else if (questionPage == questions.length - 1) {
        //Submit
        questionPage++;
        //saveTicket(data);
        showGeneratedTicket(data);
    } else {
        //Next page
        questionPage++;

        switch (questions[questionPage].property) {
            case "customer":
                fetchCustomers();
                break;
            case "environment":
                fetchEnvironments();
                break;
            case "dataCategory":
                fetchCategories();
                break;
            default:
                generateForm(questions[questionPage]);
                break;
        }
    }
}

function saveTicket(ticketData) {
    fetch(`/api/users/${user.id}/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(ticketData)
    }).then(function (response) {
        response.json().then(function (data) {
            alert(data.message);
        });
    }).catch(function (error) {
        alert('Der er sket en ukendt fejl')
        console.log(error);
    });
}

function showGeneratedTicket() {
    document.getElementById("content-box").innerHTML = `<img src="./images/kmd-vector-dark.svg"><h3 class="mb-4">Genereret ticket</h3>`;
    document.getElementById("content-box").innerHTML += `<div class="mb-3">
    <label for="ticketDescription" class="form-label">Ticket beskrivelse</label>
    <textarea class="form-control" id="ticketDescription" rows="5"></textarea>
    </div>`

    document.getElementById("content-box").innerHTML += `<div class="mb-3">
    <label for="shortDescription" class="form-label">Kort beskrivelse</label>
    <textarea class="form-control" id="shortDescription" rows="2"></textarea>
    </div>`

    document.getElementById("content-box").innerHTML += `<div class="d-flex mt-4 justify-content-between">
    <button type="button" class="btn btn-secondary" onclick="previousQuestion()">Tilbage</button>
    <button type="button" class="btn btn-success" onclick="generateUrl()">Generér URL</button>
    </div>`

    let customer = questions[2].choices.find(customer => customer.id == data.customer).name;
    let environment = questions[3].choices.find(environment => environment.id == data.environment).name;
    let dataCategory = questions[4].choices.find(dataCategory => dataCategory.id == data.dataCategory).name;

    document.getElementById("ticketDescription").value = `Ticket type: ${data.ticketType} \nDato: ${data.date} \nKunde: ${customer} \nMiljø: ${environment} \nDatakategori: ${dataCategory}`;
    document.getElementById("shortDescription").value = `${data.ticketType} ${dataCategory} for ${customer}`;
}

function generateUrl() {
    let url = "https://my_company.service-now.com/nav_to.do?uri=incident.do?sys_id=1234567890abcdef&sysparm_view=all&sysparm_display_value=true&sysparm_query=priority=1^category=hardware^assignment_group=IT%20Support";

    document.getElementById("content-box").innerHTML = `<img src="./images/kmd-vector-dark.svg"><h3 class="mb-4">Genereret URL</h3>`;
    document.getElementById("content-box").innerHTML += `<div class="mb-3">
    <label for="url" class="form-label">URL</label>
    <input type="text" class="form-control" id="url" value="${url}">
  </div>`

    document.getElementById("content-box").innerHTML += `<div class="d-flex mt-4 justify-content-between">
    <button type="button" class="btn btn-secondary" onclick="showGeneratedTicket()">Tilbage</button>
    <button type="button" class="btn btn-warning" onclick="copyUrl()">Kopier URL</button>
    <button type="button" class="btn btn-success" onclick="gotoUrl()">Gå til ServiceNow</button>
    </div>`
}

function copyUrl() {
    let url = document.getElementById("url");
    url.select();
    url.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function gotoUrl() {
    window.open(document.getElementById("url").value);
}

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});
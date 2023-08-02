let email = document.getElementById('email');
let password = document.getElementById('password');

const urlParams = new URLSearchParams(window.location.search);
const errorValue = urlParams.get('error');

// Проверяем наличие параметра 'error' и обрабатываем его значение
if (errorValue === '1') {
    document.getElementById('findAcc').style.display = "block"
    document.getElementById('quest').style.marginTop = "15px"
} else {
    document.getElementById('findAcc').style.display = "none"
}

document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the standard form submission

    const formData = { email:email.value, password:password.value };
    console.log(formData); // Corrected the variable name here

    fetch('/signing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.status === 200) {
                window.location.href = '/'; // Redirect to the specified URL
            }
            return response.json()
        }).then(data => {
        document.getElementById("error").innerText = "Данные не корректны"
    })
        .catch(error => {
            console.error('Error:', error);
        });

});
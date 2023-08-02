const surname = document.getElementById("surname")
const lastname = document.getElementById("lastname")
const dateInput = document.getElementById('date');
const email = document.getElementById("email")
const password = document.getElementById("password")
const replypassword = document.getElementById("replypassword")
const buttonGetCode = document.getElementById('nextOneGetCode')
const inputs = document.querySelectorAll('.square-input');
//Кноки для перехода на этапы
const firstStapButton = document.getElementById('nextOne')



firstStapButton.addEventListener('click', () => {
    document.getElementById('firstScreen').style.display = 'none'
    document.getElementById('secondStap').style.display = 'block'
})

inputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const value = event.target.value;

        if (value.length > 6) {
            input.value = value.substr(0, 6); // Усечение значения до первых 6 символов
        } else {
            const squares = document.querySelectorAll('.square');

            for (let i = 0; i < squares.length; i++) {
                squares[i].textContent = value[i] || '';

                // Если value[i] содержит текст, добавляем класс "activeSquare"
                if (value[i]) {
                    squares[i].classList.add('activeSquare');
                } else {
                    squares[i].classList.remove('activeSquare');
                }
            }

            if (index < inputs.length - 1 && value.length === 1) {
                inputs[index + 1].focus();
            }
        }
    });
}); // Прорисовка кода подтверждения в квадратиках
surname.addEventListener("input", (event) => {
    const input = event.target;
    const value = input.value;
    const regex = /^[A-Za-zА-Яа-яЁё\s]+$/; // Разрешены буквы и пробелы

    if (!regex.test(value)) {
        // Если введены недопустимые символы, удалить их из значения
        input.value = value.replace(/[^A-Za-zА-Яа-яЁё\s]/g, "");
    }

    // Проверка максимальной и минимальной длины строки
    if (value.length > 32) {
        input.value = value.slice(0, 32);
    } else if (value.length < 2) {
        input.setCustomValidity("Минимальная длина - 2 символа");
    } else {
        input.setCustomValidity("");
    }
});
lastname.addEventListener("input", (event) => {
    const input = event.target;
    let value = input.value; // Используйте let вместо const

    const regex = /^[A-Za-zА-Яа-яЁё\s]+$/;

    if (!regex.test(value)) {
        input.value = value.replace(/[^A-Za-zА-Яа-яЁё\s]/g, "");
    }

    if (value.length > 32) {
        input.value = value.slice(0, 32);
    } else if (value.length < 2) {
        input.setCustomValidity("Минимальная длина - 2 символа");
    } else {
        input.setCustomValidity("");
    }
});
dateInput.addEventListener('input', (event) => {
    const input = event.target;
    const inputValue = input.value.replace('.','').replace(/[^\d.]/g, ''); // Удаляем все символы, кроме цифр и точек
    let formattedValue = '';

    if (inputValue.length > 0) {
        // Форматируем дату, добавляя точки только там, где они отсутствуют
        formattedValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');
    }

    input.value = formattedValue;

    // Проверяем, что введенная дата меньше текущей даты
    const currentDate = new Date();
    const enteredDate = new Date(inputValue.slice(6, 10), inputValue.slice(3, 5) - 1, inputValue.slice(0, 2));

    if (enteredDate >= currentDate) {
        // Введенная дата больше или равна текущей дате, показываем ошибку
        input.setCustomValidity('Дата должна быть меньше текущей');
    } else {
        // Введенная дата меньше текущей даты, сбрасываем ошибку
        input.setCustomValidity('');
    }
});
const labels = document.querySelectorAll('.roles label');
function handleRadioChange(event) {
    // Удаляем класс .active у всех label
    labels.forEach(label => label.classList.remove('active'));

    // Присваиваем класс .active только выбранному label
    const selectedLabel = event.target.closest('label');
    if (selectedLabel) {
        selectedLabel.classList.add('active');
    }
}

// Назначаем обработчик события change для каждой радиокнопки
labels.forEach(label => {
    const radioInput = label.querySelector('input[type="radio"]');
    radioInput.addEventListener('change', handleRadioChange);
});
buttonGetCode.addEventListener('click', ()=> {
    const data = {
        email: email.value
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Преобразуем данные в JSON-строку для отправки
    };

    fetch('verefyEmail', requestOptions)
        .then(response => response.json()) // Заменяем .json() на .text()
        .then(data => {
            // Выводим текст ответа сервера для отладки
            console.log(data);
            if (data.message) {
                buttonGetCode.style.display = "none"
                setTimeout(() => {
                    buttonGetCode.style.display = "block"
                },65*1000)
            }
            document.getElementById('errorEmail').innerText = data.message || data.error
        })
        .catch(error => {
            // Обработка ошибок, если что-то пошло не так
            console.error('Письмо уже отправлено:', error);
        });
})
const codeVery = document.getElementById('codeVery');
codeVery.addEventListener('input', (event) => {
    let target = codeVery.value.trim();
    console.log(target);
    if (target.length === 6) {
        let data = {
            code: target,
            email: email.value
        };
        fetch('/verefyCodeOnEmail', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response.status)
            if (response.status === 200) {
                document.getElementById('secondStap').style.display = 'none'
                document.getElementById('theerdStap').style.display = 'block'
            }
            else {
                document.getElementById('notCode').innerText = "Не верный код"
                setTimeout(() => {
                    document.getElementById('notCode').style.display = "none"
                },5000)
                return  false
            }
        })
    }
});
// Функция для проверки пароля на наличие хотя бы одной заглавной буквы
function hasUppercase(str) {
    return /[A-Z]/.test(str);
}

// Функция для проверки паролей на соответствие и вывод сообщения об ошибке
function validatePasswords() {
    const password1 = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const errorMessage = document.getElementById('password-error-message');
    const lastButton = document.getElementById('last');

    if (password1 !== password2) {
        errorMessage.textContent = 'Пароли не совпадают';
        lastButton.style.display = 'none';
        return false;
    }

    if (password1.length < 6) {
        errorMessage.textContent = 'Минимальная длина пароля - 6 символов';
        lastButton.style.display = 'none';
        return false;
    }

    if (!hasUppercase(password1)) {
        errorMessage.textContent = 'Пароль должен содержать хотя бы одну заглавную букву';
        lastButton.style.display = 'none';
        return false;
    }

    errorMessage.textContent = '';
    lastButton.style.display = 'block';
    return true;
}
const form = document.getElementById('myForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const formDataValues = formData.values();

    for (const value of formDataValues) {
        if (!value.trim()) {
            document.getElementById('errorMessage').innerText = "Заполните все обязательные поля";
            setTimeout(() => {
                window.location.href = '/registration'
            }, 3000);
            return false;
        }
    }

    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    console.log(formDataObject);

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
        .then(response => {
            console.log(response.status, " - статус");
            if (response.ok && response.status === 200) {
                window.location.href = '/';
                return true
            } else if (response.status === 500) {
                document.getElementById('errorMessage').innerText = "Произошла ошибка при сохранении данных";
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
            document.getElementById('errorMessage').innerText = data.message || "Успех!";
            }
            else {
                return false
            }
        })
        .catch(error => {
            // Handle JSON parsing error
            document.getElementById('errorMessage').innerText = "Возникла ошибка при обработке данных";
        })
        .finally(() => {
            // Redirect to registration page after handling the 400 error
            setTimeout(() => {
                window.location.href = '/registration';
            }, 3000);
        })
});


    document.getElementById('password').addEventListener('input', validatePasswords);
document.getElementById('password2').addEventListener('input', validatePasswords);

const dateInput = document.getElementById('date')
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



    fetch('/appendData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
        .then(response => {

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
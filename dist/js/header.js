$(document).ready(function() {
    const $burgerButton = $(".burger");
    const $mobileMenu = $(".mobile");
    const $main = $('main');
    const $openClose = $('.open-close');

    $burgerButton.on("click", function() {
        $mobileMenu.toggle(); // Переключение видимости мобильного меню
        $burgerButton.toggleClass("rotate-burger"); // Добавление/удаление класса для поворота иконки бургера
    });
    $main.on('click touchstart', function () {
        $mobileMenu.css('display', 'none')
        $burgerButton.removeClass('rotate-burger')
    })
    $('.open-close').on('click', function() {
        var paragraph = $(this).siblings('p');

        console.log(this)
        $(this).toggleClass('rotate')
         paragraph.toggleClass('some-class');
    });

    $(".response").click(function() {
        // Используем метод slideToggle() для плавного открытия/скрытия элемента с классом "request"
        $(this).find(".request").slideToggle();
        $(this).toggleClass("responseClick")
        $(this).find('.text').toggleClass('while')
    });

    $("#openModal").click(function() {
        $(".modal").css('display', 'flex');
    });
    // Обработчик для клика по кнопке "Назад"
    $('#backBtn').click(function() {
        $(".modal").css('display', 'none');
    });
});

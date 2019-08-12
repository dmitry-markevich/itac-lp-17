/* Прайс-лист */

var lpApp = angular.module('lpApp', []);

lpApp.controller('lpPriceCtrl', function ($scope, $http) {

    $http.get('price.json').then(function (res) {
        $scope.prices = res.data;
        $scope.calc();
        $scope.sortGet();
    }).catch(function (err) {
        $scope.reqStatus = err.status;
        $scope.reqStatusText = err.statusText;
    });

    $scope.sortSet = function (propertyName) {
        if ($scope.sortBy == propertyName) {
            $scope.sortRev = !$scope.sortRev;
        }
        $scope.sortBy = propertyName;
        localStorage.sortBy = $scope.sortBy;
        localStorage.sortRev = $scope.sortRev;
    }

    $scope.sortGet = function () {
        if (localStorage.sortBy && localStorage.sortRev) {
            $scope.sortBy = localStorage.sortBy;
            $scope.sortRev = (localStorage.sortRev == 'true');
        } else {
            $scope.sortBy = 'name';
            $scope.sortRev = false;
        }
    }

    $scope.calc = function () {
        $scope.prices.forEach(function (price) {
            price.price2 = price.price * (1 - price.discount);
        });
    }
});

/* jQuery */

(function ($) {
    $(document).ready(function () {

        var lpReady = false;

        function lpGoToActive() {

            var lpPath = window.location.pathname.replace('/', ''),
                lpTrgt;

            if (lpPath != '') {

                lpTrgt = $('#' + lpPath);

                if (lpTrgt.length > 0) {

                    $('body, html').scrollTop(lpTrgt.offset().top - 44);
                }
            }

            setTimeout(function () {

                lpReady = true;

            }, 500);
        }

        lpGoToActive();
        $(window).on('load', lpGoToActive);

        /* Панель навигации */
        // Описываем функцию, которая
        function lpHeader() {
            if ($(window).scrollTop() == 0) { // Если находимся в начале страницы
                $('header').addClass('top'); // Добавляет класс top для панели
            } else { // Иначе
                $('header.top').removeClass('top'); // Удаляет его
            }
        }
        // Вызываем эту функцию
        lpHeader(); // Единожды при загрузке страницы
        $(window).on('load scroll', lpHeader); // И каждый раз при скролле

        /* Плавный скролл при клике на ссылку в меню */
        // Помещаем в переменную ссылку на меню
        var lpNav = $('header ul');
        // При клике на ссылку в меню
        lpNav.find('li a').on('click', function (e) {
            // Определяем элемент на странице, на который ссылается ссылка по ID
            var trgtSelector = $(this).attr('href'),
                linkTrgt = $(trgtSelector);
            if (linkTrgt.length > 0) { // Если такой элемент присутствует
                e.preventDefault(); // Отменяем переход по умолчанию
                var offset = linkTrgt.offset().top; // Определяем отступ целевого элемента от начала документа
                $('body, html').animate({
                    scrollTop: offset - 44
                }, 750); // Плавно скролим документ к этому месту
            }
        });

        /* Отслеживание активного экрана */
        // Описываем функцию, которая вычисляет активный экран
        function lpSetNavActive() {
            // В этой переменной в конце each будет ID активного экрана
            var curItem = '';
            // Чтобы он туда попал, перебираем все экраны
            $('section').each(function () {
                // И если положение экрана от начала страницы меньше текущего скролла
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    curItem = $(this).attr('id'); // В переменную вносим ID этого экрана
                }
            });

            // Далее, если href ссылки внутри активного пункта меню не совпадает с ID найденного нами активного экрана
            var noActiveItem = lpNav.find('li.active').length == 0,
                // Либо активные элементы отсутствуют в меню
                newActiveRequired = lpNav.find('li.active a').attr('href') != '#' + curItem;

            if (noActiveItem || newActiveRequired) {
                // Удаляем класс у текущего активного элемента
                lpNav.find('li.active').removeClass('active');
                // И добавляем класс active пункту, внутри которого лежит ссылка, у которой href совпал с ID активного экрана 
                lpNav.find('li a[href="#' + curItem + '"]').parent().addClass('active');
                // Создаем состояние
                if (lpReady) {
                    window.history.pushState({
                        curItemName: curItem
                    }, curItem, '/' + curItem);
                }
            }
        }
        // Вызываем эту функцию
        lpSetNavActive(); // Единожды при загрузке страницы
        $(window).on('load scroll', lpSetNavActive); // И каждый раз при скролле

        /* Слайдшоу */

        $('.lp-slider1').owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        $('.lp-slider2').owlCarousel({
            items: 3,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        /* Табулятор */

        $('.lp-services').lpTabs();

        /* Всплывающие окна */

        $('.lp-mfp-inline').magnificPopup({
            type: 'inline'
        });

        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });

        /* Формы обратной связи */

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb1-link',
            fbColor: '#7952b3'
        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#7952b3'
        });

        /* Карта */

        $.fn.lpMapInit = function () {

            var lpMapOptions = {
                center: [53.906324, 27.510367],
                zoom: 16,
                controls: ['fullscreenControl', 'zoomControl']
            }

            if (window.innerWidth < 768) {
                lpMapOptions.behaviors = ['multiTouch'];
            } else {
                lpMapOptions.behaviors = ['drag'];
            }

            var lpMap = new ymaps.Map('lp-map', lpMapOptions);

            var lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
                hintContent: 'ИТ Академия',
                balloonContentHeader: 'ИТ Академия',
                balloonContentBody: 'учебные курсы',
                balloonContentFooter: 'пер. 4-й загородный, 56А'
            });

            lpMap.geoObjects.add(lpPlacemark);
        }

    });
})(jQuery);

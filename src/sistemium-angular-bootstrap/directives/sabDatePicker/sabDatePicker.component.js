(function () {

  angular.module('sistemiumBootstrap.directives')
    .component('sabDatePicker', {

      bindings: {
        value: '=',
        minDate: '<',
        maxDate: '<',
        initDate: '<',
        customClass: '<',
        clearText: '@',
        options: '<'
      },

      templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePicker.html',
      controller: sabDatePickerController,
      controllerAs: 'vm'

    });

  var ymdFormat = 'YYYY-MM-DD';

  function sabDatePickerController($scope) {

    var vm = _.assign(this, {

      nextDayClick: nextDayClick,
      prevDayClick: prevDayClick,

      $onInit: onInit

    });

    function onInit() {

      vm.date = dateWithoutTime(vm.value);

      vm.options = _.defaults({
        minDate: vm.minDate && dateWithoutTime(vm.minDate),
        maxDate: vm.maxDate && dateWithoutTime(vm.maxDate),
        initDate: vm.initDate,
        customClass: vm.customClass,
        showWeeks: false
      }, vm.options || {});

      vm.datepickerOptions = _.defaults(vm.options, $scope.datepickerOptions);

      $scope.$watch('vm.value', function (nv, ov) {

        if (ov === nv) {
          return;
        }
        vm.date = dateWithoutTime(vm.value);

      });

      $scope.$watch('vm.date', function (nv) {

        if (!nv || _.isDate(nv) && _.isNaN(nv.getTime())) {
          vm.date = vm.initDate ? dateWithoutTime(vm.initDate) : null;
        }

        vm.value = vm.date ? moment(vm.date.toISOString()).format(ymdFormat) : null;

      });

      $scope.$watch('vm.minDate', function () {

        vm.datepickerOptions = _.defaults({
          minDate: vm.minDate && dateWithoutTime(vm.minDate)
        }, vm.datepickerOptions);

      });

    }

    function dateWithoutTime(date) {
      return moment(moment(date).format(ymdFormat)).toDate();
    }

    function nextDayClick() {
      setValidDate(moment(vm.date.toISOString()).add(1, 'day'));
    }

    function prevDayClick() {
      setValidDate(moment(vm.date.toISOString()).add(-1, 'day'));
    }

    function setValidDate(date) {

      if (vm.datepickerOptions.maxDate) {
        date = _.min([moment(vm.datepickerOptions.maxDate), date]);
      }

      if (vm.datepickerOptions.minDate) {
        date = _.max([moment(vm.datepickerOptions.minDate), date]);
      }

      vm.date = date.toDate();

    }

  }


})();

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
        closeText: '@',
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

      vm.date = vm.value ? dateWithoutTime(vm.value) : null;

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

        vm.date = vm.value ? dateWithoutTime(vm.value) : null;

      });

      $scope.$watch('vm.date', function (nv) {

        if (!isValid(nv)) {
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

    function isValid(date) {
      return date && _.isDate(date) && !_.isNaN(date.getTime());
    }

    function dateWithoutTime(date) {
      return moment(moment(date).format(ymdFormat)).toDate();
    }

    function nextDayClick() {
      var date = vm.date && moment(vm.date.toISOString()).add(1, 'day') || moment();
      setValidDate(date);
    }

    function prevDayClick() {
      var date = vm.date && moment(vm.date.toISOString()).add(-1, 'day') || moment();
      setValidDate(date);
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

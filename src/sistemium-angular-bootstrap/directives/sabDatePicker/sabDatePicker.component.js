(function () {

  angular.module('sistemiumBootstrap.directives')
    .component('sabDatePicker', {

      bindings: {
        value: '=',
        minDate: '<',
        maxDate: '<',
        initDate: '<',
        customClass: '<',
        clearText: '@'
      },

      templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePicker.html',
      controller: sabDatePickerController,
      controllerAs: 'vm'

    });

  function sabDatePickerController($scope) {

    var vm = _.assign(this, {

      nextDayClick: nextDayClick,
      prevDayClick: prevDayClick,

      $onInit: onInit

    });

    function onInit() {

      vm.date = dateWithoutTime(vm.value);

      vm.datepickerOptions = _.defaults({
        minDate: vm.minDate && dateWithoutTime(vm.minDate),
        maxDate: vm.maxDate && dateWithoutTime(vm.maxDate),
        initDate: vm.initDate,
        customClass: vm.customClass,
        showWeeks: false
      }, $scope.datepickerOptions);


      $scope.$watch('vm.value', function (nv, ov) {

        if (ov === nv) {
          return;
        }
        vm.date = dateWithoutTime(vm.value);

      });

      $scope.$watch('vm.date', function (nv) {

        if (!nv) {
          vm.date = dateWithoutTime(vm.initDate);
        }
        vm.value = moment(vm.date.toISOString()).format();

      });

      $scope.$watch('vm.minDate', function () {

        vm.datepickerOptions = _.defaults({
          minDate: vm.minDate && dateWithoutTime(vm.minDate)
        }, vm.datepickerOptions);

      });

    }

    function dateWithoutTime(date) {
      return moment(moment(date).format()).toDate();
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

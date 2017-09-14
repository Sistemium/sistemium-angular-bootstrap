(function () {

  angular.module('sistemiumBootstrap.directives')
    .component('sabDatePickerInput', {

      bindings: {
        value: '=',
        initDate: '<',
        customClass: '<',
        clearText: '@',
        closeText: '@',
        options: '<'
      },

      templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePickerInput.html',
      controller: sabDatePickerInputController,
      controllerAs: 'vm'

    });

  var ymdFormat = 'YYYY-MM-DD';

  function sabDatePickerInputController($scope) {

    var vm = _.assign(this, {

      $onInit: onInit

    });

    function onInit() {

      vm.date = vm.value ? dateWithoutTime(vm.value) : new Date();

      vm.options = _.defaults({
        initDate: vm.initDate,
        value: moment(vm.date.toISOString()).format(ymdFormat) || null,
        customClass: vm.customClass,
        showWeeks: false
      }, vm.options || {});

      vm.datepickerOptions = _.defaults(vm.options, $scope.datepickerOptions);

      $scope.$watch('vm.date', function (nv, ov) {

        if (ov === nv) {
          return;
        }

        vm.value = vm.date ? moment(vm.date.toISOString()).format(ymdFormat) : null;

      });

    }

    function dateWithoutTime(date) {
      return moment(moment(date).format(ymdFormat)).toDate();
    }

  }

})();

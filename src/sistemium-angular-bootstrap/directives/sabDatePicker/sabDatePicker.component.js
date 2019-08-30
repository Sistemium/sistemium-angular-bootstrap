(function () {

  var bindings = {
    value: '=',
    minDate: '<',
    maxDate: '<',
    initDate: '<',
    customClass: '<',
    clearText: '@',
    closeText: '@',
    options: '<',
    ngRequired: '<',
    placeholder: '@'
  };

  angular.module('sistemiumBootstrap.directives')
    .component('sabDatePicker', {

      bindings: bindings,

      templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePicker.html',
      controller: sabDatePickerController,
      controllerAs: 'vm'

    })
    .component('sabDatePickerInput', {

      bindings: bindings,

      templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePickerInput.html',
      controller: sabDatePickerController,
      controllerAs: 'vm'

    })
  ;

  const ymdFormat = 'YYYY-MM-DD';

  function sabDatePickerController($scope) {

    const vm = _.assign(this, {

      nextDayClick: nextDayClick,
      prevDayClick: prevDayClick,

      $onInit: onInit,

      onInputBlur,

      dateFormat: moment.localeData().longDateFormat('L') + ', dd'

    });

    function onInit() {

      vm.date = vm.value ? dateWithoutTime(vm.value) : null;

      vm.dateInputValid = true;

      vm.options = _.defaults({
        minDate: vm.minDate && dateWithoutTime(vm.minDate),
        maxDate: vm.maxDate && dateWithoutTime(vm.maxDate),
        initDate: vm.initDate && dateWithoutTime(vm.initDate),
        customClass: vm.customClass,
        showWeeks: false
      }, vm.options || {});

      vm.datepickerOptions = _.defaults(vm.options, $scope.datepickerOptions);

      vm.altInputFormats = ['yyyy/MM/dd', 'yyyy.MM.dd'];

      vm.placeholder = vm.placeholder || 'Data';

      $scope.$watch('vm.value', function () {

        vm.date = vm.value ? dateWithoutTime(vm.value) : null;
        vm.dateInput = vm.date;

      });

      $scope.$watch('vm.dateInput', function (dateInput, ov) {

        if (dateInput === ov) {
          return;
        }

        vm.dateInputValid = isValid(dateInput);

        if (vm.dateInputValid) {
          vm.date = dateWithoutTime(dateInput);
        } else {
          vm.date = null;
        }

      });

      $scope.$watch('vm.date', function (nv) {

        if (!isValid(nv)) {
          vm.date = null;
        }

        vm.value = vm.date ? moment(vm.date.toISOString()).format(ymdFormat) : null;

      });

      $scope.$watch('vm.minDate', function () {

        vm.datepickerOptions = _.defaults({
          minDate: vm.minDate && dateWithoutTime(vm.minDate)
        }, vm.datepickerOptions);

      });

    }

    function onInputBlur(event) {

      let classes = `${_.get(event, 'relatedTarget.className')} ${_.get(event, 'relatedTarget.parentNode.className')}`;

      // to prevent closing if clicked somewhere inside a calendar popover
      if (!/uib-/.test(classes)) {
        $scope.$evalAsync(() => $scope.datepickerPopupOpened = false);
      }

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

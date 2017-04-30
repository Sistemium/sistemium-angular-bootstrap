'use strict';

(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('sistemiumBootstrap.config', [])
    .value('sistemiumBootstrap.config', {
      debug: true
    });

  // Modules
  angular.module('sistemiumBootstrap.dependencies', [
    'ui.bootstrap',
    'ngTable'
  ])
    .config(['$uibTooltipProvider', function ($uibTooltipProvider) {
      $uibTooltipProvider.options({trigger: 'outsideClick'});
    }]);

  angular.module('sistemiumBootstrap.directives', []);
  angular.module('sistemiumBootstrap.filters', []);
  angular.module('sistemiumBootstrap.services', []);
  angular.module('sistemiumBootstrap',
    [
      'sistemiumBootstrap.dependencies',
      'sistemiumBootstrap.config',
      'sistemiumBootstrap.directives',
      'sistemiumBootstrap.filters',
      'sistemiumBootstrap.services'
    ]);

})();

(function () {

  angular.module('sistemiumBootstrap.services')
    .service('sabErrorsService', function () {

      var errors = [];

      var msg = {
        unknown: function (lang) {
          switch (lang || 'en') {

            case 'en':
              return 'Unknown error';
            case 'ru':
              return 'Неизвестная ошибка';

          }
        }
      };

      function parseError(e, lang) {

        var data = e && e.data && e.data.length > 0 && e.data ||
            [e]
          ;

        data.forEach (function (errObj) {
          errors.push({
            type: 'danger',
            msg: errObj.message || errObj || msg.unknown(lang)
          });
        });

      }

      function addError(error) {
        parseError(error);
      }

      function clearErrors() {
        errors.splice(0, errors.length);
      }

      return {

        addError: addError,
        clear: clearErrors,
        errors: errors,

        ru: {
          add: function (error) {
            parseError(error, 'ru');
          }
        }

      };
    })
  ;

}());


(function () {
  angular.module('sistemiumBootstrap.services')
    .service('sabNgTable', function (NgTableParams) {

      var lastFindAllParams = {},
        lastFindAllData = [],
        totalCount = 0
        ;

      function ngTableToV4Params(params) {

        var result = {
          'x-page-size:': params && params.count() || 12,
          'x-start-page:': params && params.page() || 1
        };

        if (params && params.sorting()) {
          var sortBy = _.reduce(params.sorting(), function (res, dir, field) {
            return res + ',' + (dir === 'desc' ? '-' : '') + field;
          }, '').substr(1);
          if (sortBy) {
            result['x-order-by:'] = sortBy;
          }
        }

        return result;

      }

      function getData (ctrl,model) {

        return function ($defer, params) {

          var v4Params = ngTableToV4Params(params);
          var needCount = !totalCount ||
              _.get(v4Params, 'searchFor:') !== _.get(lastFindAllParams, 'searchFor:')
            ;
          var countPromise;
          var setPage;

          if (needCount) {
            countPromise = model.getCount(_.pick(v4Params, ['searchFor:', 'searchFields:'])).then(function (res) {
              ctrl.ngTableParams.total(totalCount = res);
              if (res < (params.page() - 1) * params.count()) {
                v4Params['x-start-page:'] = 1;
                setPage = 1;
              }
              return v4Params;
            });
            countPromise.catch(function (res) {
              //ctrl.processServerError(res);
              $defer.reject();
            });
          }

          var dataPromiseOrNothing = function () {
            var p = v4Params;
            if (!_.matches(p)(ctrl.lastFindAllParams) || !_.matches(ctrl.lastFindAllParams)(p)) {
              return model.findAll(p, {bypassCache: ctrl.bypassCache})
                .then(function (data) {
                  if (setPage) {
                    params.page(setPage);
                  }
                  lastFindAllParams = p;
                  lastFindAllData = data;
                  $defer.resolve(lastFindAllData);
                }, function () {
                  $defer.reject();
                });
            } else {
              if (setPage) {
                params.page(setPage);
              }
              $defer.resolve(lastFindAllData);
            }
          };

          if (countPromise) {
            ctrl.busy = countPromise.then(dataPromiseOrNothing);
          } else {
            ctrl.busy = dataPromiseOrNothing(v4Params);
          }

        };

      }

      return {

        setup: function (ctrl, model) {

          var counts = !ctrl.ngTable.noPages && (ctrl.ngTable.counts || [12, 25, 50, 100]);
          var count = ctrl.ngTable.count || 12;

          if (counts.indexOf(count) < 0) {
            counts.push(count);
            counts = _.sortBy(counts);
          }

          ctrl.bypassCache = ctrl.bypassCache || angular.isUndefined(ctrl.bypassCache);

          ctrl.ngTableParams = new NgTableParams(angular.extend({
            page: 1,
            count: count,
            clearData: function () {
              lastFindAllData = [];
            }
          }, ctrl.ngTable), {
            filterDelay: 0,
            dataset: lastFindAllData,
            counts: counts,
            getData: getData (ctrl,model)
          });

          return ctrl.ngTableParams;
        },

        ngTableToV4Params: ngTableToV4Params

      };

    });

}());

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

        if (!nv) {
          vm.date = dateWithoutTime(vm.initDate);
        }
        vm.value = moment(vm.date.toISOString()).format(ymdFormat);

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

(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabErrorWidget', function () {

      return {

        restrict: 'AC',
        templateUrl: 'sistemium-angular-bootstrap/directives/sabErrorWidget/sabErrorWidget.html',
        controllerAs: 'dm',

        controller: function (sabErrorsService) {
          var dm = this;
          dm.errors =  sabErrorsService.errors;
          dm.closeError = function (index) {
            dm.errors.splice(index, 1);
          };
        }

      };

    });
}());

(function () {

  /**
   * @memberof sistemiumBootstrap.directives
   * @ngdoc directive
   * @name sabInputWithAddon
   * @description
   *  A directive for component with input and select addon
   *
   * @example
   *  Usage:
   *    <div sab-input-with-addon
   *    sab-input-model="vm.inputModel"
   *    sab-select-model="vm.selectModel"
   *    sab-select-options="vm.selectOptions"
   *    sab-label-prop="value"
   *    sab-value-prop="id"
   *    ></div>
   */

  angular.module('sistemiumBootstrap.directives')
    .directive('sabInputWithAddon', function () {
      return {

        restrict: 'AC',
        templateUrl: 'sistemium-angular-bootstrap/directives/sabInputWithAddon/sabInputWithAddon.html',
        replace: true,
        scope: {
          sabSelectModel: '=',
          sabInputModel: '=',
          sabLabelProp: '@',
          sabValueProp: '@',
          sabSelectOptions: '=',
          required: '@',
          sabBtnClass: '@'
        },

        controller: function ($scope) {

          var vm = this;
          vm.setActiveItem = function (item) {
            $scope.sabSelectModel = item;
          };

          vm.sabBtnClass = $scope.sabBtnClass || 'btn-default';

        },
        controllerAs: 'vm'

      };
    })
  ;

})();

(function(){angular.module("sistemiumBootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePicker.html","<div class=\"input-group\"><span class=\"input-group-btn\"><button ng-click=\"vm.prevDayClick()\" ng-disabled=\"vm.datepickerOptions.minDate &amp;&amp; vm.date &lt;= vm.datepickerOptions.minDate\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></span><span uib-datepicker-popup=\"uib-datepicker-popup\" ng-model=\"vm.date\" datepicker-options=\"vm.datepickerOptions\" is-open=\"datepickerPopupOpened\" datepicker-append-to-body=\"true\" no-show-button-bar=\"false\" on-open-focus=\"false\" ng-required=\"true\" current-text=\"false\" close-text=\"Закрыть\" clear-text=\"{{ vm.clearText }}\" ng-click=\"datepickerPopupOpened = !datepickerPopupOpened\" class=\"form-control text-center\">{{ vm.date | amDateFormat:\'DD/MM/YYYY, dd\' }}</span><span class=\"input-group-btn\"><button ng-click=\"vm.nextDayClick()\" ng-disabled=\"vm.datepickerOptions.maxDate &amp;&amp; vm.date &gt;= vm.datepickerOptions.maxDate\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></span></div>");
$templateCache.put("sistemium-angular-bootstrap/directives/sabErrorWidget/sabErrorWidget.html","<div ng-show=\"dm.errors.length\"><uib-alert ng-repeat=\"error in dm.errors\" type=\"{{error.type}}\" close=\"dm.closeError($index)\">{{error.msg}}</uib-alert></div>");
$templateCache.put("sistemium-angular-bootstrap/directives/sabInputWithAddon/sabInputWithAddon.html","<div class=\"form-group\"><div class=\"input-group\"><div uib-dropdown=\"uib-dropdown\" is-open=\"vm.isOpen\" class=\"input-group-btn\"><button type=\"button\" ng-class=\"vm.sabBtnClass\" uib-dropdown-toggle=\"uib-dropdown-toggle\" class=\"btn\">{{sabSelectModel[sabLabelProp]}} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><li ng-repeat=\"item in sabSelectOptions\"><a href=\"\" ng-click=\"vm.setActiveItem(item)\">{{item[sabLabelProp]}}</a></li></ul></div><input ng-model=\"sabInputModel\" type=\"number\" ng-required=\"required\" class=\"form-control\"/></div></div>");}]);})();
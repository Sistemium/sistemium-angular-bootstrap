'use strict';

(function (angular) {

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
  ]);
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

})(angular);

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

(function(){angular.module("sistemiumBootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("sistemium-angular-bootstrap/directives/sabInputWithAddon/sabInputWithAddon.html","<div class=\"form-group\"><div class=\"input-group\"><div uib-dropdown=\"uib-dropdown\" is-open=\"vm.isOpen\" class=\"input-group-btn\"><button type=\"button\" ng-class=\"vm.sabBtnClass\" uib-dropdown-toggle=\"uib-dropdown-toggle\" class=\"btn\">{{sabSelectModel[sabLabelProp]}} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><li ng-repeat=\"item in sabSelectOptions\"><a href=\"\" ng-click=\"vm.setActiveItem(item)\">{{item[sabLabelProp]}}</a></li></ul></div><input ng-model=\"sabInputModel\" type=\"number\" ng-required=\"required\" class=\"form-control\"/></div></div>");
$templateCache.put("sistemium-angular-bootstrap/directives/sabErrorWidget/sabErrorWidget.html","<div ng-show=\"dm.errors.length\"><uib-alert ng-repeat=\"error in dm.errors\" type=\"{{error.type}}\" close=\"dm.closeError($index)\">{{error.msg}}</uib-alert></div>");}]);})();
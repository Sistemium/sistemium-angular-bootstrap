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
    'ui.bootstrap'
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

'use strict';

(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabErrorWidget', function () {

      return {

        restrict: 'AC',
        template: '<div ng-show="dm.errors.length">' +
        '<uib-alert ng-repeat="error in dm.errors" type="{{error.type}}" close="dm.closeError($index)">' +
        '{{error.msg}}</uib-alert>' +
        '</div>',
        controllerAs: 'dm',

        controller: function (saErrors) {
          var dm = this;
          dm.errors =  saErrors.errors;
          dm.closeError = function (index) {
            dm.errors.splice(index, 1);
          };
        }

      };

    });
}());

(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabInputWithAddon', function () {
      return {

        restrict: 'AC',
        template: '' +
        '<div class="input-group">' +
        '<div class="input-group-btn" uib-dropdown is-open="vm.isOpen">' +
        '<button class="button btn btn-default" type="button" uib-dropdown-toggle>{{saSelectModel[saLabelProp]}} ' +
        '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu">' +
        '<li ng-repeat="item in saSelectOptions">' +
        '<a href="" ng-click="vm.setActiveItem(item)">{{item[saLabelProp]}}</a>' +
        '</li>' +
        '</ul>' +
        '<input class="form-control" ng-model="saInputModel" type="number" ng-required="required"/>',
        replace: true,
        scope: {
          saSelectModel: '=',
          saInputModel: '=',
          saLabelProp: '@',
          saValueProp: '@',
          saSelectOptions: '=',
          required: '@'
        },

        controller: function ($scope) {

          var vm = this;
          vm.setActiveItem = function (item) {
            $scope.saSelectModel = item;
          };

        },
        controllerAs: 'vm'

      };
    })
  ;

})();

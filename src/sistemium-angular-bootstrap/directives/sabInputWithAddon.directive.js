(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabInputWithAddon', function () {
      return {

        restrict: 'AC',
        template: '' +
        '<div class="input-group">' +
        '<div class="input-group-btn" uib-dropdown is-open="vm.isOpen">' +
        '<button class="button btn btn-default" type="button" uib-dropdown-toggle>{{sabSelectModel[sabLabelProp]}} ' +
        '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu">' +
        '<li ng-repeat="item in sabSelectOptions">' +
        '<a href="" ng-click="vm.setActiveItem(item)">{{item[sabLabelProp]}}</a>' +
        '</li>' +
        '</ul>' +
        '<input class="form-control" ng-model="sabInputModel" type="number" ng-required="required"/>',
        replace: true,
        scope: {
          sabSelectModel: '=',
          sabInputModel: '=',
          sabLabelProp: '@',
          sabValueProp: '@',
          sabSelectOptions: '=',
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

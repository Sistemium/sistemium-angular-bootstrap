(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabInputWithAddon', function () {
      return {

        restrict: 'AC',
        templateUrl: 'sistemium-angular-bootstrap/directives/sabInputWithAddon.html',
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
            $scope.sabSelectModel = item;
          };

        },
        controllerAs: 'vm'

      };
    })
  ;

})();

(function () {

  angular.module('sistemiumBootstrap.directives')
    .directive('sabErrorWidget', function () {

      return {

        restrict: 'AC',
        templateUrl: 'sistemium-angular-bootstrap/directives/sabErrorWidget/sabErrorWidget.html',
        controllerAs: 'dm',

        controller: function (sabErrors) {
          var dm = this;
          dm.errors =  sabErrors.errors;
          dm.closeError = function (index) {
            dm.errors.splice(index, 1);
          };
        }

      };

    });
}());

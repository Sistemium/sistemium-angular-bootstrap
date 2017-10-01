(function (module) {

  module.component('buttonAdd', {

    bindings: {
      buttonClick: '&'
    },

    templateUrl: 'sistemium-angular-bootstrap/components/buttonAdd/buttonAdd.html',
    controllerAs: 'vm'

  });

})(angular.module('sistemium.directives'));

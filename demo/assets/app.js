(function () {

  angular.module('sistemiumBootstrap.demo', ['sistemiumBootstrap'])
    .controller('MainCtrl', MainCtrl);

  function MainCtrl(sabErrors) {

    var vm = this;

    angular.extend(vm, {

      addError: function () {
        sabErrors.addError('Some very ugly error');
      },
      inputModel: '',
      selectModel: '',
      selectOptions: [{
        id: 1,
        value: 'Vasya'
      }, {
        id: 2,
        value: 'Petya'
      }]

    });

  }

}());

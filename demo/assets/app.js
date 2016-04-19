(function () {

  angular.module('sistemiumBootstrap.demo', ['sistemiumBootstrap', 'sistemium'])
    .config(function (DSHttpAdapterProvider) {
      angular.extend(DSHttpAdapterProvider.defaults, {
        basePath: 'http://localhost:9000/api/vr/'
      });
    })
    .service('Schema', Schema)
    .service('models', function (Schema) {
      return Schema.models();
    })
    .controller('MainCtrl', MainCtrl);

  function Schema(saSchema) {
    //pass object to saSchema to override methods
    return saSchema();
  }

  function MainCtrl(sabErrorsService, Schema, models) {

    Schema.register({
      name: 'Article'
    });

    var Article = models.Article;

    Article.findAll();

    Article.on('DS.afterInject', function (a, b) {
      console.log(a,b);
    });

    var vm = this;

    angular.extend(vm, {

      addError: function () {
        sabErrorsService.addError('Some very ugly error');
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

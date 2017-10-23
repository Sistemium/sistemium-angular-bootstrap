(function () {

  function transformToComponentDirective($compile) {

    return {

      scope: {
        componentName: '@'
      },

      restrict: 'E',
      controller: transformToComponentController,
      controllerAs: 'vm',
      //bindToController: true,

      link: function (scope, element, attrs) {

        let {componentName} = attrs;

        let ignoreAttrs = ['instance', 'componentName'];

        //let itemName = _.last(componentName.match(/edit-(.*)/));

        let params = [];

        _.each(attrs, (val, key) => {

          if (!/\$+/.test(key) && _.indexOf(ignoreAttrs, key) < 0) {
            params.push (`${_.kebabCase(key)}="${val}"`);
          }

        });

        let template = angular.element(
          `<${componentName} ${params.join(' ')}></${componentName}>`
        );

        element.append(template);
        $compile(template)(scope.$parent);

      }

    };
  }

  angular.module('sistemium.directives')
    .directive('transformToComponent', transformToComponentDirective);

  function transformToComponentController() {

    let vm = this;

    _.assign(vm, {});

  }

})();

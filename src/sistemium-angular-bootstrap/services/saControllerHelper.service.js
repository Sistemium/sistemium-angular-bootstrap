(function () {

  function saControllerHelper($q, $state) {

    return {
      setup
    };

    function use(helper, scope) {

      let me = this;

      if (!helper) {
        return me;
      }

      if (_.isFunction(helper.setupController)) {
        helper.setupController(me, scope);
        return me;
      }

      return _.assign(me, helper);

    }

    function managedOn(scope, event, callback) {
      let un = scope.$on(event, callback);
      scope.$on('$destroy', un);
      return this;
    }

    function watchStateChange(vm, $scope) {

      managedOn($scope, '$stateChangeSuccess', stateChangeSuccessHandler);

      stateChangeSuccessHandler(null, $state.current, $state.params);

      function stateChangeSuccessHandler(event, toState, toParams, fromState, fromParams) {

        _.assign(vm, {
          currentState: _.first(toState.name.match(/[^.]+$/))
        });

        if (_.isFunction(vm.onStateChange)) {
          vm.onStateChange(toState, toParams, fromState, fromParams);
        }

      }

    }

    function setup(vm, scope) {

      let bindAllStore = {};
      // let busyArray = [];
      let watches = {};

      scope.$on('$destroy', () => _.each(bindAllStore, unbind => unbind()));
      watchStateChange(vm, scope);

      return _.assign(vm, {

        use: (helper) => use.call(vm, helper, scope),

        onScope: (event, callback) => {
          managedOn.call(vm, scope, event, callback);
          return vm;
        },

        watchScope: (expr, callback, byProperties) => {

          let unwatch = watches[expr];

          if (_.isFunction(unwatch)) {
            unwatch();
          }

          watches[expr] = scope.$watch(expr, callback, byProperties);

          return vm;

        },

        rebindAll: (model, filter, expr, callback) => {
          let unbind = bindAllStore[expr];
          if (unbind) {
            unbind();
          }
          scope.$on('$destroy', bindAllStore[expr] = model.bindAll(filter, scope, expr, callback));
          return vm;
        },

        rebindOne: (model, id, expr, callback) => {
          let unbind = bindAllStore[expr];
          if (unbind) {
            unbind();
          }
          if (id) {
            scope.$on('$destroy', bindAllStore[expr] = model.bindOne(id, scope, expr, callback));
          } else {
            _.set(scope, expr, null);
          }
          return vm;
        },

        setBusy: (promise, message) => {

          if (_.isArray(promise)) {
            promise = $q.all(promise);
          }

          vm.busy = promise;

          vm.busy.finally(() => vm.busy = false);

          vm.cgBusy = {promise};

          if (message) {
            vm.cgBusy.message = message;
          }

          return promise;

        }

      });

    }

  }

  angular.module('sistemium.services')
    .service('saControllerHelper', saControllerHelper);

})();

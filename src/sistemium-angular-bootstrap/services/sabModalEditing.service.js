(function () {

  angular.module('sistemium.services')
    .service('sabModalEditing', sabModalEditing);

  function sabModalEditing($uibModal, $timeout) {

    const me = this;
    // TODO: resolve Schema dependency with a new configurable service
    let Schema = {};

    return {editModal, setupController, closeModal};

    function setupController(vm, itemProperty) {

      itemProperty = itemProperty || 'item';

      _.assign(vm, {
        saveClick,
        cancelClick,
        destroyClick,
        afterSave: vm.afterSave || _.identity,
        afterCancel: vm.afterCancel || _.identity
      });

      /*
       Functions
       */

      function saveClick() {
        if (vm.saveFn) {
          return vm.saveFn()
            .then(vm.afterSave);
        } else if (_.isFunction(vm[itemProperty].DSCreate)) {
          return vm[itemProperty].DSCreate()
            .then(vm.afterSave);
        }
      }

      function cancelClick(ev) {
        vm.afterCancel(ev);
      }

      function destroyClick() {

        vm.confirmDestroy = !vm.confirmDestroy;

        if (vm.confirmDestroy) {
          return $timeout(2000).then(() => vm.confirmDestroy = false);
        }

        if (_.isFunction(vm[itemProperty].DSDestroy)) {
          vm[itemProperty].DSDestroy()
            .then(vm.afterSave);
        } else {
          vm.afterSave();
        }

      }

    }

    function editModal(componentName, title) {
      return item => {

        if (!title) {

          let modelName = _.get(item, 'constructor.name');

          let model = modelName && Schema.model(modelName);

          if (!item.id) {
            title = _.get(model, 'meta.label.add');
          }

        }

        return openEditModal(item, componentName, title);

      };
    }

    function closeModal() {
      me.modal.close();
    }

    function openEditModal(item, componentName, title) {

      let itemName = _.last(componentName.match(/edit-(.*)/));

      me.modal = $uibModal.open({

        animation: true,
        template: `<div class="editing modal-header">` +
        `  <h1>{{vm.title}}</h1>` +
        `  <a href class="close-btn" ng-click="vm.cancelClick()"><i class="glyphicon glyphicon-remove"></i></a>` +
        `</div>` +
        `<div class="modal-body">` +
        `  <${componentName} ${itemName}="vm.item" save-fn="vm.saveFn"></${componentName}>` +
        `</div>` +
        `<div class="modal-footer">` +
        (item.id ? `  <button class="btn destroy" ng-class="vm.confirmDestroy ? 'btn-danger' : 'btn-default'" ` +
          `ng-click="vm.destroyClick()">Ištrinti</button>` : '') +
        `  <button class="btn btn-success save animate-show" ng-show="!vm.item.id || vm.item.DSHasChanges()" ` +
          `ng-disabled="!vm.item.isValid()" ng-click="vm.saveClick()">Išsaugoti</button>` +
        `  <button class="btn btn-default cancel" ng-click="vm.cancelClick()">Atšaukti</button>` +
        `</div>`,
        size: 'lg',

        controller,

        backdrop: 'static'

      });

      me.modal.result
        .catch(() => {
          if (item.id) {
            item.DSRevert();
          }
        });

      return me.modal.result;

      function controller($scope) {

        const vm = {};

        $scope.vm = vm;

        setupController(vm);

        _.assign(vm, {
          item,
          title,
          afterSave: me.modal.close,
          afterCancel: me.modal.dismiss
        });

      }

    }

  }

})();

'use strict';

(function () {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('sistemiumBootstrap.config', []).value('sistemiumBootstrap.config', {
    debug: true
  });

  // Modules
  angular.module('sistemiumBootstrap.dependencies', ['ui.bootstrap', 'ngTable']).config(['$uibTooltipProvider', function ($uibTooltipProvider) {
    $uibTooltipProvider.options({ trigger: 'outsideClick' });
  }]);

  angular.module('sistemiumBootstrap.directives', []);
  angular.module('sistemiumBootstrap.filters', []);
  angular.module('sistemiumBootstrap.services', []);
  angular.module('sistemiumBootstrap', ['sistemiumBootstrap.dependencies', 'sistemiumBootstrap.config', 'sistemiumBootstrap.directives', 'sistemiumBootstrap.filters', 'sistemiumBootstrap.services']);
})();

(function () {

  /**
   * @memberof sistemiumBootstrap.directives
   * @ngdoc directive
   * @name sabInputWithAddon
   * @description
   *  A directive for component with input and select addon
   *
   * @example
   *  Usage:
   *    <div sab-input-with-addon
   *    sab-input-model="vm.inputModel"
   *    sab-select-model="vm.selectModel"
   *    sab-select-options="vm.selectOptions"
   *    sab-label-prop="value"
   *    sab-value-prop="id"
   *    ></div>
   */

  angular.module('sistemiumBootstrap.directives').directive('sabInputWithAddon', function () {
    return {

      restrict: 'AC',
      templateUrl: 'sistemium-angular-bootstrap/directives/sabInputWithAddon/sabInputWithAddon.html',
      replace: true,
      scope: {
        sabSelectModel: '=',
        sabInputModel: '=',
        sabLabelProp: '@',
        sabValueProp: '@',
        sabSelectOptions: '=',
        required: '@',
        sabBtnClass: '@'
      },

      controller: ["$scope", function controller($scope) {

        var vm = this;
        vm.setActiveItem = function (item) {
          $scope.sabSelectModel = item;
        };

        vm.sabBtnClass = $scope.sabBtnClass || 'btn-default';
      }],
      controllerAs: 'vm'

    };
  });
})();

(function () {

  sabDatePickerController.$inject = ["$scope"];
  var bindings = {
    value: '=',
    minDate: '<',
    maxDate: '<',
    initDate: '<',
    customClass: '<',
    clearText: '@',
    closeText: '@',
    options: '<',
    ngRequired: '<',
    placeholder: '@'
  };

  angular.module('sistemiumBootstrap.directives').component('sabDatePicker', {

    bindings: bindings,

    templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePicker.html',
    controller: sabDatePickerController,
    controllerAs: 'vm'

  }).component('sabDatePickerInput', {

    bindings: bindings,

    templateUrl: 'sistemium-angular-bootstrap/directives/sabDatePicker/sabDatePickerInput.html',
    controller: sabDatePickerController,
    controllerAs: 'vm'

  });

  var ymdFormat = 'YYYY-MM-DD';

  function sabDatePickerController($scope) {

    var vm = _.assign(this, {

      nextDayClick: nextDayClick,
      prevDayClick: prevDayClick,

      $onInit: onInit,

      onInputBlur: onInputBlur,

      dateFormat: moment.localeData().longDateFormat('L') + ', dd'

    });

    function onInit() {

      vm.date = vm.value ? dateWithoutTime(vm.value) : null;

      vm.dateInputValid = true;

      vm.options = _.defaults({
        minDate: vm.minDate && dateWithoutTime(vm.minDate),
        maxDate: vm.maxDate && dateWithoutTime(vm.maxDate),
        initDate: vm.initDate,
        customClass: vm.customClass,
        showWeeks: false
      }, vm.options || {});

      vm.datepickerOptions = _.defaults(vm.options, $scope.datepickerOptions);

      vm.altInputFormats = ['yyyy/MM/dd', 'yyyy.MM.dd'];

      vm.placeholder = vm.placeholder || 'Data';

      $scope.$watch('vm.value', function () {

        vm.date = vm.value ? dateWithoutTime(vm.value) : null;
        vm.dateInput = vm.date;
      });

      $scope.$watch('vm.dateInput', function (dateInput, ov) {

        if (dateInput === ov) {
          return;
        }

        vm.dateInputValid = isValid(dateInput);

        if (vm.dateInputValid) {
          vm.date = dateWithoutTime(dateInput);
        } else {
          vm.date = null;
        }
      });

      $scope.$watch('vm.date', function (nv) {

        if (!isValid(nv)) {
          vm.date = vm.initDate ? dateWithoutTime(vm.initDate) : null;
        }

        vm.value = vm.date ? moment(vm.date.toISOString()).format(ymdFormat) : null;
      });

      $scope.$watch('vm.minDate', function () {

        vm.datepickerOptions = _.defaults({
          minDate: vm.minDate && dateWithoutTime(vm.minDate)
        }, vm.datepickerOptions);
      });
    }

    function onInputBlur(event) {

      var classes = _.get(event, 'relatedTarget.className') + ' ' + _.get(event, 'relatedTarget.parentNode.className');

      // to prevent closing if clicked somewhere inside a calendar popover
      if (!/uib-/.test(classes)) {
        $scope.$evalAsync(function () {
          return $scope.datepickerPopupOpened = false;
        });
      }
    }

    function isValid(date) {
      return date && _.isDate(date) && !_.isNaN(date.getTime());
    }

    function dateWithoutTime(date) {
      return moment(moment(date).format(ymdFormat)).toDate();
    }

    function nextDayClick() {
      var date = vm.date && moment(vm.date.toISOString()).add(1, 'day') || moment();
      setValidDate(date);
    }

    function prevDayClick() {
      var date = vm.date && moment(vm.date.toISOString()).add(-1, 'day') || moment();
      setValidDate(date);
    }

    function setValidDate(date) {

      if (vm.datepickerOptions.maxDate) {
        date = _.min([moment(vm.datepickerOptions.maxDate), date]);
      }

      if (vm.datepickerOptions.minDate) {
        date = _.max([moment(vm.datepickerOptions.minDate), date]);
      }

      vm.date = date.toDate();
    }
  }
})();

(function () {

  angular.module('sistemiumBootstrap.directives').directive('sabErrorWidget', function () {

    return {

      restrict: 'AC',
      templateUrl: 'sistemium-angular-bootstrap/directives/sabErrorWidget/sabErrorWidget.html',
      controllerAs: 'dm',

      controller: ["sabErrorsService", function controller(sabErrorsService) {
        var dm = this;
        dm.errors = sabErrorsService.errors;
        dm.closeError = function (index) {
          dm.errors.splice(index, 1);
        };
      }]

    };
  });
})();

(function (module) {

  dropdownController.$inject = ["$scope", "saControllerHelper", "Schema", "sabModalEditing", "$timeout", "$filter", "saEtc", "UUID"];
  module.component('sabDropdown', {

    bindings: {
      currentId: '=?ngModel',
      itemsDataSourceName: '@',
      itemsNameProperty: '@',
      itemsGroupProperty: '@',
      itemsData: '=',
      filter: '=',
      options: '=',
      placement: '@',
      allowClear: '=',
      orderDir: '@'
    },

    templateUrl: 'sistemium-angular-bootstrap/components/sabDropdown/sabDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, sabModalEditing, $timeout, $filter, saEtc, UUID) {

    var vm = saControllerHelper.setup(this, $scope);

    vm.use({

      id: 'sab-dropdown-' + UUID.v4(),

      $onInit: $onInit,
      itemClick: itemClick,
      addClick: addClick,
      afterCancel: afterCancel,
      afterSave: afterSave,
      clearClick: clearClick,
      groupLabel: groupLabel,
      onKeyDown: onKeyDown,
      emptyText: 'Нажмите, чтобы выбрать'

    });

    sabModalEditing.setupController(vm, 'newItem');

    vm.watchScope('vm.currentId', onCurrentId);
    vm.watchScope('vm.search', onSearch);
    vm.watchScope('vm.isOpen', onOpen);
    vm.watchScope('vm.filter', onFilter, true);

    /*
     Functions
     */

    function clearClick() {
      vm.currentId = null;
    }

    function onKeyDown($event) {

      var direction = void 0;

      switch ($event.keyCode) {

        case 13:
          return vm.focused && itemClick(vm.focused);
        case 27:
          {
            $event.preventDefault();
            return vm.isOpen = false;
          }
        case 38:
          {
            direction = -1;
            break;
          }
        case 40:
          {
            direction = 1;
            break;
          }

        default:
          return;

      }

      setFocused(direction);
    }

    function setFocused(direction) {
      var focused = vm.focused;


      focused = focused || vm.currentItem;

      if (focused && !saEtc.getElementById(focused.id)) {
        focused = false;
      }

      if (!focused) {

        focused = getFirstVisibleElement();
      } else {

        var idx = _.findIndex(vm.filteredData, focused);

        if (idx >= vm.filteredData.length - 1 || idx < 0) {
          return;
        }

        focused = vm.filteredData[idx + direction];
      }

      if (!focused) {
        return;
      }

      scrollToExistingElement(focused);

      vm.focused = focused;
    }

    function getFirstVisibleElement() {

      var scroller = saEtc.getElementById(vm.id);

      return _.find(vm.filteredData, { id: scroller.children[1].getAttribute('id') });
    }

    function scrollToExistingElement(focused) {
      var elem = saEtc.getElementById(focused.id);
      var scroller = elem.parentElement;

      var innerPosition = elem.offsetTop - scroller.scrollTop;
      var minPosition = elem.clientHeight * 3;
      var maxPosition = scroller.clientHeight - elem.clientHeight * 2;

      if (innerPosition < minPosition) {
        scroller.scrollTop = _.max([0, elem.offsetTop - minPosition]);
      } else if (innerPosition > maxPosition) {
        scroller.scrollTop = elem.offsetTop + minPosition - scroller.clientHeight;
      }
    }

    function onCurrentId(id) {

      if (!id || !vm.model) {
        vm.currentItem = null;
        return;
      }

      vm.currentItem = vm.model.get(id);

      if (vm.saveToProperty) {
        vm.saveTo[vm.saveToProperty] = id;
      }
    }

    function onFilter() {

      if (!vm.itemsData) {
        vm.rebindAll(vm.model, vm.filter || {}, 'vm.data', onSearch);
      }

      if (!_.get(vm.options, 'doNotFind')) {
        vm.model.findAll(vm.filter || {}, vm.options || {}).then(setCurrent).then(setDefault);
      } else {
        setCurrent();
        setDefault();
      }

      function setCurrent() {
        var item = vm.currentId && vm.model.get(vm.currentId);
        vm.currentItem = item && _.matches(vm.filter)(item) ? item : null;
        if (!vm.currentItem) {
          vm.currentId = null;
        }
      }
    }

    function setDefault() {

      if (vm.currentId || _.get(vm.model, 'meta.noDefault')) {
        return;
      }

      var items = vm.model.filter(vm.filter);

      if (items.length === 1) {
        vm.currentId = _.first(items).id;
      }
    }

    var itemHeight = 34;

    function scrollToCurrent() {

      if (!vm.currentId) {
        return;
      }

      var elem = saEtc.getElementById(vm.currentId);

      if (!elem) {

        var scroller = saEtc.getElementById(vm.id);

        if (!scroller) {
          return $timeout(200).then(scrollToCurrent);
        }

        var idx = _.findIndex(vm.filteredData, vm.currentItem);

        scroller.scrollTop = (idx + 1) * itemHeight;

        return $timeout(200).then(scrollToCurrent);
      }

      scrollToExistingElement(elem);
    }

    function onOpen(nv, ov) {

      if (ov) {
        $timeout(200).then(function () {
          vm.search = '';
          delete vm.focused;
        });
      }

      if (nv) {
        scrollToCurrent();
      }
    }

    function groupLabel(item) {
      return _.get(item, vm.itemsGroupProperty);
    }

    function addClick() {

      vm.newItem = vm.model.createInstance(_.assign({ name: vm.search }, vm.filter || {}));
      vm.isOpen = false;
    }

    function $onInit() {

      var model = Schema.model(vm.itemsDataSourceName);

      vm.use({
        model: model,
        itemsNameProperty: vm.itemsNameProperty || 'name',
        editComponentName: 'edit-' + _.kebabCase(vm.itemsDataSourceName),
        currentId: vm.currentId || vm.saveTo && vm.saveToProperty && vm.saveTo[vm.saveToProperty],
        newItemTitle: _.get(model, 'meta.label.add') || 'Naujas įrašas'
      });

      var accusative = _.get(model, 'meta.label.accusative');

      vm.emptyText += ' ' + (accusative || 'из списка');

      if (vm.itemsData) {

        $scope.$watchCollection('vm.itemsData', function () {
          vm.data = vm.itemsData;
          onSearch();
        });
      }

      onFilter();
    }

    function onSearch() {
      var search = vm.search,
          _vm$orderDir = vm.orderDir,
          orderDir = _vm$orderDir === undefined ? 'asc' : _vm$orderDir;


      vm.filteredData = !search ? vm.data : $filter('filter')(vm.data, search);

      vm.filteredData = _.orderBy(vm.filteredData, [vm.itemsGroupProperty, vm.itemsNameProperty], [orderDir, orderDir]);
    }

    function itemClick(item) {

      vm.use({
        currentId: item.id,
        currentItem: item,
        isOpen: false
      });
    }

    function afterCancel($event) {
      $event.stopPropagation();
      delete vm.newItem;
    }

    function afterSave(saved) {

      //vm.currentItem = saved;
      vm.currentId = saved.id;
      vm.isOpen = false;
      delete vm.newItem;
    }
  }
})(angular.module('sistemium.directives'));

(function (module) {

  module.component('buttonAdd', {

    bindings: {
      buttonClick: '&'
    },

    templateUrl: 'sistemium-angular-bootstrap/components/buttonAdd/buttonAdd.html',
    controllerAs: 'vm'

  });
})(angular.module('sistemium.directives'));

(function () {
  angular.module('sistemiumBootstrap.services').service('sabNgTable', ["NgTableParams", function (NgTableParams) {

    var lastFindAllParams = {},
        lastFindAllData = [],
        totalCount = 0;

    function ngTableToV4Params(params) {

      var result = {
        'x-page-size:': params && params.count() || 12,
        'x-start-page:': params && params.page() || 1
      };

      if (params && params.sorting()) {
        var sortBy = _.reduce(params.sorting(), function (res, dir, field) {
          return res + ',' + (dir === 'desc' ? '-' : '') + field;
        }, '').substr(1);
        if (sortBy) {
          result['x-order-by:'] = sortBy;
        }
      }

      return result;
    }

    function getData(ctrl, model) {

      return function ($defer, params) {

        var v4Params = ngTableToV4Params(params);
        var needCount = !totalCount || _.get(v4Params, 'searchFor:') !== _.get(lastFindAllParams, 'searchFor:');
        var countPromise;
        var setPage;

        if (needCount) {
          countPromise = model.getCount(_.pick(v4Params, ['searchFor:', 'searchFields:'])).then(function (res) {
            ctrl.ngTableParams.total(totalCount = res);
            if (res < (params.page() - 1) * params.count()) {
              v4Params['x-start-page:'] = 1;
              setPage = 1;
            }
            return v4Params;
          });
          countPromise.catch($defer.reject);
        }

        var dataPromiseOrNothing = function dataPromiseOrNothing() {
          var p = v4Params;
          if (!_.matches(p)(ctrl.lastFindAllParams) || !_.matches(ctrl.lastFindAllParams)(p)) {
            return model.findAll(p, { bypassCache: ctrl.bypassCache }).then(function (data) {
              if (setPage) {
                params.page(setPage);
              }
              lastFindAllParams = p;
              lastFindAllData = data;
              $defer.resolve(lastFindAllData);
            }, function () {
              $defer.reject();
            });
          } else {
            if (setPage) {
              params.page(setPage);
            }
            $defer.resolve(lastFindAllData);
          }
        };

        if (countPromise) {
          ctrl.busy = countPromise.then(dataPromiseOrNothing);
        } else {
          ctrl.busy = dataPromiseOrNothing(v4Params);
        }
      };
    }

    return {

      setup: function setup(ctrl, model) {

        var counts = !ctrl.ngTable.noPages && (ctrl.ngTable.counts || [12, 25, 50, 100]);
        var count = ctrl.ngTable.count || 12;

        if (counts.indexOf(count) < 0) {
          counts.push(count);
          counts = _.sortBy(counts);
        }

        ctrl.bypassCache = ctrl.bypassCache || angular.isUndefined(ctrl.bypassCache);

        ctrl.ngTableParams = new NgTableParams(angular.extend({
          page: 1,
          count: count,
          clearData: function clearData() {
            lastFindAllData = [];
          }
        }, ctrl.ngTable), {
          filterDelay: 0,
          dataset: lastFindAllData,
          counts: counts,
          getData: getData(ctrl, model)
        });

        return ctrl.ngTableParams;
      },

      ngTableToV4Params: ngTableToV4Params

    };
  }]);
})();

(function () {

  sabModalEditing.$inject = ["$uibModal", "$timeout"];
  angular.module('sistemium.services').service('sabModalEditing', sabModalEditing);

  function sabModalEditing($uibModal, $timeout) {

    var me = this;
    // TODO: resolve Schema dependency with a new configurable service
    var Schema = {};

    return { editModal: editModal, setupController: setupController, closeModal: closeModal };

    function setupController(vm, itemProperty) {

      itemProperty = itemProperty || 'item';

      _.assign(vm, {
        saveClick: saveClick,
        cancelClick: cancelClick,
        destroyClick: destroyClick,
        afterSave: vm.afterSave || _.identity,
        afterCancel: vm.afterCancel || _.identity
      });

      /*
       Functions
       */

      function saveClick() {
        if (vm.saveFn) {
          return vm.saveFn().then(vm.afterSave);
        } else if (_.isFunction(vm[itemProperty].DSCreate)) {
          return vm[itemProperty].DSCreate().then(vm.afterSave);
        }
      }

      function cancelClick(ev) {
        vm.afterCancel(ev);
      }

      function destroyClick() {

        vm.confirmDestroy = !vm.confirmDestroy;

        if (vm.confirmDestroy) {
          return $timeout(2000).then(function () {
            return vm.confirmDestroy = false;
          });
        }

        if (_.isFunction(vm[itemProperty].DSDestroy)) {
          vm[itemProperty].DSDestroy().then(vm.afterSave);
        } else {
          vm.afterSave();
        }
      }
    }

    function editModal(componentName, title) {
      return function (item) {

        if (!title) {

          var modelName = _.get(item, 'constructor.name');

          var model = modelName && Schema.model(modelName);

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

      controller.$inject = ["$scope"];
      var itemName = _.last(componentName.match(/edit-(.*)/));

      me.modal = $uibModal.open({

        animation: true,
        template: '<div class="editing modal-header">' + '  <h1>{{vm.title}}</h1>' + '  <a href class="close-btn" ng-click="vm.cancelClick()"><i class="glyphicon glyphicon-remove"></i></a>' + '</div>' + '<div class="modal-body">' + ('  <' + componentName + ' ' + itemName + '="vm.item" save-fn="vm.saveFn"></' + componentName + '>') + '</div>' + '<div class="modal-footer">' + (item.id ? '  <button class="btn destroy" ng-class="vm.confirmDestroy ? \'btn-danger\' : \'btn-default\'" ' + 'ng-click="vm.destroyClick()">I\u0161trinti</button>' : '') + '  <button class="btn btn-success save animate-show" ng-show="!vm.item.id || vm.item.DSHasChanges()" ' + 'ng-disabled="!vm.item.isValid()" ng-click="vm.saveClick()">I\u0161saugoti</button>' + '  <button class="btn btn-default cancel" ng-click="vm.cancelClick()">At\u0161aukti</button>' + '</div>',
        size: 'lg',

        controller: controller,

        backdrop: 'static'

      });

      me.modal.result.catch(function () {
        if (item.id) {
          item.DSRevert();
        }
      });

      return me.modal.result;

      function controller($scope) {

        var vm = {};

        $scope.vm = vm;

        setupController(vm);

        _.assign(vm, {
          item: item,
          title: title,
          afterSave: me.modal.close,
          afterCancel: me.modal.dismiss
        });
      }
    }
  }
})();

(function () {

  angular.module('sistemiumBootstrap.services').service('sabErrorsService', function () {

    var errors = [];

    var msg = {
      unknown: function unknown(lang) {
        switch (lang || 'en') {

          case 'en':
            return 'Unknown error';
          case 'ru':
            return 'Неизвестная ошибка';

        }
      }
    };

    function parseError(e, lang) {

      var data = e && e.data && e.data.length > 0 && e.data || [e];

      data.forEach(function (errObj) {
        errors.push({
          type: 'danger',
          msg: errObj.message || errObj || msg.unknown(lang)
        });
      });
    }

    function addError(error) {
      parseError(error);
    }

    function clearErrors() {
      errors.splice(0, errors.length);
    }

    return {

      addError: addError,
      clear: clearErrors,
      errors: errors,

      ru: {
        add: function add(error) {
          parseError(error, 'ru');
        }
      }

    };
  });
})();

(function () {

  saEtc.$inject = ["$window", "$timeout", "$rootScope"];
  function saEtc($window, $timeout, $rootScope) {

    function debounce(fn, timeout) {
      var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : $rootScope;

      return _.debounce(function () {
        scope.$applyAsync(fn);
      }, timeout);
    }

    function blurActive() {
      return _.result($window.document, 'activeElement.blur');
    }

    function focusElementById(id) {
      $timeout(function () {

        var element = $window.document.getElementById(id);
        if (element) {
          element.focus();
        }
      });
    }

    function getElementById(id) {
      return $window.document.getElementById(id);
    }

    function scrolTopElementById(id) {
      var element = getElementById(id);
      if (!element) {
        return;
      }
      element.scrollTop = 0;
    }

    function scrollBottomElementById(id) {
      var element = getElementById(id);
      if (!element) {
        return;
      }
      element.scrollTop = element.scrollHeight;
    }

    return {
      debounce: debounce,
      scrolTopElementById: scrolTopElementById,
      getElementById: getElementById,
      blurActive: blurActive,
      focusElementById: focusElementById,
      scrollBottomElementById: scrollBottomElementById
    };
  }

  angular.module('sistemium.services').service('saEtc', saEtc);
})();

(function () {

  saControllerHelper.$inject = ["$q"];
  function saControllerHelper($q) {

    return {
      setup: setup
    };

    function _use(helper, scope) {

      var me = this;

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
      var un = scope.$on(event, callback);
      scope.$on('$destroy', un);
      return this;
    }

    function watchStateChange(vm, $scope) {

      managedOn($scope, '$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        _.assign(vm, {
          currentState: _.first(toState.name.match(/[^.]+$/))
        });

        if (_.isFunction(vm.onStateChange)) {
          vm.onStateChange(toState, toParams, fromState, fromParams);
        }
      });
    }

    function setup(vm, scope) {

      var bindAllStore = {};
      // let busyArray = [];
      var watches = {};

      scope.$on('$destroy', function () {
        return _.each(bindAllStore, function (unbind) {
          return unbind();
        });
      });
      watchStateChange(vm, scope);

      return _.assign(vm, {

        use: function use(helper) {
          return _use.call(vm, helper, scope);
        },

        onScope: function onScope(event, callback) {
          managedOn.call(vm, scope, event, callback);
          return vm;
        },

        watchScope: function watchScope(expr, callback, byProperties) {

          var unwatch = watches[expr];

          if (_.isFunction(unwatch)) {
            unwatch();
          }

          watches[expr] = scope.$watch(expr, callback, byProperties);

          return vm;
        },

        rebindAll: function rebindAll(model, filter, expr, callback) {
          var unbind = bindAllStore[expr];
          if (unbind) {
            unbind();
          }
          scope.$on('$destroy', bindAllStore[expr] = model.bindAll(filter, scope, expr, callback));
          return vm;
        },

        rebindOne: function rebindOne(model, id, expr, callback) {
          var unbind = bindAllStore[expr];
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

        setBusy: function setBusy(promise, message) {

          if (_.isArray(promise)) {
            promise = $q.all(promise);
          }

          vm.busy = promise;

          vm.busy.finally(function () {
            return vm.busy = false;
          });

          vm.cgBusy = { promise: promise };

          if (message) {
            vm.cgBusy.message = message;
          }

          return promise;
        }

      });
    }
  }

  angular.module('sistemium.services').service('saControllerHelper', saControllerHelper);
})();

(function () {

  transformToComponentDirective.$inject = ["$compile"];
  function transformToComponentDirective($compile) {

    return {

      scope: {
        componentName: '@'
      },

      restrict: 'E',
      controller: transformToComponentController,
      controllerAs: 'vm',
      //bindToController: true,

      link: function link(scope, element, attrs) {
        var componentName = attrs.componentName;


        var ignoreAttrs = ['instance', 'componentName'];

        //let itemName = _.last(componentName.match(/edit-(.*)/));

        var params = [];

        _.each(attrs, function (val, key) {

          if (!/\$+/.test(key) && _.indexOf(ignoreAttrs, key) < 0) {
            params.push(_.kebabCase(key) + '="' + val + '"');
          }
        });

        var template = angular.element('<' + componentName + ' ' + params.join(' ') + '></' + componentName + '>');

        element.append(template);
        $compile(template)(scope.$parent);
      }

    };
  }

  angular.module('sistemium.directives').directive('transformToComponent', transformToComponentDirective);

  function transformToComponentController() {

    var vm = this;

    _.assign(vm, {});
  }
})();

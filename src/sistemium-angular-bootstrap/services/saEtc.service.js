'use strict';

(function () {

  function saEtc($window, $timeout, $rootScope) {

    function debounce(fn, timeout, scope = $rootScope) {
      return _.debounce(() => {scope.$applyAsync(fn)}, timeout);
    }

    function blurActive() {
      return _.result($window.document, 'activeElement.blur');
    }

    function focusElementById(id) {
      $timeout(function() {

        let element = $window.document.getElementById(id);
        if (element) {
          element.focus();
        }

      });
    }

    function getElementById(id) {
      return $window.document.getElementById(id);
    }

    function scrolTopElementById(id) {
      let element = getElementById(id);
      if (!element) {
        return;
      }
      element.scrollTop = 0;
    }

    function scrollBottomElementById(id) {
      let element = getElementById(id);
      if (!element) {
        return;
      }
      element.scrollTop = element.scrollHeight;
    }


    return {
      debounce,
      scrolTopElementById,
      getElementById,
      blurActive,
      focusElementById,
      scrollBottomElementById
    };

  }

  angular.module('sistemium.services')
    .service('saEtc', saEtc);

})();

'use strict';

describe('', function () {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function (module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function () {

    // Get module
    module = angular.module('sistemiumBootstrap');
    dependencies = module.requires;
  });

  it('should load config module', function () {
    expect(hasModule('sistemiumBootstrap.config')).to.be.ok;
  });

  it('should load filters module', function () {
    expect(hasModule('sistemiumBootstrap.filters')).to.be.ok;
  });

  it('should load directives module', function () {
    expect(hasModule('sistemiumBootstrap.directives')).to.be.ok;
  });

  it('should load services module', function () {
    expect(hasModule('sistemiumBootstrap.services')).to.be.ok;
  });

});

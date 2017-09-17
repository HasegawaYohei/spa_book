class Chat {
  constructor(util) {
    this.util = util;
    this.configMap = {
      mainHtml: ''
        + '<div style="padding:1em; color: #fff;">'
          + 'Say hello to chat'
        + '</div>',
      settableMap: {}
    };
    this.stateMap = {
      $container: null
    };
    this.jqueryMap = {
    };
  }

  setJqueryMap() {
    const $container = this.stateMap.$container;
    this.jqueryMap = { $container: $container };
  }

  configModule(spa, inputMap) {
    this.util.setConfigMap({
      inputMap: inputMap,
      settableMap: this.configMap.settableMap,
      configMap: this.configMap
    });
    return true;
  }

  initModule($container) {
    $container.html(this.configMap.mainHtml);
    this.stateMap.$container = $container;
    this.setJqueryMap();
    return true;
  }
}
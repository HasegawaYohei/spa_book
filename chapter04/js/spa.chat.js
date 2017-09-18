class Chat {
  constructor(util) {
    this.util = util;
    this.configMap = {
      mainHtml: ''
        + '<div class="spa-chat">'
          + '<div class="spa-chat-head">'
            + '<div class="spa-chat-head-toggle">+</div>'
            + '<div class="spa-chat-head-title">'
              + 'Chat'
            + '</div>'
          + '</div>'
          + '<div class="spa-chat-closer">x</div>'
          + '<div class="spa-chat-sizer">'
            + '<div class="spa-chat-msgs"></div>'
            + '<div class="spa-chat-box">'
              + '<input type="text" />'
              + '<div>send</div>'
            + '</div>'
          + '</div>'
      + '</div>',

      settableMap: {
        sliderOpenTime: true,
        sliderCloseTime: true,
        sliderOpenedEm: true,
        sliderClosedEm: true,
        sliderOpenedTitle: true,
        sliderClosedTitle: true,
        chatModel: true,
        peopleModel: true,
        setChatAnchor: true
      },

      sliderOpenTime: 250,
      sliderCloseTime: 250,
      sliderOpenedEm: 16,
      sliderClosedEm: 2,
      sliderOpenedTitle: 'Click to close',
      sliderClosedTitle: 'Click to open',

      chatModel: null,
      peopleModel: null,
      setChatAnchor: null
    };
    this.stateMap = {
      $appendTarget: null,
      positionType: 'closed',
      pxPerEm: 0,
      sliderHiddenPx: 0,
      sliderClosedPx: 0,
      sliderOpenedPx: 0
    };
    this.jqueryMap = {
    };
  }

  getEmSize(elem) {
    return Number(
    getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
    );
  }

  setJqueryMap() {
    const $appendTarget = this.stateMap.$appendTarget,
          $slider = $appendTarget.find('.spa-chat');

    this.jqueryMap = {
      $slider: $slider,
      $head: $slider.find('.spa-chat-head'),
      $toggle: $slider.find('.spa-chat-head-toggle'),
      $title: $slider.find('.spa-chat-head-title'),
      $sizer: $slider.find('.spa-chat-sizer'),
      $msgs: $slider.find('.spa-chat-msgs'),
      $box: $slider.find('.spa-chat-box'),
      $input: $slider.find('.spa-chat-input input[type=text]')
    }
  }

  setPxSizes() {
    const pxPerEm = this.getEmSize(this.jqueryMap.$slider.get(0)),
          openedHeightEm = this.configMap.sliderOpenedEm;
    this.stateMap.pxPerEm = pxPerEm;
    this.stateMap.sliderClosedPx = this.configMap.sliderClosedEm * pxPerEm;
    this.stateMap.sliderOpenedPx = openedHeightEm * pxPerEm;
    this.jqueryMap.$sizer.css({
      height: (openedHeightEm - 2) * pxPerEm
    });
  }

  setSliderPosition(positionType, callback) {
    if (this.stateMap.positionType === positionType) return true;

    let heightPx, animateTime, sliderTitle, toggleText;
    switch(positionType) {
      case 'opened':
        heightPx = this.stateMap.sliderOpenedPx;
        animateTime = this.configMap.sliderOpenTime;
        sliderTitle = this.configMap.sliderOpenedTitle;
        toggleText = '=';
      break;

      case 'hidden':
        heightPx = 0;
        animateTime = this.configMap.sliderOpenTime;
        sliderTitle = '';
        toggleText = '+';
      break;

      case 'closed':
        heightPx = this.stateMap.sliderClosedPx;
        animateTime = this.configMap.sliderCloseTime;
        sliderTitle = this.configMap.sliderClosedTitle;
        toggleText = '+';
      break;

      default:
        return false;
    }

    this.stateMap.positionType = '';
    this.jqueryMap.$slider.animate(
      {height: heightPx},
      animateTime,
      () => {
        this.jqueryMap.$toggle.prop('title', sliderTitle);
        this.jqueryMap.$toggle.text(toggleText);
        this.stateMap.positionType = positionType;
        if (callback) { callback(this.jqueryMap); }
      }
    );

    return true;
  }

  onClickToggle(event) {
    const setChatAnchor = this.configMap.setChatAnchor;

    if (this.stateMap.positionType === 'opened') this.configMap.setChatAnchor('closed');
    else if (this.stateMap.positionType === 'closed') this.configMap.setChatAnchor('opened');

    return false;
  }

  configModule(inputMap) {
    this.util.setConfigMap({
      inputMap: inputMap,
      settableMap: this.configMap.settableMap,
      configMap: this.configMap
    });
    return true;
  }

  initModule($appendTarget) {
    $appendTarget.append(this.configMap.mainHtml);
    this.stateMap.$appendTarget = $appendTarget;
    this.setJqueryMap();
    this.setPxSizes();

    this.jqueryMap.$toggle.prop('title', this.configMap.sliderClosedTitle);
    this.jqueryMap.$head.click(this.onClickToggle.bind(this));
    this.stateMap.positionType = 'closed';

    return true;
  }
}
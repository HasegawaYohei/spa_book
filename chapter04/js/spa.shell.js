class Shell {
  constructor() {
    this.configMap = {
      anchorSchemaMap: {
        chat: { opened: true, closed: true }
      },
      resizeInterval: 200,
      mainHtml: ''
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>',
    };
    this.stateMap = {
      anchorMap: {},
      resizeIdto: undefined
    };
    this.jqueryMap = {};
    this.util = new Util();
    this.chat = new Chat(this.util);
  }

  copyAnchorMap() {
    return $.extend(true, {}, this.stateMap.anchorMap);
  }

  setJqueryMap() {
    const $container = this.stateMap.$container;
    this.jqueryMap = {
      $container: $container
    };
  }

  toggleChat(doExtend, callback) {
    const pxChatHt = this.jqueryMap.$chat.height(),
          isOpen = pxChatHt === this.configMap.chatExtendHeight,
          isClosed = pxChatHt === this.configMap.chatRetractHeight,
          isSliding = !isOpen && !isClosed;

    if (isSliding) {return false;}

    if (doExtend) {
      this.jqueryMap.$chat.animate(
        {height: this.configMap.chatExtendHeight},
        this.configMap.chatExtendTime,
        () => {
          this.jqueryMap.$chat.attr(
            'title', this.configMap.chatExtendedTitle
          );
          this.stateMap.isChatRetracted = false;
          if (callback){ callback(this.jqueryMap.$chat); }
        }
      );

      return true;
    }

    this.jqueryMap.$chat.animate(
      {height: this.configMap.chatRetractHeight},
      this.configMap.chatRetractTime,
      () => {
        this.jqueryMap.$chat.attr(
          'title', this.configMap.chatRetractedTitle
        );
        this.stateMap.isChatRetracted = true;
        if (callback){ callback(this.jqueryMap.$chat); }
      }
    );

    return true;
  }

  changeAnchorPart(argMap) {
    const anchorMapRevise = this.copyAnchorMap();

    for (let keyName in argMap) {
      if (argMap.hasOwnProperty(keyName)) {
        if (keyName.indexOf('_') === 0) continue;

        anchorMapRevise[keyName] = argMap[keyName];
        const keyNameDep = '_' + keyName;
        if (argMap[keyNameDep]) {
          anchorMapRevise[keyNameDep] = argMap[keyNameDep];
        }
        else {
          delete anchorMapRevise[keyNameDep];
          delete anchorMapRevise['_s' + keyNameDep];
        }
      }
    }

    try {
      $.uriAnchor.setAnchor(anchorMapRevise);
    }
    catch(error) {
      $.uriAnchor.setAnchor(this.stateMap.anchorMap, null, true);
      return false;
    }

    return true;
  }

  onHashchange(event) {
    const anchorMapPrevious = this.copyAnchorMap();
    let anchorMapProposed,
        isOk = true;

    try {
      anchorMapProposed = $.uriAnchor.makeAnchorMap();
    }
    catch(error) {
      $.uriAnchor.setAnchor(anchorMapPrevious, null, true);
      return false;
    }

    this.stateMap.anchorMap = anchorMapProposed;

    const sChatPrevious = anchorMapPrevious._s_chat;
    const sChatProposed = anchorMapProposed._s_chat;

    if (!anchorMapPrevious || sChatPrevious !== sChatProposed) {
      const sChatProposed = anchorMapProposed.chat;
      switch (sChatProposed) {
        case 'opened':
          isOk = this.chat.setSliderPosition('opened');
        break;

        case 'closed':
          isOk = this.chat.setSliderPosition('closed');
        break;

        default:
          this.chat.setSliderPosition('closed');
          delete anchorMapProposed.chat;
          $.uriAnchor.setAnchor(anchorMapProposed, null, true);
          break;
      }
    }

    if (!isOk) {
      if (anchorMapPrevious) {
        $.uriAnchor.setAnchor(anchorMapPrevious, null, true);
        this.stateMap.anchorMap = anchorMapPrevious;
      }
      else {
        delete anchorMapProposed.chat;
        $.uriAnchor.setAnchor(anchorMapProposed, null, true);
      }
    }

    return false;
  }

  onClickChat(event) {
    this.changeAnchorPart({
      chat: (this.stateMap.isChatRetracted ? 'open' : 'closed')
    });

    return false;
  }

  onResize() {
    if (this.stateMap.resizeIdto) return true;

    this.chat.handleResize();
    this.stateMap.resizeIdto = setTimeout(
      () => this.stateMap.resizeIdto = undefined,
      this.configMap.resizeInterval
    );

    return true;
  }

  setChatAnchor(positionType) {
    return this.changeAnchorPart({chat: positionType});
  }

  initModule($container) {
    this.stateMap.$container = $container;
    $container.html( this.configMap.mainHtml );
    this.setJqueryMap();

    $.uriAnchor.configModule({
      schema_map: this.configMap.anchorSchemaMap
    });

    this.chat.configModule({
      setChatAnchor: this.setChatAnchor.bind(this),
      // chatModel: this.model.chat,
      // peopleModel: this.model.people
    });
    this.chat.initModule(this.jqueryMap.$container);

    $(window)
      .bind('resize', this.onResize.bind(this))
      .bind('hashchange', this.onHashchange.bind(this))
      .trigger('hashchange');
  }
}
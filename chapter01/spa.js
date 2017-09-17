class Spa {
  constructor () {
    this.CONFIG_MAP = {
      extendedHeight : 434,
      extendedTitle  : 'Click to retract',
      retractedHeight: 16,
      retractedTitle : 'Click to extend',
      templateHtml   : '<div class="spa-slider"></div>'
    };
  }

  toggleSlider () {
    let sliderHeight = this.$chatSlider.height(),
        $chatSlider = this.$chatSlider;

    // 格納されているスライダーを拡大する.
    if (sliderHeight === this.CONFIG_MAP.retractedHeight) {
      $chatSlider.animate({height: this.CONFIG_MAP.extendedHeight})
                 .attr('title', this.CONFIG_MAP.retractedTitle);
      return true;
    }
    // 拡大されているスライダーを格納する.
    else if (sliderHeight === this.CONFIG_MAP.extendedHeight) {
      $chatSlider.animate({height: this.CONFIG_MAP.retractedHeight})
                 .attr('title', this.CONFIG_MAP.retractedHeight);
      return true;
    }

    // スライダーが以降中の場合は何もしない.
    return false;
  }

  onClickSlider (event) {
    // this コンテキストが変わっているため, 引数にこのクラスを指すthisを渡してもらう.
    event.data.this.toggleSlider();
    return false;
  }

  initModule ($container) {
    $container.html(this.CONFIG_MAP.templateHtml);
    $container.html(this.CONFIG_MAP.templateHtml);
    this.$chatSlider = $container.find('.spa-slider');
    // スライダーの高さと幅を初期化する.
    // ユーザイベントをイベントハンドラにバインドする.
    this.$chatSlider.attr('title', this.CONFIG_MAP.retractedTitle)
                    .on('click', {this: this}, this.onClickSlider);

    return true;
  }
}

let spa = new Spa(jQuery);
jQuery(document).ready(
  function () {spa.initModule(jQuery('#spa'))}
);
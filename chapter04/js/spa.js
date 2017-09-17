class SPA {
  constructor() {
    this.shell = new Shell();
  }

  initModule($container) {
    this.shell.initModule($container);
  }
}

const spa = new SPA();
export class Hotkey {
  constructor(key) {
    this.key = key;
    this.enabled = true;
  }
  matches(e) {
    return e.key === this.key;
  }
  setKey(key) {
    this.key = key;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
} 
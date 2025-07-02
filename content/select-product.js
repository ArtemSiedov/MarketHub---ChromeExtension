import { Hotkey } from './hotkey.js';

let selectProductHotkeyPressed = false;
let selectProductHotkey = null;

export function setupSelectProductHotkey() {
  console.log('setupSelectProductHotkey called');
  try {
    chrome.storage.local.get(['selectProductHotkey'], (result) => {
      console.log('selectProductHotkey storage:', result);
      try {
        if (!result.selectProductHotkey) {
          if (window.marketHubSelectProductHotkeyKeyHandler) {
            document.removeEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
            document.removeEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
            window.marketHubSelectProductHotkeyKeyHandler = null;
          }
          if (window.marketHubSelectProductHotkeyMouseHandler) {
            document.removeEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
            window.marketHubSelectProductHotkeyMouseHandler = null;
          }
          return;
        }
        selectProductHotkey = result.selectProductHotkey;

        // Клавиша
        window.marketHubSelectProductHotkeyKeyHandler = (e) => {
          if (e.key && e.key === selectProductHotkey) {
            if (e.type === 'keydown') selectProductHotkeyPressed = true;
            if (e.type === 'keyup') selectProductHotkeyPressed = false;
          }
        };
        document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
        document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);

        // Клик мышкой по строке товара
        window.marketHubSelectProductHotkeyMouseHandler = (e) => {
          // Разрешаем выбор только если зажата клавиша
          if (!selectProductHotkeyPressed) return;
          const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
          if (tr) {
            e.preventDefault();
            const dataKey = tr.getAttribute('data-key');
            // Пробуем найти чекбокс внутри строки
            let checkbox = tr.querySelector('input[type="checkbox"]');
            // Если не нашли, ищем по data-key в строке sync-sources
            if (!checkbox && dataKey) {
              checkbox = document.querySelector(
                `tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`
              );
            }
            if (checkbox) checkbox.click();
          }
        };
        document.addEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler, true);
      } catch (e) { console.error('MarketHub: ошибка в setupSelectProductHotkey (внутренняя)', e); }
    });
  } catch (e) {
    console.error('MarketHub: ошибка в setupSelectProductHotkey', e);
  }
}

export class SelectProductHotkey extends Hotkey {
  constructor(key) {
    super(key);
    this.pressed = false;
    this._keyHandler = this._handleKey.bind(this);
    this._mouseHandler = this._handleMouse.bind(this);
  }

  _handleKey(e) {
    if (e.key === this.key) {
      this.pressed = e.type === 'keydown';
    }
  }

  _handleMouse(e) {
    if (!this.enabled) return;
    if (this.pressed) {
      // Реальная логика выбора товара по клику
      const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
      if (tr) {
        e.preventDefault();
        const dataKey = tr.getAttribute('data-key');
        // Пробуем найти чекбокс внутри строки
        let checkbox = tr.querySelector('input[type="checkbox"]');
        // Если не нашли, ищем по data-key в строке sync-sources
        if (!checkbox && dataKey) {
          checkbox = document.querySelector(
            `tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`
          );
        }
        if (checkbox) checkbox.click();
      }
    }
  }

  listen() {
    document.addEventListener('keydown', this._keyHandler);
    document.addEventListener('keyup', this._keyHandler);
    document.addEventListener('mousedown', this._mouseHandler);
  }

  unlisten() {
    document.removeEventListener('keydown', this._keyHandler);
    document.removeEventListener('keyup', this._keyHandler);
    document.removeEventListener('mousedown', this._mouseHandler);
  }

  static setupFromStorage() {
    chrome.storage.local.get(['selectProductHotkeyEnabled', 'selectProductHotkey'], (result) => {
      if (!result.selectProductHotkeyEnabled || !result.selectProductHotkey) {
        if (window.marketHubSelectProductHotkeyKeyHandler) {
          document.removeEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
          document.removeEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
          window.marketHubSelectProductHotkeyKeyHandler = null;
        }
        if (window.marketHubSelectProductHotkeyMouseHandler) {
          document.removeEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
          window.marketHubSelectProductHotkeyMouseHandler = null;
        }
        return;
      }
      const selectProductHotkey = result.selectProductHotkey;
      let selectProductHotkeyPressed = false;
      window.marketHubSelectProductHotkeyKeyHandler = (e) => {
        if (e.key && e.key === selectProductHotkey) {
          if (e.type === 'keydown') selectProductHotkeyPressed = true;
          if (e.type === 'keyup') selectProductHotkeyPressed = false;
        }
      };
      document.addEventListener('keydown', window.marketHubSelectProductHotkeyKeyHandler);
      document.addEventListener('keyup', window.marketHubSelectProductHotkeyKeyHandler);
      window.marketHubSelectProductHotkeyMouseHandler = (e) => {
        if (!selectProductHotkeyPressed) return;
        const tr = e.target.closest('tr.kv-expand-detail-row.info.skip-export');
        if (tr) {
          e.preventDefault();
          const dataKey = tr.getAttribute('data-key');
          let checkbox = tr.querySelector('input[type="checkbox"]');
          if (!checkbox && dataKey) {
            checkbox = document.querySelector(
              `tr.sync-sources[data-key="${dataKey}"] input[type="checkbox"]`
            );
          }
          if (checkbox) checkbox.click();
        }
      };
      document.addEventListener('mousedown', window.marketHubSelectProductHotkeyMouseHandler);
    });
  }
} 
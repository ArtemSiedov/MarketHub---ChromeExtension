import { getSettings, setSettings } from './storage.js';

export class ModalManager {
  constructor(options = {}) {
    this.options = options;
    this.overlay = null;
    this.modal = null;
  }

  create() {
    if (!document.body) {
      alert('На этой странице расширения Chrome не работают!');
      return;
    }
    if (document.getElementById('market-hub-modal-overlay')) return;

    // Подключаем CSS только один раз
    if (!document.getElementById('market-hub-modal-css')) {
      const link = document.createElement('link');
      link.id = 'market-hub-modal-css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('content/market-hub-modal.css');
      document.head.appendChild(link);
    }

    // Создаём overlay
    const overlay = document.createElement('div');
    overlay.id = 'market-hub-modal-overlay';
    overlay.className = 'market-hub-modal-overlay';

    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.className = 'market-hub-modal';

    // === БЛОК УПРАВЛЕНИЕ ===
    const managementBlock = document.createElement('div');
    managementBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
    managementBlock.innerHTML = `
      <div class="market-hub-modal-block-title" style="font-size:16px; margin-bottom:14px;">Управление</div>
      <div class="market-hub-inline-row">
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Открыть товары</div>
          <input type="text" id="hotkey-input" class="market-hub-hotkey-input-inline" placeholder="Клавиша..." readonly>
        </div>
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Выбор товара</div>
          <input type="text" id="select-product-hotkey-input" class="market-hub-hotkey-input-inline" placeholder="Клавиша..." readonly>
          <div class="market-hub-hotkey-hint">+ Mouse click</div>
        </div>
      </div>
    `;
    modal.appendChild(managementBlock);
    // === КОНЕЦ БЛОКА УПРАВЛЕНИЕ ===

    // === БЛОК НАВИГАЦИЯ ===
    const navigationBlock = document.createElement('div');
    navigationBlock.className = 'market-hub-modal-block market-hub-modal-block-inline';
    navigationBlock.innerHTML = `
      <div class="market-hub-modal-block-title" style="font-size:16px; margin-bottom:14px;">Навигация</div>
      <div class="market-hub-inline-row">
        <div class="market-hub-inline-block">
          <div class="market-hub-modal-block-title">Пагинация+</div>
          <label class="market-hub-checkbox-label-inline">
            <input type="checkbox" id="pagination-checkbox" class="market-hub-checkbox">
            <span>Вкл.</span>
          </label>
        </div>
      </div>
    `;
    modal.appendChild(navigationBlock);
    // === КОНЕЦ БЛОКА НАВИГАЦИЯ ===

    // Кнопки
    const actions = document.createElement('div');
    actions.className = 'market-hub-actions';
    actions.innerHTML = `
      <button class="market-hub-btn cancel">Отмена</button>
      <button class="market-hub-btn save">Сохранить</button>
    `;
    modal.appendChild(actions);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.modal = modal;

    // === ПОСЛЕ добавления в DOM ищем элементы и вешаем обработчики ===
    getSettings(['paginationPlus', 'quickOpenHotkey', 'selectProductHotkey']).then((result) => {
      try {
        const paginationCheckbox = document.getElementById('pagination-checkbox');
        const hotkeyInput = document.getElementById('hotkey-input');
        const selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
        paginationCheckbox.checked = !!result.paginationPlus;
        if (result.quickOpenHotkey) {
          hotkeyInput.value = result.quickOpenHotkey;
        }
        if (result.selectProductHotkey) {
          selectProductHotkeyInput.value = result.selectProductHotkey;
        }
      } catch (e) { console.error('MarketHub: ошибка при загрузке состояния', e); }
    });

    // Обработчик ввода хоткея для открытия товаров
    const hotkeyInput = document.getElementById('hotkey-input');
    hotkeyInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        keys.push(e.key.toUpperCase());
      }
      if (keys.length > 1) {
        hotkeyInput.value = keys.join('+');
      }
    });

    // Обработчик ввода хоткея для выбора товара
    const selectProductHotkeyInput = document.getElementById('select-product-hotkey-input');
    selectProductHotkeyInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      selectProductHotkeyInput.value = e.key;
    });

    // Сохранить
    const saveBtn = modal.querySelector('.market-hub-btn.save');
    saveBtn.addEventListener('click', () => {
      try {
        const settings = {
          paginationPlus: document.getElementById('pagination-checkbox').checked,
          quickOpenHotkey: document.getElementById('hotkey-input').value,
          selectProductHotkey: document.getElementById('select-product-hotkey-input').value
        };
        setSettings(settings).then(() => {
          this.remove();
          if (this.options.onSave) this.options.onSave(settings);
        });
      } catch (e) { console.error('MarketHub: ошибка при сохранении состояния', e); }
    });

    // Отмена
    const cancelBtn = modal.querySelector('.market-hub-btn.cancel');
    cancelBtn.addEventListener('click', () => {
      try { this.remove(); } catch (e) { console.error('MarketHub: ошибка при закрытии модалки', e); }
    });

    // Клик вне модалки
    overlay.addEventListener('click', (e) => {
      try {
        if (e.target === overlay) {
          this.remove();
        }
      } catch (e) { console.error('MarketHub: ошибка при клике вне модалки', e); }
    });
  }

  remove() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.modal = null;
    }
  }

  update(options = {}) {
    this.options = { ...this.options, ...options };
    // Перерисовать UI, если нужно
  }

  // Можно добавить методы для загрузки/сохранения настроек, обновления UI и т.д.
} 
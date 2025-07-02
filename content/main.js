console.log('MARKETHUB BUNDLE LOADED');
import { setupQuickOpenProducts } from './quick-open.js';
import { enhancePaginationIfEnabled, observePaginationPlus, observePaginationContainer } from './pagination.js';
import { ModalManager } from './modal.js';
import { setupSelectProductHotkey } from './select-product.js';

function reinitAll() {
  setupQuickOpenProducts();
  enhancePaginationIfEnabled();
  setupSelectProductHotkey();
}

// Инициализация при старте
setupQuickOpenProducts();
enhancePaginationIfEnabled();
observePaginationPlus();
observePaginationContainer();
setupSelectProductHotkey();

const modalManager = new ModalManager({
  onSave: () => {
    reinitAll();
  }
});

// --- Логика открытия всех товаров ---
function openAllProducts() {
  // Ваша логика открытия всех товаров
  console.log('Открыть все товары!');
}

// --- Логика выбора товара по клику ---
function selectProductByClick(e) {
  // Ваша логика выбора товара по клику
  console.log('Выбрать товар по клику!', e);
}

// --- Инициализация пагинации ---
// const paginationManager = new PaginationManager();
// paginationManager.enable(); // включить при необходимости

// Глобальный обработчик сообщений для открытия/закрытия модалки
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'open_market_hub_modal') {
    modalManager.create();
  }
  if (msg && msg.type === 'close_market_hub_modal') {
    modalManager.remove();
  }
}); 
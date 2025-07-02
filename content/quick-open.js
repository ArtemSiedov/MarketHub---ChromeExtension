export function setupQuickOpenProducts() {
  console.log('setupQuickOpenProducts called');
  chrome.storage.local.get(['quickOpenHotkey'], (result) => {
    console.log('quickOpen storage:', result);
    if (!result.quickOpenHotkey) {
      document.removeEventListener('keydown', handleQuickOpenHotkey);
      return;
    }
    function handleQuickOpenHotkey(e) {
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');
      keys.push(e.key.toUpperCase());
      if (keys.join('+') === result.quickOpenHotkey) {
        e.preventDefault();
        openAllProducts();
      }
    }
    document.removeEventListener('keydown', handleQuickOpenHotkey);
    document.addEventListener('keydown', handleQuickOpenHotkey);
  });
}

export function openAllProducts() {
  try {
    const productCells = document.querySelectorAll("#sync-sources-container > table > tbody > tr > td:nth-child(3) > div > a");
    if (productCells.length === 0) {
      console.log('MarketHub: товары не найдены на странице');
      return;
    }
    console.log(`MarketHub: найдено ${productCells.length} товаров, открываем...`);
    productCells.forEach((cell) => {
      window.open(cell.href, '_blank');
    });
  } catch (e) {
    console.error('MarketHub: ошибка при открытии товаров', e);
  }
} 
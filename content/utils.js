// Парсинг хоткея из строки (например, 'Ctrl+Shift+O')
export function parseHotkey(hotkeyStr) {
  if (!hotkeyStr) return null;
  return hotkeyStr.split('+').map(k => k.trim());
}

// Проверка, совпадает ли событие с хоткеем
export function matchHotkey(e, hotkeyArr) {
  if (!hotkeyArr || !hotkeyArr.length) return false;
  const key = e.key.toUpperCase();
  const mods = [];
  if (e.ctrlKey) mods.push('CTRL');
  if (e.shiftKey) mods.push('SHIFT');
  if (e.altKey) mods.push('ALT');
  if (e.metaKey) mods.push('META');
  const mainKey = hotkeyArr[hotkeyArr.length - 1].toUpperCase();
  const hotkeyMods = hotkeyArr.slice(0, -1).map(k => k.toUpperCase());
  return key === mainKey && mods.length === hotkeyMods.length && mods.every(m => hotkeyMods.includes(m));
}

// Debounce
export function debounce(fn, ms) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
} 
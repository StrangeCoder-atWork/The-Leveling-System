export function updateUserDataLocallyAndSync(newData) {
  const stored = JSON.parse(localStorage.getItem('userData') || '{}');
  const merged = { ...stored, ...newData };
  localStorage.setItem('userData', JSON.stringify(merged));

  if (navigator.onLine) {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    });
  }
}
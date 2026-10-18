let database;
function open() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('atelier.insights.v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('rounds', { keyPath: 'id' }).createIndex('scope', 'scope');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Personal history storage is unavailable.'));
  });
  return database;
}

export async function saveRecord(record) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('rounds', 'readwrite'), store = tx.objectStore('rounds');
    let inserted = false;
    const existing = store.get(record.id);
    existing.onsuccess = () => { if (!existing.result) { store.add(record); inserted = true; } };
    tx.oncomplete = () => resolve(inserted);
    tx.onerror = () => reject(new Error('The latest round could not be saved for analysis.'));
  });
}

export async function readRecords(owner, epoch) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = db.transaction('rounds').objectStore('rounds').index('scope').getAll(`${owner}:${epoch}`);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Your current analysis record could not be read.'));
  });
}

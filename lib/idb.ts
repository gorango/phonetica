const DB_VERSION = 1
const DB_NAME = 'phonetica'
const DB_STORE = 'audios'

export async function createAudio({ id, file }: { id: string; file: string }): Promise<void> {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION)

  await new Promise<void>((resolve, reject) => {
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(DB_STORE))
        db.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: false })
    }
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(DB_STORE, 'readwrite')
      const objectStore = transaction.objectStore(DB_STORE)
      const addRequest = objectStore.add({ id, file })
      addRequest.onsuccess = () => {
        db.close()
        resolve()
      }
      addRequest.onerror = () => {
        db.close()
        reject(new Error('Failed to store audio file'))
      }
      transaction.oncomplete = () => {
        db.close()
      }
    }
    request.onerror = () => reject(new Error('Failed to store audio file'))
  })
}

export async function getAudio(id: string): Promise<string> {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(DB_STORE, 'readwrite')
      const objectStore = transaction.objectStore(DB_STORE)
      const getRequest = objectStore.get(id)
      getRequest.onsuccess = () => {
        if (getRequest.result)
          resolve(getRequest.result.file)
        else
          reject(new Error('Failed to retrieve audio file'))
      }
      getRequest.onerror = () => reject(new Error('Failed to retrieve audio file'))
      transaction.oncomplete = () => {
        db.close()
      }
    }
    request.onerror = () => reject(new Error('Failed to retrieve audio file'))
  })
}

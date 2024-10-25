import { createBlobFromUrl } from "./blob-parser";

// Definición de tipos para el libro
interface Book {
    id: string;
    images:Images[]
}

interface Images {
    id:number,
    url:Blob
}

type DBActionType = 'add' | 'put' | 'get' | 'getAll' | 'delete';

export function openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const dbName = 'LibraryDB';
        const version = 1;
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = (event:any) => {
            const db = event.target.result as IDBDatabase;
            
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event:any) => {
            resolve(event.target.result as IDBDatabase); 
        };

        request.onerror = (event:any) => {
            reject(`Error al abrir la base de datos: ${event.target.errorCode}`);
        };
    });
}

export function performDBAction(
    db: IDBDatabase,
    actionType: DBActionType,
    data: Book | null = null,
    key: string | null = null
): Promise<any> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['books'], 'readwrite');
        const store = transaction.objectStore('books');
        let request: IDBRequest;

        switch (actionType) {
            case 'add':
                request = store.add(data as Book);
                break;
            case 'put':
                request = store.put(data as Book);
                break;
            case 'get':
                request = store.get(key!);
                break;
            case 'getAll':
                request = store.getAll();
                break;
            case 'delete':
                request = store.delete(key!);
                break;
            default:
                reject('Tipo de acción desconocido.');
                return;
        }

        request.onsuccess = (event:any) => {
            resolve(event.target.result);
        };

        request.onerror = (event:any) => {
            reject(`Error en la operación: ${event.target.errorCode}`);
        };
    });
}


export const getSingleBookFromIndexDb = async (book_id: string) => {
    try {
      const db = await openIndexedDB();
      return performDBAction(db, "get", null, book_id);
    } catch (error) {
      throw new Error("Error setting book in indexDb" + error);
    }
  };
  
  export const setSingleBookInIndexDb = async (book: any) => {
    try {
      const db = await openIndexedDB();
      if(!book?.images?.length)return
      return performDBAction(db, 'put', {
        id: book.id,
        images: await Promise.all(
          book.images.map(async (image: any) => ({
            id: image.id,
            url: await createBlobFromUrl(image.url),
          }))
        ),
      });
    } catch (error) {
      throw new Error("Error setting book in indexDb" + error);
    }
  };
  


export async function addImagesToBook(
    db: IDBDatabase,
    bookId: string,
    newImages: Array<{ id: number, url: Blob }>
): Promise<void> {
    const transaction = db.transaction(['books'], 'readwrite');
    const store = transaction.objectStore('books');

    const getRequest = store.get(bookId);
    getRequest.onsuccess = (event: any) => {
        const book = event.target.result;
        if (book) {
            const lastImageId = book.images.length > 0 ? book.images[book.images.length - 1].id : 0;

            newImages.forEach((image, index) => {
                const imageId = lastImageId + index + 1;
                book.images.push({ id: imageId, url: image.url });
            });

            const updateRequest = store.put(book);
            updateRequest.onsuccess = () => {
                console.log('Nuevas imágenes agregadas exitosamente');
            };
            updateRequest.onerror = (event: any) => {
                console.error(`Error al agregar las imágenes: ${event.target.error}`);
            };
        } else {
            console.log(`Libro con id ${bookId} no encontrado`);
        }
    };
}




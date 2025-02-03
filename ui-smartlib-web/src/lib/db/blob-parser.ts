export async function createBlobFromUrl(imageUrl:string):Promise<Blob> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob
}

export function createUrlFromBlob(blob: Blob): string {
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}
export async function createBlobFromUrlV2(imageUrl:string):Promise<Blob> {
    console.log("createBlobFromUrl 2 *******: " + imageUrl)
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob
}

export function createUrlFromBlobV2(blob: Blob): string {
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}
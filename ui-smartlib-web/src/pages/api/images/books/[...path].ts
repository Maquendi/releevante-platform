import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const filePath = join('C:\\Users\\LEGION\\Documents\\data\\images\\books\\', ...(path as string[]));

  try {

    console.log("received request: ", filePath, path)
    const fileStats = statSync(filePath);

    // Set the appropriate headers for image type and size
    res.setHeader('Content-Type', 'image/jpeg');  // Adjust for PNG, GIF, etc.
    res.setHeader('Content-Length', fileStats.size);

    // Stream the image directly to the client
    const imageStream = createReadStream(filePath);
    imageStream.pipe(res);
  } catch (error) {
    res.status(404).send('Image not found');
  }
}

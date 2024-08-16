import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
@Controller('image')
export class ImageController {
  @Get(':imageName')
  async getImage(
    @Param('imageName') imageName: string,
    @Query('width') width: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Check if width parameter is provided and valid
      if (!width || isNaN(Number(width))) {
        // res.status(400).json({ error: 'Invalid or missing width parameter' });
        // return;
        width = '200';
      }

      // If the image is not found in the cache, read it from the file system
      console.log('Image not found in cache');

      const imagePath = path.join('./uploads/products', imageName);

      // Check if the image file exists
      try {
        await fs.access(imagePath);
      } catch (error) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      // Use sharp to resize the image based on the requested width
      // const resizedImage = await sharp(imagePath)
      //   .resize(Number(width))
      //   .toBuffer();

      // keep aspect ratio and orientation
      const resizedImage = await sharp(imagePath)
        .resize(Number(width), null, { withoutEnlargement: true })
        .toBuffer();

      // Set the appropriate response headers for an image
      res.header('Content-Type', 'image/jpeg');
      res.send(resizedImage);

      // Cache the resized image for future requests with a TTL of 1 hour (3600 seconds)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  @Get('/school/:imageName')
  async getSchoolImage(
    @Param('imageName') imageName: string,
    @Query('width') width: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Check if width parameter is provided and valid
      if (!width || isNaN(Number(width))) {
        // res.status(400).json({ error: 'Invalid or missing width parameter' });
        // return;
        width = '200';
      }

      // If the image is not found in the cache, read it from the file system
      console.log('Image not found in cache');

      const imagePath = path.join('./uploads/schools', imageName);
      console.log('imagePath', imagePath);
      // Check if the image file exists
      try {
        await fs.access(imagePath);
      } catch (error) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      // Use sharp to resize the image based on the requested width
      // const resizedImage = await sharp(imagePath)
      //   .resize(Number(width))
      //   .toBuffer();

      // keep aspect ratio and orientation
      const resizedImage = await sharp(imagePath)
        .resize(Number(width), null, { withoutEnlargement: true })
        .toBuffer();

      // Set the appropriate response headers for an image
      res.header('Content-Type', 'image/jpeg');
      res.send(resizedImage);

      // Cache the resized image for future requests with a TTL of 1 hour (3600 seconds)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @Get('/sizecharts/:imageName')
  async getSizeChartImage(
    @Param('imageName') imageName: string,
    @Query('width') width: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Check if width parameter is provided and valid
      if (!width || isNaN(Number(width))) {
        // res.status(400).json({ error: 'Invalid or missing width parameter' });
        // return;
        width = '200';
      }

      // If the image is not found in the cache, read it from the file system
      console.log('Image not found in cache');

      const imagePath = path.join('./uploads/sizecharts', imageName);
      console.log('imagePath', imagePath);
      // Check if the image file exists
      try {
        await fs.access(imagePath);
      } catch (error) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      // Use sharp to resize the image based on the requested width
      // const resizedImage = await sharp(imagePath)
      //   .resize(Number(width))
      //   .toBuffer();

      // keep aspect ratio and orientation
      const resizedImage = await sharp(imagePath)
        .resize(Number(width), null, { withoutEnlargement: true })
        .toBuffer();

      // Set the appropriate response headers for an image
      res.header('Content-Type', 'image/jpeg');
      res.send(resizedImage);

      // Cache the resized image for future requests with a TTL of 1 hour (3600 seconds)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

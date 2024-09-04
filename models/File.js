// models/File.js
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

class File {
  static async createFile(userId, name, type, parentId, isPublic, data) {
    const file = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId ? new ObjectId(parentId) : 0,
      localPath: null,
    };

    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = path.join(folderPath, `${new ObjectId()}`);
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      file.localPath = filePath;
    }

    const result = await dbClient.db.collection('files').insertOne(file);
    return result.insertedId;
  }

  static async findById(id) {
    return dbClient.db.collection('files').findOne({ _id: new ObjectId(id) });
  }
}

export default File;

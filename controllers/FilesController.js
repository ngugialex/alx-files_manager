// controllers/FilesController.js
// Existing imports...

class FilesController {
  // Existing methods...

  static async getFileData(req, res) {
    const { id } = req.params;
    const { size } = req.query;

    const file = await File.findById(id);

    if (!file || file.type !== 'image') {
      return res.status(404).json({ error: 'File not found' });
    }

    let filePath = file.localPath;
    if (size && ['100', '250', '500'].includes(size)) {
      filePath = `${filePath}_${size}`;
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = mime.lookup(filePath);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(filePath);
  }
}

export default FilesController;

import supabase from '../db/index.js';

export async function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
  const { originalname, mimetype, buffer, size } = req.file;
  const userId = req.user.id;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('googledriveclone') // bucket name
    .upload(`${userId}/${Date.now()}_${originalname}`, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) return res.status(500).json({ error: error.message });

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('googledriveclone')
    .getPublicUrl(data.path);

  // Save metadata to Supabase DB
  const { data: fileData, error: dbError } = await supabase
    .from('files') // <-- use your actual table name
    .insert([{
      name: originalname,
      size,
      format: mimetype,
      url: publicUrlData.publicUrl,
      owner_id: userId
    }])
    .select();

  if (dbError) return res.status(500).json({ error: dbError.message });

  res.json({ message: 'File uploaded successfully', file: fileData[0] });
}

export async function renameFile(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  // Update file metadata in Supabase DB
  const { data, error } = await supabase
    .from('files')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'File renamed successfully', file: data[0] });
}

//soft delete file
export async function deleteFile(req, res) {
  const { id } = req.params;

  // Soft delete file in Supabase DB
  const { data, error } = await supabase
    .from('files')
    .update({ deleted_at: new Date() })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'File deleted successfully', file: data[0] });
}

export async function createFolder(req, res) {
  const { name } = req.body;
  const userId = req.user.id;

  // Create folder in Supabase DB
  const { data, error } = await supabase
    .from('folders')
    .insert([{ name, owner_id: userId }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Folder created successfully', folder: data[0] });
}

export async function renameFolder(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  // Update folder metadata in Supabase DB
  const { data, error } = await supabase
    .from('folders')
    .update({ name })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Folder renamed successfully', folder: data[0] });
}

export async function deleteFolder(req, res) {
  const { id } = req.params;

  // Soft delete folder in Supabase DB
  const { data, error } = await supabase
    .from('folders')
    .update({ deleted_at: new Date() })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Folder deleted successfully', folder: data[0] });
}

// Show trashed files
export async function getTrashedFiles(req, res) {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('owner_id', userId)
    .not('deleted_at', 'is', null);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ files: data });
}

// Show trashed folders
export async function getTrashedFolders(req, res) {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('owner_id', userId)
    .not('deleted_at', 'is', null);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ folders: data });
}

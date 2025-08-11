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
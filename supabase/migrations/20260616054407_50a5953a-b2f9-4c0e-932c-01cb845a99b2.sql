CREATE POLICY "Public read portfolio-files" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-files');
CREATE POLICY "Public insert portfolio-files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-files');
CREATE POLICY "Public update portfolio-files" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-files');
CREATE POLICY "Public delete portfolio-files" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-files');
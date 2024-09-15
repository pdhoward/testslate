"use client"
import { useState, useEffect } from 'react';
import { Box, Stack, Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { Document } from '@/lib/types'; 
import { useRouter } from 'next/navigation';
import Navbar from '@/components/nav/Navbar'
import { Sidebar } from '@/components/nav/Sidebar';
import Link from 'next/link';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]); // Documents fetched from MongoDB
  const router = useRouter();

  // Mock fetch function to get documents based on selected file
  const fetchDocuments = async () => {
    // Simulating a fetch from MongoDB or API
    const fetchedDocs: Document[] = [
      { id: '1', title: 'Business Process', type: 'business-process', content: 'This is a business process.' },
      { id: '2', title: 'Test Document', type: 'test-doc', content: 'This is a test document.' },
      // Add more documents as needed
    ];
    setDocuments(fetchedDocs);
  };

  // Use effect to fetch documents when the component is mounted
  useEffect(() => {
    fetchDocuments();
  }, []); // Assuming the fileId is passed when the file is clicked

  return (
    <Box sx={{ flexFlow: 1 }}> 
      <Navbar  />
      <Sidebar />
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {documents.map((doc) => (
           <Stack key={doc.id} sx={{ flex: '1 1 30%', minWidth: '300px' }}>
            <Card>
              <CardHeader title={doc.title} subheader={doc.type.toUpperCase()} />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {doc.content.substring(0, 100)}... {/* Show a preview of the content */}
                </Typography>
                <Link href={`/document/${doc.id}`}>
                  <Button variant="outlined" color="primary" sx={{ marginTop: 2 }}>
                    Explore Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

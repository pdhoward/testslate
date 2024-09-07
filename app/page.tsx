"use client"
import React from 'react';
import SlateEditor from '@/components/SlateEditor';
import Header from '@/components/nav/Header';
import { FileTreeComponent } from '@/components/nav/FileTreeComponent';

const HomePage: React.FC = () => {
  return (
    
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Header />
      {/* Sidebar */}
      <FileTreeComponent />

      {/* Main content - Editor */}
      <main className="w-4/5 p-6">
        <div className="editor-container h-full bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          <h1 className="text-lg font-bold mb-8">Edit Test Plan</h1>
          <SlateEditor />
        </div>
      </main>
    </div>
  );
};

export default HomePage;

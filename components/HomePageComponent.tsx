"use client";
import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import SlateEditor from '@/components/SlateEditor';
import CodeEditor from '@/components/code/CodeEditor'; 
import Header from '@/components/nav/Header';
import FileTreeComponent from '@/components/nav/FileTreeComponent';
import DocTreeComponent from '@/components/nav/DocTreeComponent'
import Tabs from '@/components/tabs/Tabs';
import LLMMessagePanel from '@/components/LLMMessages';

export default function HomePageComponent({
  defaultLayout
}: {
  defaultLayout: number[];
}) {
  const [selectedTab, setSelectedTab] = useState<'document' | 'code'>('document'); // Tab state

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  const headerOffsetClass = "mt-14"; 
  const headerHeight = 60
   // Calculate the remaining height for the PanelGroup
  const panelGroupHeight = `calc(100vh - ${headerHeight}px)`;

  return (
    <div className={`${headerOffsetClass} overflow-hidden `}>
      <Header />

      <PanelGroup 
        direction="horizontal" 
        onLayout={onLayout}             
        style={{ height: panelGroupHeight }}
      >
        {/* Left Sidebar */}
        <Panel
          className="border dark:bg-gray-900 text-white dark:border-gray-700"          
          defaultSize={defaultLayout[0]}
          minSize={10}
          maxSize={30}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ height: '100%', overflowY: 'auto' }} className="bg-gray-900">
          {selectedTab === 'document' ? <DocTreeComponent /> : <FileTreeComponent />} 
          </div>          
        </Panel>
        
        <PanelResizeHandle className="mx-1 w-2 bg-gray-600" />
        
        {/* Main Content */}
        <Panel
          className="border dark:border-gray-700 dark:bg-gray-900 text-white flex-grow"
          defaultSize={defaultLayout[1]}
          minSize={40}
          maxSize={80}
        >
          {/* Tabs fixed to the top of the middle panel */}
          <div className="sticky top-0 z-10 bg-gray-900">
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>
          
          {/* Editor should fill the rest of the middle panel */}
          <main className="flex flex-col h-full">
            <div className="flex-grow bg-gray-900 rounded-lg shadow-lg overflow-hidden mt-2">
              {selectedTab === 'document' ? <SlateEditor /> : <CodeEditor />}               
            </div>
          </main>
        </Panel>
        
        <PanelResizeHandle className="mx-1 w-2 bg-gray-600" />
        
        {/* Right Sidebar (LLM Messages) */}
        <Panel
          className="border dark:border-gray-700 dark:bg-gray-900 text-white"
          defaultSize={defaultLayout[2]}
          minSize={10}
          maxSize={30}
        >
          <div className="bg-gray-900 h-full" style={{ width: '100%' }}>
            <LLMMessagePanel />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

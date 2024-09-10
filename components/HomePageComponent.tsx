
"use client"
import React, { useState } from 'react';
import SlateEditor from '@/components/SlateEditor';
import Header from '@/components/nav/Header';
import FileTreeComponent from '@/components/nav/FileTreeComponent';
import CodeEditor from '@/components/code/CodeEditor'; // Updated CodeEditor component
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
  
    const headerOffsetClass = "mt-0"; 
    const headerHeight = 96
     // Calculate the remaining height for the PanelGroup
    const panelGroupHeight = `calc(100vh - ${headerHeight}px)`;
  
    return (
      <div className={`${headerOffsetClass} overflow-hidden `} >
         <PanelGroup 
          direction="horizontal" 
          onLayout={onLayout}        
          style={{ height: panelGroupHeight }}
          >
          {/* Sidebar */}
          <Panel
              className="border dark:bg-black text-white dark:border-white"          
              defaultSize={defaultLayout[0]}
              minSize={10}
              maxSize={30}
              style={{ overflow: 'hidden' }} // Hide any overflow
            >
              <div style={{ height: '100%', overflowY: 'auto' }}>
                <FileTreeComponent />
              </div>          
          </Panel>
          <PanelResizeHandle className="mx-1 w-2 bg-slate-300" />
          <Panel
                className="border dark:border-white dark:bg-black text-white flex-grow"
                defaultSize={defaultLayout[1]}
                minSize={40}
                maxSize={80}
              >
            {/* Main Content */}
            <main className="flex-1 p-6">
              <Header />
              <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
  
              <div className="editor-container h-full bg-gray-700 rounded-lg shadow-lg overflow-hidden mt-4">
                {selectedTab === 'document' ? <SlateEditor /> : <CodeEditor />}
              </div>
            </main>
          </Panel>
          <PanelResizeHandle className="mx-1 w-2 bg-slate-300" />
  
          {/* Right Sidebar (LLM Messages)*/}
          <Panel
              className="border dark:border-white dark:bg-black text-white"
              defaultSize={defaultLayout[2]}
              minSize={10}
              maxSize={30}
            >
  
            <div className="bg-gray-800" style={{ width: '100%' }}>
              <LLMMessagePanel />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );
  };
  
  
  
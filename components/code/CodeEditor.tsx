"use client"
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Editor, {OnMount} from "@monaco-editor/react"
import { Octokit } from "@octokit/rest";
import { useTreeData } from "@/context/useTreeData";
import { createHighlighter } from "shiki";
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor';

// Utility function to determine the language from the file extension
const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop();
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs':    
      return 'javascript';
    case 'jsx':
      return 'jsx'
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'tsx'
    case 'html':
    case 'htm':
      return 'html'
    case 'md': 
      return 'markdown'
    case 'mdx':
      return 'mdx'
    case 'java':
      return 'java'
    case 'sql': 
      return 'sql'
    case 'css':
      return 'css'
    case 'cbl':
      return 'cobol'
    case 'cpy':
    case 'CPY':
      return 'cobol'
    case 'asm':
    case 's':
    case 'S':
      return 'asm'
    case 'json':
      return 'json'
    case 'go':
      return 'go'
    case 'cs':
      return 'c#'
    case 'py':
      return 'python'
    // ...other cases for different file extensions
    default:
      return 'text';
  }
};

export default function CodeEditor ({}) {
  const [fileContent, setFileContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const { isRightClicked, fileTreeItemSelected, repoDetails, updateRepoDetails } = useTreeData();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null); // Ref to store the editor instance
  

  // Save the cursor position to localStorage
  const saveCursorPosition = (editor: any) => {
    const position = editor.getPosition();
    localStorage.setItem('cursorPosition', JSON.stringify(position));
  };

  // Retrieve the cursor position from localStorage
  const getSavedCursorPosition = () => {
    const position = localStorage.getItem('cursorPosition');
    return position ? JSON.parse(position) : null;
  };

  function debounce(func: any, wait: any) {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const saveContent = useCallback(
    debounce(() => {
      editorRef.current?.getValue();      
    }, 2000),
    [] // dependencies array
  );

  useEffect(() => {

    if (fileTreeItemSelected.itemType !== 'blob' && fileTreeItemSelected.itemType !== 'file') {
      return;
    }
    
    const octokit = new Octokit();
  
    if (repoDetails.owner && repoDetails.repo && fileTreeItemSelected.itemIndex) {
      octokit.git
        .getBlob({
          owner: repoDetails.owner,
          repo: repoDetails.repo,
          file_sha: fileTreeItemSelected.itemIndex as string,
        })
        .then((response) => {
          const content = Buffer.from(response.data.content, "base64").toString("utf-8");
          
          // Update only the necessary state
          setFileContent(content);
          setLanguage(getLanguageFromFileName(fileTreeItemSelected.itemName));
  
          // Avoid re-triggering useEffect by selectively updating repoDetails
          if (repoDetails.content !== content) {
            updateRepoDetails({ ...repoDetails, content });
          }
        })
        .catch((error) => {
          console.error("Error fetching file content from GitHub:", error);
        });
    }
  }, [fileTreeItemSelected.itemIndex, repoDetails.owner, repoDetails.repo]);
  

  const handleEditorDidMount: OnMount = async (editor, monaco) => {

    const highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript', 
        'typescript', 
        'css', 
        'html',
        'python',
        'cobol',
        'jsx', 
        'tsx', 
        'markdown', 
        'mdx',
        'sql',
        'asm'
      ], 
    });

    monaco.languages.register({ id: 'typescript' })
    monaco.languages.register({ id: 'javascript' })
    monaco.languages.register({ id: 'html' })
    monaco.languages.register({ id: 'css' })
    monaco.languages.register({ id: 'python' })
    monaco.languages.register({ id: 'cobol' })
    monaco.languages.register({ id: 'jsx' })
    monaco.languages.register({ id: 'tsx' })
    monaco.languages.register({ id: 'markdown' })
    monaco.languages.register({ id: 'mdx' })
    monaco.languages.register({ id: 'sql' })
    monaco.languages.register({ id: 'asm' })

    shikiToMonaco(highlighter, monaco)


    editorRef.current = editor; // Assign the editor instance to the ref

    // Set the editor to focus immediately
    editor.focus();

    // Example of setting editor options
    editor.updateOptions({ wordWrap: 'on', minimap: { enabled: false } });    

    editor.onDidChangeModelContent((event) => {      
      saveContent()
    });

    // Restore cursor position if available
    const savedPosition = getSavedCursorPosition();
    if (savedPosition) {
      editor.setPosition(savedPosition);
      editor.revealPositionInCenter(savedPosition);
    }
  
    // Register an event listener for cursor position changes
    editor.onDidChangeCursorPosition(() => {
      saveCursorPosition(editor);
    });

    //  Create a decorations collection
    const decorations = editor.createDecorationsCollection();
    
    // Add a decoration to the collection
    decorations.clear(); // Clear any existing decorations in the collection
    decorations.set([{
      range: new monaco.Range(1, 1, 1, 1),
      options: { isWholeLine: true, className: 'myLineDecoration' },
    }]);

  };

  const headerOffsetClass = "mt-0"; 

  return (
    <div className={`${headerOffsetClass} overflow-hidden `} >       
        <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="const message = `Visit https://github.com/altitude80ai/Welcome for docs`"
        language={language}
        value={fileContent}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        />      
    </div>
  );
  
};



"use client";
import { createContext, useContext, useState, useEffect, useCallback, FunctionComponent, ReactNode } from 'react';
import { MetaFileData } from '@/components/nav/DocTreeComponent';

// Define the folder templates
const folderTemplates = [
  { name: "repo", collection: "meta", db: "migrate" },
  { name: "dashboard", collection: "dashboards", db: "migrate" },
  { name: "insights", collection: "insights", db: "migrate" },
  { name: "rules", collection: "rules", db: "migrate" },
  { name: "data", collection: "datamaps", db: "migrate" },
  { name: "stories", collection: "stories", db: "migrate" },
  { name: "tests", collection: "tests", db: "migrate" },
  { name: "notes", collection: "notes", db: "migrate" },
  { name: "out of scope", collection: "outOfScope", db: "migrate" },
  { name: "pinned", collection: "pinned", db: "migrate" },
  { name: "prompts", collection: "prompts", db: "migrate" },
  { name: "trash", collection: "trash", db: "migrate" },
];


// MetaFileData mock template for generating mock data
const createMockMetaFileData = (folder: string): MetaFileData[] => {
  return [
    {
      _id: `${folder}-file-1`,
      id: `${folder}/file-1`,
      sha: 'abc123',
      path: `${folder}/file-1`,
      name: `File 1 in ${folder}`,
      html_url: null,
      type: 'file',
      label: `File 1`,
      artifactType: 'meta',
      isDeleted: false,
      createdOn: new Date(),
      updatedOn: new Date(),
      approvedOn: null,
      createdBy: 'User1',
      updatedBy: 'User1',
      approvedBy: null,
      size: 1200,
      extension: 'txt',
      description: `This is a mock file in ${folder}`,
      tags: ['mock'],
      isPinned: false,
      children: [],
    },
    {
      _id: `${folder}-file-2`,
      id: `${folder}/file-2`,
      sha: 'def456',
      path: `${folder}/file-2`,
      name: `File 2 in ${folder}`,
      html_url: null,
      type: 'file',
      label: `File 2`,
      artifactType: 'meta',
      isDeleted: false,
      createdOn: new Date(),
      updatedOn: new Date(),
      approvedOn: null,
      createdBy: 'User1',
      updatedBy: 'User1',
      approvedBy: null,
      size: 1300,
      extension: 'pdf',
      description: `This is another mock file in ${folder}`,
      tags: ['mock'],
      isPinned: false,
      children: [],
    },
  ];
};



interface MetaDataProviderProps {
  children: ReactNode;
}

type MetaDataContextType = {
  metaData: MetaFileData[];
  dbDetails: dbDetails;
  fileTreeItemSelected: FileTreeItemSelected;
  artifactItemSelected: string;
  error: string | null;
  isRightClicked: boolean;
  updateItems: (items: MetaFileData[]) => void;
  updateDbDetails: (details: Partial<dbDetails>) => void;
  updateFileTreeItemSelected: (data: FileTreeItemSelected) => void;
  updateArtifactItemSelected: (artifact: string) => void;
  updateIsRightClicked: (isRightClicked: boolean) => void;
};

type dbDetails = {
  db: string;
  collection: string;
  connection?: string; 
};

// item in the FileTree selected by user
export type FileTreeItemSelected = {
  itemIndex: string;
  itemName: string;
  itemId: string;
  itemLabel: string;
  itemType: string;
};

// MetaDataContext with initial undefined value
export const MetaDataContext = createContext<MetaDataContextType | undefined>(undefined);

// Hook to use MetaDataContext
export const useMetaData = (): MetaDataContextType => {
  const context = useContext(MetaDataContext);
  if (!context) {
    throw new Error('useMetaData must be used within a MetaDataProvider');
  }
  return context;
};

/////////////////////////////////////////////////////
// Function to build the document tree structure  //
///////////////////////////////////////////////////
const buildMetaTreeStructure = (items: MetaFileData[]): MetaFileData[] => {
    const root: MetaFileData[] = [];
    const pathMap: Record<string, MetaFileData> = {};
  
    items.forEach((item) => {
      const segments = item.path.split('/');
      const name = segments.pop() || "";
      const path = segments.join('/');
  
      // Create a node with all the properties from MetaFileData
      const node: MetaFileData = {
        ...item, // Pass through all the data from MetaFileData
        id: item.path, // Set id to item.path
        name: name,
        children: [], // Initialize children array
      };
  
      if (item.type === 'tree' || item.type === 'folder') {
        node.children = [];
      }
  
      if (path === '') {
        root.push(node); // Add to root if no parent path
      } else {
        const parent = pathMap[path];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node); // Add the node to its parent
        }
      }
  
      pathMap[item.path] = node; // Add node to pathMap
    });
  
    const sortNodes = (nodes: MetaFileData[]): MetaFileData[] => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          node.children = sortNodes(node.children); // Recursively sort children
        }
      });
  
      return nodes.sort((a, b) => {
        // Folders should be sorted before files
        if (a.type === 'tree' && b.type !== 'tree') return -1;
        if (a.type !== 'tree' && b.type === 'tree') return 1;
  
        // Sort alphabetically if both are the same type
        return a.name.localeCompare(b.name);
      });
    };
  
    return sortNodes(root); // Return the sorted tree structure
  };
  

// MetaDataProvider component
export const MetaDataProvider: FunctionComponent<MetaDataProviderProps> = ({ children }) => {
  const [metaData, setMetaData] = useState<MetaFileData[]>([]);
  const [dbDetails, setDbDetails] = useState<dbDetails>({
    db: 'migrate',
    collection: 'meta'    
  });

  const [fileTreeItemSelected, setFileTreeItemSelected] = useState<FileTreeItemSelected>({
    itemIndex: "",
    itemName: "",
    itemId: "",
    itemLabel: "",
    itemType: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [isRightClicked, setIsRightClicked] = useState<boolean>(false);
  const [artifactItemSelected, setArtifactItemSelected] = useState<string>('');

  const updateItems = useCallback((items: MetaFileData[]) => {
    setMetaData(items);
  }, []);

  const updateDbDetails = useCallback((details: Partial<dbDetails>) => {
    setDbDetails(prevDetails => ({ ...prevDetails, ...details }));
    localStorage.setItem('dbDetails', JSON.stringify(details));
  }, []);

  const updateFileTreeItemSelected = useCallback((data: FileTreeItemSelected) => {
    setFileTreeItemSelected(data);
  }, []);

  const updateIsRightClicked = useCallback((isRightClicked: boolean) => {
    setIsRightClicked(isRightClicked);
  }, []);

  const updateArtifactItemSelected = useCallback((artifactItemSelected: string) => {
    setArtifactItemSelected(artifactItemSelected);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  ////////////////////////////////////////////
  // Fetch data from MongoDB via an API   ////
  ////////////////////////////////////////////
  useEffect(() => {
    const fetchMetaData = async () => {
        try {
          const response = await fetch('/api/fetchmetadata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dbDetails, // Pass db + collection object as the body
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
      
          let data = await response.json();

          /////////////////////////////////////////////
          // Step 1: Modify each path with 'repo/'
          /////////////////////////////////////////////
          data = data.map((item: MetaFileData) => ({
            ...item,
            path: `repo/${item.path}`, // Prepend 'repo/' to the path
          }));

          /////////////////////////////////////////////
          // Step 2: Create root folders for each template
          /////////////////////////////////////////////
          let rootFolders: MetaFileData[] = folderTemplates.map(folder => ({
            _id: `${folder.name}-root`,
            id: `${folder.name}`,
            sha: '', // Placeholder value, since root folders likely don’t have a sha
            path: `${folder.name}`, // Root path for this folder
            name: folder.name, // Folder name
            html_url: null, // No HTML URL for root folders
            type: 'folder', // Mark as a folder
            label: folder.name, // Label for display
            artifactType: 'meta',
            isDeleted: false,
            createdOn: new Date(),
            updatedOn: new Date(),
            approvedOn: null,
            createdBy: 'System',
            updatedBy: 'System',
            approvedBy: null,
            size: null, // No size for the root folder
            extension: null, // No extension for folders
            description: `Root folder for ${folder.name}`,
            tags: [],
            isPinned: false,
            children: [], // Initialize as empty; will be populated by child files/folders
          }));

          /////////////////////////////////////////////
          // Step 3: Create mock data for all folders
          /////////////////////////////////////////////
          let allFoldersData: MetaFileData[] = [];

          folderTemplates.forEach(folder => {
            const mockData = createMockMetaFileData(folder.name);
            allFoldersData = [...allFoldersData, ...mockData];
          });

          /////////////////////////////////////////////
          // Step 4: Merge root folders, real data, and mock data
          /////////////////////////////////////////////
          const mergedData = [...rootFolders, ...data, ...allFoldersData];

          ///////////////////////////////////////////////////////
          // Step 5: Pass merged data to buildMetaTreeStructure//
          //////////////////////////////////////////////////////
          const metaStructure = buildMetaTreeStructure(mergedData);
          console.log(metaStructure);

          updateItems(metaStructure);
          clearError();
        } catch (error: any) {
          setError(`Error retrieving metadata: ${error.message}`);
        }
    };

    fetchMetaData();
}, [updateItems, clearError]);



  const contextValue: MetaDataContextType = {
    metaData,
    dbDetails,
    fileTreeItemSelected,
    artifactItemSelected,
    error,
    isRightClicked,
    updateItems,
    updateDbDetails,
    updateFileTreeItemSelected,
    updateArtifactItemSelected,
    updateIsRightClicked,
  };

  return (
    <MetaDataContext.Provider value={contextValue}>
      {children}
    </MetaDataContext.Provider>
  );
};

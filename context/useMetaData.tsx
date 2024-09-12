"use client";
import { createContext, useContext, useState, useEffect, useCallback, FunctionComponent, ReactNode } from 'react';
import { MetaFileData } from '@/components/nav/DocTreeComponent';


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
            method: 'POST', // Set method to POST
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify({
              dbDetails, // Pass db + collection object as the body
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
      
          const data = await response.json();
          const metaStructure = buildMetaTreeStructure(data as MetaFileData[]);
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

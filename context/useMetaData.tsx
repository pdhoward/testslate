"use client";
import { createContext, useContext, useState, useEffect, useCallback, FunctionComponent, ReactNode } from 'react';


// MetaFileData type for migratedb meta data collection
export type MetaFileData = {
  _id: string;
  id: string;
  sha: string;
  path: string;
  name: string;
  html_url: string | null;
  type: 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash' | 'file' | 'tree' | 'submodule' | 'symlink' | 'blob';
  label: string;
  artifactType: 'meta' | 'docs' | 'stories' | 'notes' | 'charts' | 'tests' | 'code' | 'rules' | 'datamap';
  isDeleted: boolean;
  createdOn: Date;
  updatedOn: Date;
  approvedOn: Date | null;
  createdBy: string;
  updatedBy: string;
  approvedBy: string | null;
  size: number | null;
  extension: string | null;
  description: string | null;
  tags: string[];
  isPinned: boolean;
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

///////////////////////////////////////////////
// Function to build the document structure  //
///////////////////////////////////////////////
const buildMetaStructure = (items: MetaFileData[]): MetaFileData[] => {
  // Logic for organizing documents can go here in future refactoring
  return items; // Currently just returning items
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
          const metaStructure = buildMetaStructure(data as MetaFileData[]);
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

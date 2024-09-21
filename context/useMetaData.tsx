"use client";
import { createContext, useContext, useState, useEffect, useCallback, FunctionComponent, ReactNode } from 'react';
import { MetaFileData, DocFileData } from '@/lib/types';
import { ArtifactType } from '@/lib/types';
import { buildMetaTreeStructure } from './metafunctions';

const folderTemplates: { name: string; collection: string; db: string; artifactType: ArtifactType }[] = [
  { name: "repo", collection: "meta", db: "migrate", artifactType: "github" },
  { name: "dashboard", collection: "dashboards", db: "migrate", artifactType: "charts" },
  { name: "business process", collection: "process", db: "migrate", artifactType: "process" },
  { name: "insights", collection: "insights", db: "migrate", artifactType: "insights" },
  { name: "rules", collection: "rules", db: "migrate", artifactType: "rules" },
  { name: "data", collection: "datamaps", db: "migrate", artifactType: "data" },
  { name: "stories", collection: "stories", db: "migrate", artifactType: "stories" },
  { name: "tests", collection: "tests", db: "migrate", artifactType: "tests" },
  { name: "notes", collection: "notes", db: "migrate", artifactType: "notes" },
  { name: "out of scope", collection: "outOfScope", db: "migrate", artifactType: "scope" },
  { name: "pinned", collection: "pinned", db: "migrate", artifactType: "pinned" },
  { name: "prompts", collection: "prompts", db: "migrate", artifactType: "prompts" },
  { name: "discard", collection: "trash", db: "migrate", artifactType: "discard" },
];


// MetaFileData mock template for generating mock data
const createMockMetaFileData = (folder: string): MetaFileData[] => {
  return [
    {
      _id: `${folder}-file-1`,
      id: `${folder}/file-1`,
      sha: 'abc123',
      path: `${folder}/file-1`,
      org: 'aws',
      project: 'POC',
      application: 'awscarddemo',
      name: `File 1 in ${folder}`,
      html_url: null,
      documentType: 'file',
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
      usedInProcess: [],
      inScope: true,
      isPinned: false,
      children: [],
    },
    {
      _id: `${folder}-file-2`,
      id: `${folder}/file-2`,
      sha: 'def456',
      path: `${folder}/file-2`,
      org: 'aws',
      project: 'POC',
      application: 'awscarddemo',
      name: `File 2 in ${folder}`,
      html_url: null,
      documentType: 'file',
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
      usedInProcess: [],
      inScope: true,
      isPinned: false,
      children: [],
    },
  ];
};


interface MetaDataProviderProps {
  children: ReactNode;
}

type MetaDataContextType = {
  metaData: DocFileData[];
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

/*
export type DocFileData = TreeViewBaseItem<{
  _id: string;
  id: string;  
  org: string;
  project: string;
  application: string;
  path: string;
  name: string;
  label: string;
  documentType: string;
  artifactType: string;
} & Record<string, unknown>>;



*/

export type FileTreeItemSelected = {
  item_id: string; // mongodb _id 
  itemOrg: string;
  itemProject: string;
  itemApplication: string;
  itemPath: string;    
  itemName: string;
  itemId: string;
  itemLabel: string;
  itemDocumentType: string;
  itemArtifactType: string;
};

export const MetaDataContext = createContext<MetaDataContextType | undefined>(undefined);

export const useMetaData = (): MetaDataContextType => {
  const context = useContext(MetaDataContext);
  if (!context) {
    throw new Error('useMetaData must be used within a MetaDataProvider');
  }
  return context;
};

export const MetaDataProvider: FunctionComponent<MetaDataProviderProps> = ({ children }) => {
  const [metaData, setMetaData] = useState<DocFileData[]>([]);
  const [dbDetails, setDbDetails] = useState<dbDetails>({
    db: 'migrate',
    collection: 'meta'    
  });
  const [fileTreeItemSelected, setFileTreeItemSelected] = useState<FileTreeItemSelected>({
    item_id: "", 
    itemOrg: "",
    itemProject: "",
    itemApplication: "",
    itemPath: "",    
    itemName: "",
    itemId: "",
    itemLabel: "",
    itemDocumentType: "",
    itemArtifactType:"",
  });
  const [error, setError] = useState<string | null>(null);
  const [isRightClicked, setIsRightClicked] = useState<boolean>(false);
  const [artifactItemSelected, setArtifactItemSelected] = useState<string>('');

  const updateItems = useCallback((items: DocFileData[]) => {
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

  //////////////////////////////////////////////////////////
  // useEffect to map through folder config & fetch data //
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        let mergedData: DocFileData[] = [];
  
        for (const folder of folderTemplates) {
          let folderData: DocFileData[] = [];
  
          switch (folder.name) {
            case 'rules': {
              const response = await fetch('/api/fetchartifacts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  dbName: folder.db,
                  collection: folder.collection,
                }),
              });
  
              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
              }
  
              let stageFolderData = await response.json();
              folderData = stageFolderData.map((item: any) => ({
                ...item,
                path: `rules/${item.path}`, // Prepend "rules/" to the path
              }));
              break;
            }
            case 'repo': {
              const response = await fetch('/api/fetchmetadata', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  dbName: folder.db,
                  collection: folder.collection,
                }),
              });
  
              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
              }
  
              folderData = await response.json();
              folderData = folderData.map((item: DocFileData) => ({
                ...item,
                path: `repo/${item.path}`, // Prepend "repo/" to the path
              }));
              break;
            }
            default: {
              // Generate mock data for other folders
              folderData = createMockMetaFileData(folder.name);
              break;
            }
          }
  
          // Add root folder for this template
          mergedData = [...mergedData, ...folderData];
        }
        console.log(`-------------debug file tree-------------`)
        console.log(mergedData)
  
        const metaStructure = buildMetaTreeStructure(mergedData);

        console.log(metaStructure)
  
        // Sort root folders by folderTemplates order
        const sortedMetaStructure = metaStructure.sort((a, b) => {
          const indexA = folderTemplates.findIndex(folder => folder.name === a.name);
          const indexB = folderTemplates.findIndex(folder => folder.name === b.name);
          return indexA - indexB;
        });
        console.log(sortedMetaStructure)
        updateItems(sortedMetaStructure);
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

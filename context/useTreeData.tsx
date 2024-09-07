"use client"
import { createContext, useContext, useState, useEffect, useCallback, FunctionComponent, ReactNode } from 'react';
import { Octokit } from "@octokit/rest";
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import { GithubData } from '@/components/nav/FileTreeComponent';

interface TreeDataProviderProps {
  children: ReactNode;
}

type TreeDataContextType = {
  treeData: GithubData[];
  repoDetails: RepoDetails;
  fileTreeItemSelected: FileTreeItemSelected; 
  artifactItemSelected: string;
  error: string | null;
  isRightClicked: boolean;
  updateItems: (items: GithubData[]) => void;
  updateRepoDetails: (details: Partial<RepoDetails>) => void;
  updateFileTreeItemSelected: (data: FileTreeItemSelected) => void;
  updateArtifactItemSelected: (artifact: string) => void;
  updateIsRightClicked: (isRightClicked: boolean) => void;
};

export type GitHubFileData = {
  sha: string;
  path: string;
  name: string;
  html_url: string | null;
  type: "tree" | "file" | "submodule" | "symlink";
};

type RepoDetails = {
  owner: string;
  repo: string;
  branch: string;
  content?: string;
};

// item in the FileTree selected by user
export type FileTreeItemSelected = {
  itemIndex: string;  // set to sha from github
  itemName: string;   // name of item .. ie cpy (directory) or cocom01y.cpy
  itemId: string;     // path to item
  itemLabel: string;  // full github http path to item  
  itemType: string;   // file, blob, tree, etc
};

export type TreeNodeType = TreeViewBaseItem & {
  children?: TreeNodeType[];
};

export const TreeDataContext = createContext<TreeDataContextType | undefined>(undefined);

export const useTreeData = (): TreeDataContextType => {
  const context = useContext(TreeDataContext);
  if (!context) {
    throw new Error('useTreeData must be used within a TreeDataProvider');
  }
  return context;
};

///////////////////////////////////////////////
////   this function maps github repo to   ///
///   structured expected by mui for tree  //
/////////////////////////////////////////////

// note that path is picked for the unique id because 
// sha is not unique given the presence of speciality directories
// like .github

const buildTreeStructure = (items: GitHubFileData[]): GithubData[] => {
  const root: GithubData[] = [];
  const pathMap: Record<string, GithubData> = {};

  items.forEach((item) => {
    const segments = item.path.split('/');
    const name = segments.pop() || "";
    const path = segments.join('/');
    const node: GithubData = {
      id: item.path,
      name: name,
      label: item.html_url || '',
      sha: item.sha,
      type: item.type, 
      children: [],
    };

    if (item.type === 'tree') {
      node.children = [];
    }

    if (path === '') {
      root.push(node);
    } else {
      const parent = pathMap[path];
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    }

    pathMap[item.path] = node;
  });

  const sortNodes = (nodes: GithubData[]): GithubData[] => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        node.children = sortNodes(node.children);
      }
    });
  
    return nodes.sort((a, b) => {
      // Folders should be sorted before files
      if (a.type === 'tree' && b.type !== 'tree') return -1; // a is a folder, b is not
      if (a.type !== 'tree' && b.type === 'tree') return 1;  // a is not a folder, b is
  
      // If both are of the same type, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  return sortNodes(root);
};

export const TreeDataProvider: FunctionComponent<TreeDataProviderProps> = ({ children }) => {
  const [treeData, setTreeData] = useState<GithubData[]>([]);
  const [repoDetails, setRepoDetails] = useState<RepoDetails>({
    owner: 'pdhoward',
    repo: 'proximity',
    branch: 'master',
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

  const updateItems = useCallback((items: GithubData[]) => {
    setTreeData(items);
  }, []);

  const updateRepoDetails = useCallback((details: Partial<RepoDetails>) => {
    setRepoDetails(prevDetails => ({ ...prevDetails, ...details }));
    localStorage.setItem('repoDetails', JSON.stringify(details));
  }, []);

  const updateFileTreeItemSelected = useCallback((data: FileTreeItemSelected) => {
    setFileTreeItemSelected(data);
  }, []);

  // controls the popup context menu for exploring ai docs attached to code
  const updateIsRightClicked = useCallback((isRightClicked: boolean) => {
    setIsRightClicked(isRightClicked);
  }, []);

  // controls the artifact context menu for fetching docs selected in the editor
  const updateArtifactItemSelected = useCallback((artifactItemSelected: string) => {
    setArtifactItemSelected(artifactItemSelected);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const octokit = new Octokit();

  ////////////////////////////////////////////
  // save last repo used in the editor   ////
  //////////////////////////////////////////

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRepoDetails = localStorage.getItem('repoDetails');
      if (savedRepoDetails) {
        setRepoDetails(JSON.parse(savedRepoDetails));
      }
    }
  }, []);

  useEffect(() => {
    const fetchGitHubRepoFiles = async () => {
      try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
          owner: repoDetails.owner,
          repo: repoDetails.repo,
          tree_sha: repoDetails.branch,
          recursive: '1',
        });

        if (response && response.data && response.data.tree) {
          const data = response.data.tree.map((item: any) => ({
            sha: item.sha,
            name: item.path ? item.path.split('/').pop() || "" : "",
            path: item.path || "",
            html_url: item.url,
            type: item.type,
          })) as GitHubFileData[];

          const treeStructure = buildTreeStructure(data);
          updateItems(treeStructure);
          clearError();          
        }
      } catch (error: any) {
        setError(`Attempted to retrieve repository using ${repoDetails.owner}, ${repoDetails.repo} & ${repoDetails.branch}: ${error.message}`);
      }
    };

    fetchGitHubRepoFiles();
  }, [updateItems, repoDetails, clearError]);

  const contextValue: TreeDataContextType = {
    treeData,
    repoDetails,
    fileTreeItemSelected,
    artifactItemSelected,
    error,
    isRightClicked,
    updateItems,
    updateRepoDetails,
    updateFileTreeItemSelected,
    updateArtifactItemSelected,
    updateIsRightClicked
  };

  return (
    <TreeDataContext.Provider value={contextValue}>
      {children}
    </TreeDataContext.Provider>
  );
};

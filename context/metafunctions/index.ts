import { MetaFileData, DocFileData } from '@/lib/types';
import { ArtifactType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

/////////////////////////////////////////////////////
// Function to build the document tree structure  //
///////////////////////////////////////////////////


export const buildMetaTreeStructure = (items: DocFileData[]): DocFileData[] => {
  const root: DocFileData[] = [];
  const pathMap: Record<string, DocFileData> = {};

  items.forEach((item) => {
    const segments = item.path.split('/');
    const name = segments.pop() || "";
    const path = segments.join('/');

    // Create a node for each item
    const node: DocFileData = {
      ...item,
      id: uuidv4(), // create a unique id for MUI Filetree processing
      name: name,
      children: [],
    };

    // Check the artifactType to determine how to handle different data types
    switch (item.artifactType) {
      case 'github': {
        // Handle GitHub artifacts: tree, folder, blob, etc.
        if (['tree', 'folder'].includes(item.documentType)) {
          node.children = [];
        }
        break;
      }

      case 'rules':
      case 'data':
      case 'tests': {
        // Handle rules, data, tests, or any text-based artifacts
        // We treat the document type "text" as file with nested folders
        const parentPath = segments.join('/');

        // If no parent path, push to root
        if (path === '') {
          root.push(node);
        } else {
          // If parent doesn't exist, create a placeholder folder structure
          if (!pathMap[parentPath]) {
            const parentSegments = parentPath.split('/');
            parentSegments.reduce((acc, folderName, index) => {
              const currentPath = parentSegments.slice(0, index + 1).join('/');
              if (!pathMap[currentPath]) {
                const parentNode: DocFileData = {                
                  id: uuidv4(),   // Unique ID for the node
                  org: '', // Placeholder for organizational information
                  project: '', // Placeholder for project name
                  application: '', // Placeholder for application name
                  name: folderName,
                  path: currentPath,
                  label: 'Folder', // Set a default label like 'Folder'
                  documentType: 'folder',
                  artifactType: item.artifactType, // Inherit artifactType from the item
                  children: [],
                };
                pathMap[currentPath] = parentNode;
            
                const grandParentPath = parentSegments.slice(0, index).join('/');
                if (grandParentPath === '') {
                  root.push(parentNode); // Root-level folder
                } else if (pathMap[grandParentPath]) {
                  // Ensure the grandparent exists before pushing
                  pathMap[grandParentPath].children = pathMap[grandParentPath].children || [];
                  pathMap[grandParentPath].children.push(parentNode);
                }
              }
              return pathMap[currentPath];
            }, {});
          }

          // Add the current item to its parent folder
          const parent = pathMap[parentPath];
          parent.children = parent.children || [];
          parent.children.push(node);
        }
        break;
      }

      default: {
        // Default handling for other artifact types, if needed
        // We can expand this in the future for new types
        break;
      }
    }

    // Add the node to the pathMap
    pathMap[item.path] = node;
  });

  // Sorting function
  const sortNodes = (nodes: DocFileData[]): DocFileData[] => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        node.children = sortNodes(node.children); // Recursively sort children
      }
    });

    return nodes.sort((a, b) => {
      // Folders should be sorted before files
      if (a.documentType === 'tree' && b.documentType !== 'tree') return -1;
      if (a.documentType !== 'tree' && b.documentType === 'tree') return 1;

      // Sort alphabetically if both are the same type
      return a.name.localeCompare(b.name);
    });
  };

  return sortNodes(root); // Return the sorted tree structure
};

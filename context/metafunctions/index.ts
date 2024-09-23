import { DocFileData } from '@/lib/types';
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
      children: [], // Initialize children array
    };

    // Normalize GitHub folders (tree) to 'folder'
    if (item.artifactType === 'github' && item.documentType === 'tree') {
      node.documentType = 'folder';
    }

    // Check the artifactType to determine how to handle different data types
    switch (item.artifactType) {
      case 'github': {
        // Handle GitHub artifacts: tree, folder, blob, etc.

        // We need to ensure the parent folder (like 'repo') is created for GitHub artifacts
        if (path !== '') {
          if (!pathMap[path]) {
            // If parent folder doesn't exist, create it
            const parentSegments = path.split('/');
            parentSegments.reduce((acc, folderName, index) => {
              const currentPath = parentSegments.slice(0, index + 1).join('/');
              if (!pathMap[currentPath]) {
                const parentNode: DocFileData = {
                  id: uuidv4(),
                  org: item.org,
                  project: item.project,
                  application: item.application,
                  name: folderName,
                  path: currentPath,
                  label: 'Folder', // Default to folder label
                  documentType: 'folder',
                  artifactType: item.artifactType,
                  children: [],
                };
                pathMap[currentPath] = parentNode;

                const grandParentPath = parentSegments.slice(0, index).join('/');
                if (grandParentPath === '') {
                  root.push(parentNode); // Root-level folder
                } else if (pathMap[grandParentPath]) {
                  pathMap[grandParentPath].children = pathMap[grandParentPath].children || [];
                  pathMap[grandParentPath].children.push(parentNode);
                }
              }
              return pathMap[currentPath];
            }, {});
          }
        }

        // Add the GitHub node to its parent or root if no parent
        if (path === '') {
          root.push(node); // Add to root if no parent path for GitHub artifact
        } else {
          const parent = pathMap[path];
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(node); // Add the GitHub node to its parent
          }
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
        break;
      }
    }

    // Add the node to the pathMap, ensuring no replacement happens
    if (!pathMap[item.path]) {
      pathMap[item.path] = node;
    } else {
      // Handle the case where the path already exists (append to the existing node)
      const existingNode = pathMap[item.path];
      existingNode.children = existingNode.children || [];
      existingNode.children.push(...(node.children || [])); // Merge children if necessary
    }
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
      if (a.documentType === 'folder' && b.documentType !== 'folder') return -1;
      if (a.documentType !== 'folder' && b.documentType === 'folder') return 1;

      // Sort alphabetically if both are the same type
      return a.name.localeCompare(b.name);
    });
  };

  return sortNodes(root); // Return the sorted tree structure
};

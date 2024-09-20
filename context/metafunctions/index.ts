import { MetaFileData } from '@/lib/types';
import { ArtifactType } from '@/lib/types';


/////////////////////////////////////////////////////
// Function to build the document tree structure  //
///////////////////////////////////////////////////
export const buildMetaTreeStructure = (items: MetaFileData[]): MetaFileData[] => {
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
  
      if (item.documentType === 'tree' || item.documentType === 'folder') {
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
        if (a.documentType === 'tree' && b.documentType !== 'tree') return -1;
        if (a.documentType !== 'tree' && b.documentType === 'tree') return 1;
  
        // Sort alphabetically if both are the same type
        return a.name.localeCompare(b.name);
      });
    };
  
    return sortNodes(root); // Return the sorted tree structure
  };
  


### TestSlate

A strategic machines side project to test the boundaries of slate for serving as a content and knowledge manager foundation in the AI environment

-------

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Company',
        children: [
          { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
          { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
          { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
          { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
          { id: '1.1.5', label: 'Video conference', fileType: 'video' },
        ],
      },
      { id: '1.2', label: 'Personal', fileType: 'folder' },
      { id: '1.3', label: 'Group photo', fileType: 'image' },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    fileType: 'pinned',
    children: [
      { id: '2.1', label: 'Learning materials', fileType: 'folder' },
      { id: '2.2', label: 'News', fileType: 'folder' },
      { id: '2.3', label: 'Forums', fileType: 'folder' },
      { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
    ],
  },
  { id: '3', label: 'History', fileType: 'folder' },
  { id: '4', label: 'Trash', fileType: 'trash' },
];

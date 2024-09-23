import React, { useState } from 'react';
import GroupRulesCard from './GroupRulesCard';
import DetailedRulesCard from './DetailedRulesCard'
import SourceCard from './SourceCard'
import { useMetaData, FileTreeItemSelected } from '@/context/useMetaData';
import { RuleFileData, DocFileData } from '@/lib/types';
import VisibilityIcon from '@mui/icons-material/Visibility'

type GroupedData = {
  [key: string]: RuleFileData[]; // Grouping by name
};


function filterMetaData(metaData: DocFileData[]): RuleFileData[] {
  const result: RuleFileData[] = [];

  function recursiveFilter(data: DocFileData[]): void {
    data.forEach((item: any) => {
      // Check if the current item matches the conditions
      if (
        item.artifactType === "rules" &&
        (item.documentType === "text" )
      ) {
        result.push(item);
      }
      // If there are children, recursively check them
      if (item.children && item.children.length > 0) {
        recursiveFilter(item.children);
      }
    });
  }

  recursiveFilter(metaData);
  return result;
}

function groupByName(data: RuleFileData[]): GroupedData {
  return data.reduce((acc: GroupedData, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {});
}

const RulesGrid: React.FC = () => {
  const { metaData } = useMetaData();
  const [viewDetails, setViewDetails] = useState<string | null>(null); // State to track detailed view
  const [selectedName, setSelectedName] = useState<string | null>(null); // For progressive discovery
  const [selectedRule, setSelectedRule] = useState<RuleFileData | null>(null); // For dialog state
  // Filter the metaData for rules and text documentType
  const filteredData = filterMetaData(metaData);

   // Group objects by name
   const groupedData = groupByName(filteredData);  

  // Handle "Show More" and "Back" buttons
 // Handle "Show More" (switch to detail view)
  const handleShowMore = (name: string) => {
    setViewDetails(name);
  };

  // Handle Back (switch to grouped view)
  const handleBack = () => {
    setViewDetails(null);
  };
   // Handle opening dialog
   const handleOpenDialog = (rule: RuleFileData) => {
    setSelectedRule(rule);
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setSelectedRule(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:text-gray-300 p-4">
      {viewDetails ? (
        // Detailed View for a specific group
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleBack}
          >
            Back
          </button>
          <h3 className="text-xs font-semibold text-white dark:text-gray-100">{viewDetails}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          
            {groupedData[viewDetails]?.map((item) => (
               <div key={item.id} className="relative">
              <DetailedRulesCard
                key={item.id}
                name={item.name}
                sequence={item.sequence}
                createdOn={item.createdOn}
                updatedOn={item.updatedOn}
                updatedBy={item.updatedBy}
                description={item.description}
              />
               <button
                  className="absolute bottom-2 right-2 text-white p-1 rounded-full"
                  onClick={() => handleOpenDialog(item)} // Open dialog when clicked
                >
                  <VisibilityIcon className="text-blue-500" style={{ fontSize: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Grouped View
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.keys(groupedData).map((name) => {
            const firstItem = groupedData[name][0];
            return (
              <div key={firstItem.id} className="relative">
                <GroupRulesCard
                  name={firstItem.name}
                  createdOn={firstItem.createdOn}
                  updatedOn={firstItem.updatedOn}
                  description={firstItem.description}
                />
                 <button
                  className="absolute bottom-2 right-2"
                  onClick={() => handleShowMore(name)}
                >
                  <VisibilityIcon className="text-blue-500" style={{ fontSize: '16px' }} /> {/* Blue icon with smaller size */}
                </button>
              </div>
            );
          })}
            {/* Render the RuleDialog component */}
          {selectedRule && (
            <SourceCard open={!!selectedRule} onClose={handleCloseDialog} rule={selectedRule} />
          )}
        </div>
      )}
    </div>
  );
};

export default RulesGrid;

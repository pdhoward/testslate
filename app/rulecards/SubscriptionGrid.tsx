import React, { useState } from 'react';
import SubscriptionCard from './SubscriptionCard';
import { useMetaData, FileTreeItemSelected } from '@/context/useMetaData';
import { RuleFileData, DocFileData } from '@/lib/types';

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

const SubscriptionGrid: React.FC = () => {
  const { metaData } = useMetaData();
  const [viewDetails, setViewDetails] = useState<string | null>(null); // State to track detailed view
  const [selectedName, setSelectedName] = useState<string | null>(null); // For progressive discovery

  // Filter the metaData for rules and text documentType
  const filteredData = filterMetaData(metaData);
  
  // Group objects by name
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as Record<string, RuleFileData[]>);

  // Handle "Show More" and "Back" buttons
  const handleShowMore = (name: string) => {
    setSelectedName(name);
  };

  const handleBack = () => {
    setSelectedName(null);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedData[viewDetails]?.map((item) => (
              <SubscriptionCard
                key={item.id}
                name={item.name}
                createdOn={item.createdOn}
                updatedOn={item.updatedOn}
                description={item.description}
              />
            ))}
          </div>
        </div>
      ) : (
        // Grouped View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Object.keys(groupedData).map((name) => {
            const firstItem = groupedData[name][0];
            return (
              <div key={firstItem.id} className="relative">
                <SubscriptionCard
                  name={firstItem.name}
                  createdOn={firstItem.createdOn}
                  updatedOn={firstItem.updatedOn}
                  description={firstItem.description}
                />
                <button
                  className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => setViewDetails(name)}
                >
                  Show More
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionGrid;

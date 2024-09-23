import React from 'react';

type RulesCardProps = {
  name: string;
  createdOn: string;
  updatedOn: string;
  updatedBy: string;
  sequence: string;
  description: string;
  showBackButton?: boolean; // Optional prop to show back button
  onBackClick?: () => void; // Callback for back button
};

const DetailedRulesCard: React.FC<RulesCardProps> = ({
  name,
  createdOn,
  updatedOn,
  updatedBy,
  sequence,
  description,
  showBackButton = false, // Default to false
  onBackClick,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm p-2 w-40 text-xs transition-all duration-300">
          
      {/* Card Content */}
      <div className="text-gray-500 dark:text-gray-400">             
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Last updated:</span>
          <span className="text-black dark:text-white">{updatedOn}</span>
        </p>
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Updated by:</span>
          <span className="text-black dark:text-white">{updatedBy}</span>
        </p>
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Rule Sequence:</span>
          <span className="text-black dark:text-white">{sequence}</span>
        </p>
       
      </div>
    </div>
  );
};

export default DetailedRulesCard;



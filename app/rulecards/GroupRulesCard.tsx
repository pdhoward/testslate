import React from 'react';

type SubscriptionCardProps = {
  name: string;
  createdOn: string;
  updatedOn: string;
  description: string;
  showBackButton?: boolean; // Optional prop to show back button
  onBackClick?: () => void; // Callback for back button
};

const GroupRulesCard: React.FC<SubscriptionCardProps> = ({
  name,
  createdOn,
  updatedOn,
  description,
  showBackButton = false, // Default to false
  onBackClick,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm p-2 w-40 text-xs transition-all duration-300">
      {/* Header with Back Button */}
      {showBackButton && (
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={onBackClick}
            className="text-xs text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
        </div>
      )}
      
      {/* Card Content */}
      <div className="text-gray-500 dark:text-gray-400">
        <p className="flex items-center mb-1 text-[10px]">          
          <span className="text-blue-500 font-bold dark:text-white">{name}</span>
        </p>
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Created:</span>
          <span className="text-black dark:text-white">{createdOn}</span>
        </p>
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Updated:</span>
          <span className="text-black dark:text-white">{updatedOn}</span>
        </p>
        <p className="text-[10px] mb-1">
          <span className="mr-1">Description:</span>
        </p>
        <p className="ml-4 text-black dark:text-white text-[10px]">
         {description}
        </p>
      </div>
    </div>
  );
};

export default GroupRulesCard;



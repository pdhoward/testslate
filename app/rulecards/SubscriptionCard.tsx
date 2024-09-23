import React from 'react';

type SubscriptionCardProps = {
  name: string;
  createdOn: string;
  updatedOn: string;
  description: string;
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  createdOn,
  updatedOn,
  description,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-300 rounded-md shadow-sm p-2 w-40 text-xs transition-all duration-300">
      <div className="flex items-center mb-1">
        <div className="bg-green-500 rounded-full h-4 w-4 mr-1">
          {/* You can replace this with a proper icon */}
          <img src="/spotify-icon.png" alt={name} className="h-full w-full rounded-full" />
        </div>
        <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Created:</span>
          <span className="text-black dark:text-white">{createdOn}</span>
        </p>
        <p className="flex items-center mb-1 text-[10px]">
          <span className="mr-1">Updated:</span>
          <span className="text-black dark:text-white">{updatedOn}</span>
        </p>
        <p className="flex items-center text-[10px]">
          <span className="mr-1">Source:</span>
          <span className="text-black dark:text-white">{description}</span>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;



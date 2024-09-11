import { FiBarChart } from 'react-icons/fi'; // Import statistics icon from Feather icons
import clsx from 'clsx';
import React from 'react';

type Props = { selected: boolean };

const AnalyticsIcon = ({ selected }: Props) => {
  return (
    <div
      className={clsx(
        'group h-10 w-10 flex items-center justify-center rounded-lg p-2 transition-all', // Add hover and group class here
        {
          'bg-[#7540A9]': selected, // Purple background when selected
          'group-hover:bg-[#7540A9]': !selected, // Purple background on hover
        }
      )}
    >
      <FiBarChart
        size={24}
        className={clsx(
          'transition-all dark:fill-[#353346] fill-[#BABABB] group-hover:fill-[#353346]', // Icon remains black on hover
          { 'dark:!fill-[#353346] fill-[#353346]': selected } // Stays black when selected
        )}
      />
    </div>
  );
};

export default AnalyticsIcon;

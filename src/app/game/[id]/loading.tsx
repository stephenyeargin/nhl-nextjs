import React from 'react';

export default function LoadingGamePage() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-sm" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded-sm" />
      <div className="h-64 w-full bg-gray-200 dark:bg-gray-600 rounded-sm" />
    </div>
  );
}

import React from 'react';
import { Story } from '../../types';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format content with line breaks
  const formattedContent = story.content.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={story.avatarUrl} 
            alt={story.author} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" 
          />
          <div className="ml-4">
            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">{story.author}</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{formatDate(story.date)}</p>
          </div>
        </div>
        
        <h2 className="text-xl font-display font-bold mb-4 text-neutral-800 dark:text-neutral-100">
          {story.title}
        </h2>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {formattedContent}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
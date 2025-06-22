import React from 'react';
import { Comment } from '../../types';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  // Format date to display in a readable format (e.g., "October 15, 2023")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 transition-transform hover:translate-y-[-2px] duration-300">
      <div className="flex items-start">
        <img
          src={comment.avatarUrl}
          alt={comment.author}
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-neutral-800 dark:text-white">{comment.author}</h4>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(comment.date)}</span>
          </div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
import React, { useState } from 'react';
import { X, MessageSquare, Globe, FileText } from 'lucide-react';
import { ForumCategory } from '../../lib/supabase';
import { useForum } from '../../hooks/useForum';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ForumCategory[];
  onTopicCreated: () => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  categories,
  onTopicCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { createTopic } = useForum();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await createTopic(formData.title.trim(), formData.content.trim(), formData.categoryId);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        categoryId: ''
      });
      
      onTopicCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        content: '',
        categoryId: ''
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold font-display text-neutral-800 dark:text-neutral-100 flex items-center space-x-2">
            <MessageSquare size={24} className="text-primary-500" />
            <span>Start New Discussion</span>
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Choose Country/Category *
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                required
              >
                <option value="">Select a country or category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                    {category.description && ` - ${category.description}`}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Choose the most relevant country or general category for your discussion
            </p>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Topic Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                placeholder="What would you like to discuss?"
                required
                maxLength={200}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Be specific and descriptive to help others understand your topic
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Your Message *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Share your thoughts, questions, or experiences in detail..."
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Provide context and details to encourage meaningful discussion
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
            <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              💡 Tips for a great discussion:
            </h4>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Be specific about your situation and location</li>
              <li>• Ask clear questions to encourage responses</li>
              <li>• Share your experiences to help others</li>
              <li>• Be respectful of different approaches and opinions</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn-outline disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.categoryId}
              className={`btn-primary flex items-center space-x-2 ${
                isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.categoryId
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              <MessageSquare size={18} />
              <span>{isSubmitting ? 'Creating...' : 'Start Discussion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
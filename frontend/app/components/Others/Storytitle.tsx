import React, { useState } from 'react';
import Image from 'next/image';

interface StoryProps {
  story: {
    user: string;
    title: string;
    content: string;
    wordCount: number;
    submissionDateTime: string;
    score: number;
    corrections: string;
    contest: string;
    prompt: string;
    storyType: string;
  };
}

const Storytitle: React.FC<StoryProps> = ({ story }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getPreviewContent = (content: string, wordLimit: number) => {
    const words = content.split(' ');
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const previewContent = getPreviewContent(story.content, 50);

  return (
    <div className="w-full mx-auto border-2 border-gray-200 rounded-3xl overflow-hidden">
      {/* Card title and image */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">{story.title}</h2>
        </div>
      </div>
      <div className='w-full relative flex h-12'>
        <div className='w-8 md:w-10 h-8 md:h-10 absolute left-3 bg-slate-500 rounded-full border'>
          <Image src="" alt="" />
        </div>
        <div className='w-8 md:w-10 h-8 md:h-10 absolute left-8 bg-slate-500 rounded-full border'>
          <Image src="" alt="" />
        </div>
        <h5 className='absolute left-24 pt-2 text-xs md:text-sm lg:text-base'>Story by <span className='font-bold'>{story.user}</span></h5>
      </div>
      {/* Paragraph */}
      <div className="text-xs md:text-sm lg:text-base text-gray-900 p-4">
        {isExpanded ? story.content : previewContent}
      </div>
      {/* Read more button */}
      <div className="px-4 md:px-6 py-4 flex justify-end">
        <button 
          onClick={toggleExpand} 
          className="bg-black text-white py-2 w-24 md:w-32 lg:w-40 h-10 md:h-12 px-4 rounded-3xl"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
};

export default Storytitle;

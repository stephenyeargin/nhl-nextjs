'use client';

import { useParams } from 'next/navigation';

const TopicStory = () => {
  const { slug } = useParams();
  window.location.replace(`/news/${slug}`);
};

export default TopicStory;

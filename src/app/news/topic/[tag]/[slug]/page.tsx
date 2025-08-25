'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const TopicStory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (slug) {
      window.location.replace(`/news/${slug}`);
    }
  }, [slug]);

  return null;
};

export default TopicStory;

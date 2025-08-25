import React from 'react';
import { render, screen } from '@testing-library/react';
import StoryCard from './StoryCard';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = ({ _src, alt }: any) => <img alt={alt} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

const baseItem = { slug: 'slug', headline: 'Headline', summary: 'Summary', contentDate: '2024-01-01T00:00:00Z' };

describe('StoryCard', () => {
  it('renders default size', () => {
    render(<StoryCard item={baseItem as any} />);
    expect(screen.getByText('Headline')).toBeInTheDocument();
  });
  it('renders small size', () => {
    render(<StoryCard item={baseItem as any} size="small" />);
    expect(screen.getByText('Headline')).toBeInTheDocument();
  });
});

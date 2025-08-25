import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCard from './VideoCard';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = ({ alt }: any) => <img alt={alt} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

describe('VideoCard', () => {
  it('renders title', () => {
  const item = { slug: 'great-goal', headline: 'Great Goal', fields: { description: 'desc' }, contentDate: '2024-03-10T12:00:00Z' } as any;
  render(<VideoCard item={item} />);
    expect(screen.getByText(/great goal/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCard from './VideoCard';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = ({ alt }: any) => <img alt={alt} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

const baseItem = (overrides: any = {}) => ({
  slug: 'great-goal',
  headline: 'Great Goal',
  title: 'Great Goal',
  fields: { description: 'desc' },
  contentDate: '2024-03-10T12:00:00Z',
  summary: 'Some **markdown**',
  thumbnail: undefined,
  ...overrides,
});

describe('VideoCard', () => {
  it('renders default (no size) variant with fallback thumbnail', () => {
    const item = baseItem();
    render(<VideoCard item={item} />);
    expect(screen.getByText(/great goal/i)).toBeInTheDocument();
  });

  it('renders small variant with provided thumbnail url', () => {
    const item = baseItem({ thumbnail: { thumbnailUrl: 'thumb.jpg', templateUrl: '' } });
    render(<VideoCard item={item} size="small" />);
    expect(screen.getByText(/great goal/i)).toBeInTheDocument();
  });

  it('renders medium variant missing thumbnail', () => {
    const item = baseItem();
    render(<VideoCard item={item} size="medium" />);
    expect(screen.getByText(/great goal/i)).toBeInTheDocument();
  });

  it('renders large variant with template image', () => {
    const item = baseItem({ thumbnail: { templateUrl: 'http://x/{formatInstructions}/foo.png' } });
    render(<VideoCard item={item} size="large" />);
    expect(screen.getByText(/great goal/i)).toBeInTheDocument();
  });
});

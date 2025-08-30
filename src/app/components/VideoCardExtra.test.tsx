import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCard from './VideoCard';

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = (props: any) => <img alt={props.alt} data-testid="img" />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

// Mock formatMarkdownContent to simple passthrough
jest.mock('../utils/formatters', () => ({
  ...jest.requireActual('../utils/formatters'),
  formatMarkdownContent: (s: string) => s || '',
}));

describe('VideoCard variants (smoke)', () => {
  beforeEach(() => {
    // Provide minimal fetch mock for blurDataURL path (large/default variants)
    global.fetch = jest
      .fn()
      .mockResolvedValue({ blob: async () => new Blob(['x'], { type: 'image/png' }) });
  });
  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  const base = {
    slug: 'clip',
    headline: 'Great Clip',
    summary: 'Some summary',
    contentDate: '2024-03-10T12:00:00Z',
    fields: { description: 'Desc' },
  } as any;

  it('renders default size with description', () => {
    render(
      <VideoCard
        item={{ ...base, thumbnail: { templateUrl: 'http://x/{formatInstructions}/img.png' } }}
      />
    );
    expect(screen.getByText(/Great Clip/i)).toBeInTheDocument();
    expect(screen.getByText(/Desc/i)).toBeInTheDocument();
  });

  it('renders small size without thumbnail fallback', () => {
    render(<VideoCard item={base} size="small" />);
    expect(screen.getByText(/Great Clip/i)).toBeInTheDocument();
  });

  it('renders medium size', () => {
    render(<VideoCard item={base} size="medium" />);
    expect(screen.getByText(/Great Clip/i)).toBeInTheDocument();
  });

  it('renders large size with Read Story link', () => {
    render(
      <VideoCard
        item={{ ...base, thumbnail: { templateUrl: 'http://x/{formatInstructions}/img.png' } }}
        size="large"
      />
    );
    expect(screen.getByText(/Great Clip/i)).toBeInTheDocument();
    expect(screen.getByText(/Read Story/i)).toBeInTheDocument();
  });
});

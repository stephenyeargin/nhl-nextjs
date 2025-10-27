import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ContentPhoto from './ContentPhoto';

interface PhotoPart {
  _entityId: string;
  image: { templateUrl: string };
  fields: { altText?: string; credit?: string };
  contentDate?: string;
}

// Mock next/image
jest.mock('next/image', () => {
  const Img = (props: { alt: string; onClick?: () => void }) => (
    <img alt={props.alt} onClick={props.onClick} />
  );
  (Img as { displayName?: string }).displayName = 'NextImageMock';

  return Img;
});

// Mock fetch for blur image
global.fetch = jest
  .fn()
  .mockResolvedValue({ blob: () => Promise.resolve(new Blob()) }) as typeof fetch;

const part: PhotoPart = {
  _entityId: 'p1',
  image: { templateUrl: 'https://example.com/{formatInstructions}' },
  fields: { altText: 'Alt', credit: 'Credit' },
  contentDate: '2024-01-01T00:00:00Z',
};

describe('ContentPhoto', () => {
  it('renders and opens viewer on click', async () => {
    render(<ContentPhoto part={part} />);
    const img = await screen.findByAltText('Alt');
    fireEvent.click(img);
    expect(await screen.findAllByText(/Credit/)).toBeTruthy();
  });
});

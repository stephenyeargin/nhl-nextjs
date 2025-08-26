import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ContentPhoto from './ContentPhoto';

// Mock next/image
jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element, react/display-name
  const Img = (props: any) => <img alt={props.alt} onClick={props.onClick} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

// Mock fetch for blur image
global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve(new Blob()) }) as any;

const part = {
  _entityId: 'p1',
  image: { templateUrl: 'https://example.com/{formatInstructions}' },
  fields: { altText: 'Alt', credit: 'Credit' },
  contentDate: '2024-01-01T00:00:00Z',
};

describe('ContentPhoto', () => {
  it('renders and opens viewer on click', async () => {
    render(<ContentPhoto part={part as any} />);
    const img = await screen.findByAltText('Alt');
    fireEvent.click(img);
    expect(await screen.findAllByText(/Credit/)).toBeTruthy();
  });
});

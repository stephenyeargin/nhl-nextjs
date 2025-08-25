import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentCustomEntity from './ContentCustomEntity';

// Mock next/image to avoid layout issues
// eslint-disable-next-line react/display-name, @next/next/no-img-element
jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element
  const Img = (props: any) => <img alt={props.alt} />;
  (Img as any).displayName = 'NextImageMock';

  return Img;
});

describe('ContentCustomEntity', () => {
  beforeAll(() => {
    // Mock FileReader used in component
    class FileReaderMock {
      public result: any;
      public onloadend: (() => void) | null = null;
      readAsDataURL() {
        this.result = 'data:image/gif;base64,AAAA';
        if (this.onloadend) {
          this.onloadend();
        }
      }
    }
    // @ts-ignore
    global.FileReader = FileReaderMock;

    // Mock fetch for blur image request
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve({}) });
  });

  it('renders video entity', () => {
    render(<ContentCustomEntity part={{ _entityId: '1', entityCode: 'video', fields: { brightcoveAccountId: 'acc', brightcoveId: 'vid', description: 'Desc' } }} />);
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders promo entity', () => {
    render(<ContentCustomEntity part={{ _entityId: '2', entityCode: 'promo', fields: { headline: 'Promo Head', description: 'Some *markdown*' }, thumbnail: { templateUrl: 'https://example.com/{formatInstructions}', title: 'Thumb' } }} />);
    expect(screen.getByText('Promo Head')).toBeInTheDocument();
  });

  it('renders player entity', () => {
    render(<ContentCustomEntity part={{ _entityId: '3', entityCode: 'player', fields: { biography: 'Bio' } }} />);
    expect(screen.getByText(/Bio/)).toBeInTheDocument();
  });
});

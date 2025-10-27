import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentCustomEntity from './ContentCustomEntity';

// Mock next/image to avoid layout issues
jest.mock('next/image', () => {
  const Img = (props: { alt: string }) => <img alt={props.alt} />;
  (Img as { displayName?: string }).displayName = 'NextImageMock';

  return Img;
});

describe('ContentCustomEntity', () => {
  beforeAll(() => {
    // Mock FileReader used in component
    class FileReaderMock {
      public result: string | null = null;
      public onloadend: (() => void) | null = null;
      readAsDataURL() {
        this.result = 'data:image/gif;base64,AAAA';
        if (this.onloadend) {
          this.onloadend();
        }
      }
    }
    // @ts-expect-error - Mocking global FileReader for tests
    global.FileReader = FileReaderMock;

    // Mock fetch for blur image request
    global.fetch = jest.fn().mockResolvedValue({ blob: () => Promise.resolve({}) });
  });

  it('renders video entity', () => {
    render(
      <ContentCustomEntity
        part={{
          _entityId: '1',
          entityCode: 'video',
          fields: { brightcoveAccountId: 'acc', brightcoveId: 'vid', description: 'Desc' },
        }}
      />
    );
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders promo entity', () => {
    render(
      <ContentCustomEntity
        part={{
          _entityId: '2',
          entityCode: 'promo',
          fields: { headline: 'Promo Head', description: 'Some *markdown*' },
          thumbnail: { templateUrl: 'https://example.com/{formatInstructions}', title: 'Thumb' },
        }}
      />
    );
    expect(screen.getByText('Promo Head')).toBeInTheDocument();
  });

  it('renders player entity', () => {
    render(
      <ContentCustomEntity
        part={{ _entityId: '3', entityCode: 'player', fields: { biography: 'Bio' } }}
      />
    );
    expect(screen.getByText(/Bio/)).toBeInTheDocument();
  });
});

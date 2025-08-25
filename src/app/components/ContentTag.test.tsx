import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentTag from './ContentTag';

jest.mock('next/link', () => ({ children }: any) => children);

const base = { _entityId: '1', slug: 'topic', title: 'Title' } as any;

describe('ContentTag', () => {
  test('defaults to news topic url', () => {
    render(<ContentTag tag={base} />);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  test('player tag', () => {
    render(<ContentTag tag={{ ...base, externalSourceName: 'player', extraData: { playerId: '99' } }} />);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  test('team tag', () => {
    render(<ContentTag tag={{ ...base, externalSourceName: 'team', extraData: { abbreviation: 'BOS' } }} />);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  test('game tag', () => {
    render(<ContentTag tag={{ ...base, externalSourceName: 'game', extraData: { gameId: '2024' } }} />);
    expect(screen.getByText('Title')).toBeTruthy();
  });
});

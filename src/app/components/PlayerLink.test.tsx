import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerLink from './PlayerLink';

const mockOpenCard = jest.fn();
const mockUsePlayerCard = jest.fn();
const mockCloseCard = jest.fn();
const mockScheduleClose = jest.fn();
const mockCancelClose = jest.fn();
const mockRouter = { push: jest.fn() };

jest.mock('../contexts/PlayerCardContext', () => ({
  usePlayerCard: (...args: unknown[]) => mockUsePlayerCard(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockUsePlayerCard.mockReturnValue({
    openCard: mockOpenCard,
    closeCard: mockCloseCard,
    scheduleClose: mockScheduleClose,
    cancelClose: mockCancelClose,
    cardState: null,
  });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('PlayerLink', () => {
  it('renders children', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    expect(screen.getByText('Wayne Gretzky')).toBeInTheDocument();
  });

  it('calls openCard with playerId and DOMRect on click', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenCard).toHaveBeenCalledWith(8478402, expect.any(Object));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('does not navigate on plain click', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates directly on Ctrl+click', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    fireEvent.click(screen.getByRole('button'), { ctrlKey: true });
    expect(mockRouter.push).toHaveBeenCalledWith('/player/8478402');
    expect(mockOpenCard).not.toHaveBeenCalled();
  });

  it('navigates directly on Meta+click', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    fireEvent.click(screen.getByRole('button'), { metaKey: true });
    expect(mockRouter.push).toHaveBeenCalledWith('/player/8478402');
    expect(mockOpenCard).not.toHaveBeenCalled();
  });

  it('applies className prop', () => {
    render(
      <PlayerLink playerId={8478402} className="font-bold">
        Wayne Gretzky
      </PlayerLink>
    );
    expect(screen.getByRole('button')).toHaveClass('font-bold');
  });

  it('has aria-haspopup="dialog"', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('resets native button chrome', () => {
    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    expect(screen.getByRole('button')).toHaveClass('appearance-none');
  });

  it('closes the card when clicking the already open player', () => {
    mockUsePlayerCard.mockReturnValue({
      openCard: mockOpenCard,
      closeCard: mockCloseCard,
      scheduleClose: mockScheduleClose,
      cancelClose: mockCancelClose,
      cardState: { data: { playerId: 8478402 } },
    });

    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    fireEvent.click(screen.getByRole('button'));

    expect(mockCloseCard).toHaveBeenCalled();
    expect(mockOpenCard).not.toHaveBeenCalled();
  });

  it('opens on hover for fine pointers and schedules close on leave', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<PlayerLink playerId={8478402}>Wayne Gretzky</PlayerLink>);
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    expect(mockOpenCard).not.toHaveBeenCalled();

    jest.advanceTimersByTime(120);
    fireEvent.mouseLeave(button);

    expect(mockCancelClose).toHaveBeenCalled();
    expect(mockOpenCard).toHaveBeenCalledWith(8478402, expect.any(Object));
    expect(mockScheduleClose).toHaveBeenCalledWith(180);

    window.matchMedia = originalMatchMedia;
  });
});

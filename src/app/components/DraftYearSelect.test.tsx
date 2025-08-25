import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DraftYearSelect from './DraftYearSelect';

describe('DraftYearSelect', () => {
  beforeEach(() => {
    const loc = window.location;
    Object.defineProperty(window, 'location', { value: { ...loc, href: '' }, writable: true });
  });

  test('navigates via prev/next buttons', () => {
    render(<DraftYearSelect draftYears={[2023, 2024, 2025]} draftYear={2024} />);
    fireEvent.click(screen.getByText(/« 2023/));
    expect(window.location.href).toContain('/draft/2023');
  });

  test('select change to valid year navigates', () => {
    render(<DraftYearSelect draftYears={[2023, 2024]} draftYear={2023} />);
    fireEvent.change(screen.getByDisplayValue('2023'), { target: { value: '2024' } });
    expect(window.location.href).toContain('/draft/2024');
  });

  test('invalid year logs error', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<DraftYearSelect draftYears={[2023, 2024]} draftYear={2023} />);
    fireEvent.change(screen.getByDisplayValue('2023'), { target: { value: 'abc' } });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Select from './Select';

describe('Select', () => {
  test('applies shared base styling', () => {
    render(
      <Select aria-label="Test">
        <option value="a">A</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('p-2', 'border', 'rounded-sm', 'bg-inherit');
    expect(select).toHaveClass('text-black');
  });

  test('merges a custom className with the base styling', () => {
    render(
      <Select aria-label="Test" className="w-full">
        <option value="a">A</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('w-full');
    expect(select).toHaveClass('border');
  });

  test('forwards native select props', () => {
    const handleChange = jest.fn();
    render(
      <Select aria-label="Test" value="b" onChange={handleChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('b');

    fireEvent.change(select, { target: { value: 'a' } });
    expect(handleChange).toHaveBeenCalled();
  });
});

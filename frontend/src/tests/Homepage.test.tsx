import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../components/HomePage';


describe('HomePage', () => {
  it('renders the homepage', () => {
    render(<HomePage />);
    const headingElement = screen.getByRole('heading', { name: /Mayfly/i });
    expect(headingElement).toBeInTheDocument();
  });
});
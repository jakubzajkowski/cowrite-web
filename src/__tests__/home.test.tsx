import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import * as navigationHook from '../hooks/useAppNavigation';

describe('HomePage', () => {
  it('renders the homepage content and buttons', () => {
    const navigateMock = vi.fn();

    vi.spyOn(navigationHook, 'useAppNavigation').mockReturnValue({
      navigateTo: navigateMock,
      goBack: vi.fn(),
      goForward: vi.fn(),
      isCurrentPath: vi.fn().mockReturnValue(false),
      getCurrentPath: vi.fn().mockReturnValue('/'),
      location: { pathname: '/' } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      ROUTES: {
        HOME: '/',
        NOTES: '/notes',
        ABOUT: '/about',
        CONTACT: '/contact',
        SIGNIN: '/signin',
        SIGNUP: '/signup',
        NOT_FOUND: '*',
      },
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/CoWrite/i)).toBeDefined();
    expect(screen.getByText(/AI-powered markdown editor/i)).toBeDefined();

    fireEvent.click(screen.getByText(/Start Writing/i));
    expect(navigateMock).toHaveBeenCalledWith('/notes');

    fireEvent.click(screen.getByText(/Learn More/i));
    expect(navigateMock).toHaveBeenCalledWith('/about');
  });
});

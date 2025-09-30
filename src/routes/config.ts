export const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  ABOUT: '/about',
  CONTACT: '/contact',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  NOT_FOUND: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
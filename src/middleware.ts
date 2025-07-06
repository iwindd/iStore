import createMiddleware from './libs/middleware';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { PermissionMiddleware } from './middlewares/PermissionMiddleware';

const globalMiddlewares = {
  before: AuthMiddleware,
  after: PermissionMiddleware
}

const middlewares = {};

export const middleware = createMiddleware(middlewares, globalMiddlewares);
export const config = {
  /*
   * Match all paths except for:
   * 1. /api/ routes
   * 2. /_next/ (Next.js internals)
   * 3. /_static (inside /public)
   * 4. /_vercel (Vercel internals)
   * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
   */
  matcher: ['/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};
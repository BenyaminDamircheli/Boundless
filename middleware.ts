import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/editor']);


export default clerkMiddleware((auth, request) =>{ 
    if(!isProtectedRoute(request)){
      auth().protect();
    }
  });

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
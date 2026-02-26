// Simple static file server for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Default to index.html for root path
    if (path === '/' || path === '') {
      path = '/index.html';
    }
    
    try {
      // Try to fetch the requested file from the Workers environment
      const file = await env.ASSETS.fetch(new Request(`${url.origin}${path}`, request));
      
      // If file is found, return it
      if (file.status === 200) {
        return file;
      }
      
      // If file not found, serve 404.html
      throw new Error('Not found');
    } catch (error) {
      // Serve 404 page for any errors or missing files
      try {
        const notFoundPage = await env.ASSETS.fetch(new Request(`${url.origin}/404.html`, request));
        return new Response(notFoundPage.body, {
          status: 404,
          statusText: 'Not Found',
          headers: notFoundPage.headers
        });
      } catch {
        // Fallback if even 404.html is missing
        return new Response('404 - Page Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  }
};
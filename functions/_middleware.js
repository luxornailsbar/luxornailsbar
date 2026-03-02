export async function onRequest(context) {
  const { request, next } = context;
  
  try {
    // Try to serve the requested file
    return await next();
  } catch {
    // If file doesn't exist, serve index.html for SPA
    return new Response(await context.env.ASSETS.fetch('/index.html'), {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    });
  }
}
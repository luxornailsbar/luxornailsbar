//// run_server.js
//import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
//import * as build from "@remix-run/dev/server-build";
//
//const handleRequest = createPagesFunctionHandler({
//  build,
//  mode: process.env.NODE_ENV,
//  getLoadContext: (context) => ({ env: context.env }),
//});
//
//export default {
//  async fetch(request, env, ctx) {
//    const url = new URL(request.url);
//    const path = url.pathname;
//    
//    const staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.json', '.txt'];
//    const isStaticFile = staticExtensions.some(ext => path.endsWith(ext));
//    
//    if (isStaticFile) {
//      if (env.NODE_ENV === 'development') {
//        return await handleLocalStatic(request, path);
//      }
//      return fetch(request);
//    }
//    
//    if (!path.includes('.') && !path.startsWith('/api')) {
//      if (env.NODE_ENV === 'development') {
//        const response = await fetch(new URL('./index.html', request.url));
//        return new Response(response.body, {
//          headers: {
//            'Content-Type': 'text/html;charset=UTF-8',
//          },
//        });
//      }
//    }
//    
//    if (typeof handleRequest === 'function') {
//      return handleRequest({
//        request,
//        env,
//        waitUntil: ctx.waitUntil,
//        next: () => {
//          return fetch(new URL('./index.html', request.url));
//        },
//      });
//    }
//    
//    // Try to serve 404.html for 404 responses
//    try {
//      const response = await fetch(request);
//      if (response.status === 404) {
//        const notFoundResponse = await fetch(new URL('./404.html', request.url));
//        if (notFoundResponse.ok) {
//          return new Response(notFoundResponse.body, {
//            status: 404,
//            headers: {
//              'Content-Type': 'text/html;charset=UTF-8',
//            },
//          });
//        }
//      }
//      return response;
//    } catch (error) {
//      // If fetch fails, try to serve 404.html
//      try {
//        const notFoundResponse = await fetch(new URL('./404.html', request.url));
//        if (notFoundResponse.ok) {
//          return new Response(notFoundResponse.body, {
//            status: 404,
//            headers: {
//              'Content-Type': 'text/html;charset=UTF-8',
//            },
//          });
//        }
//      } catch (error2) {
//        // Fallback to generic 404
//        return new Response('Not Found', { status: 404 });
//      }
//    }
//    
//    return new Response('Not Found', { status: 404 });
//  },
//};
//
//async function handleLocalStatic(request, path) {
//  const filePath = path === '/' ? 'index.html' : path.substring(1);
//  
//  try {
//    const file = await fetch(`file:///${process.cwd()}/${filePath}`);
//    if (file.ok) {
//      return file;
//    }
//  } catch (error) {
//  }
//  
//  // Try 404.html for not found static files
//  if (!path.includes('.')) {
//    try {
//      const indexFile = await fetch(`file:///${process.cwd()}/index.html`);
//      if (indexFile.ok) {
//        return new Response(indexFile.body, {
//          headers: {
//            'Content-Type': 'text/html;charset=UTF-8',
//          },
//        });
//      }
//    } catch (error) {
//    }
//  }
//  
//  // Serve 404.html if it exists
//  try {
//    const notFoundFile = await fetch(`file:///${process.cwd()}/404.html`);
//    if (notFoundFile.ok) {
//      return new Response(notFoundFile.body, {
//        status: 404,
//        headers: {
//          'Content-Type': 'text/html;charset=UTF-8',
//        },
//      });
//    }
//  } catch (error) {
//  }
//  
//  return new Response('Not Found', { status: 404 });
//}
//
//export { handleRequest };

// run_server.js
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({ env: context.env }),
});

const securityConfig = {
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    blockDuration: 15 * 60 * 1000,
  },
  blockedUserAgents: [
    /bot|crawl|spider|scraper|curl|wget|python|java|libwww|nmap|nikto|sqlmap|hydra|metasploit|nessus|openvas|acunetix|appscan|burp|zap/i,
    /scan|hack|exploit|attack|inject|bypass|vulnerability|security|pentest|audit/i,
  ],
  blockedPaths: [
    /\.(php|asp|aspx|jsp|cgi|pl|sh|bat|exe|dll|sql|bak|old|backup|log|config|ini|env|git|svn)$/i,
    /(\/\.|\.\.\/|\/php|\/admin|\/wp-|\/config|\/backup|\/logs|\/database|\/sql|\/install|\/setup|\/test|\/debug)/i,
    /(%00|%0a|%0d|%27|%22|%3c|%3e|%25|%2f|%5c)/i,
  ],
  allowedOrigins: [
    //'https://luxornailsbar.com',
    //'https://www.luxornailsbar.com',
  ],
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), magnetometer=(), gyroscope=()',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com;
      style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://www.google.com https://maps.googleapis.com https://api.luxornailsbar.com;
      frame-src https://www.google.com;
      media-src 'self' https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim(),
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cache-Control': 'public, max-age=3600, immutable',
    'Feature-Policy': "camera 'none'; microphone 'none'; geolocation 'none'",
  },
};

const rateLimitStore = new Map();

function addSecurityHeaders(response, request) {
  const newHeaders = new Headers(response.headers);
  
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  const origin = request.headers.get('Origin');
  if (origin && securityConfig.allowedOrigins.includes(origin)) {
    newHeaders.set('Access-Control-Allow-Origin', origin);
    newHeaders.set('Access-Control-Allow-Credentials', 'true');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  newHeaders.delete('X-Powered-By');
  newHeaders.delete('Server');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function checkRateLimit(ip) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const hour = Math.floor(now / 3600000);
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, {
      minuteCount: 1,
      minuteStart: minute,
      hourCount: 1,
      hourStart: hour,
      blockedUntil: 0,
    });
    return { allowed: true };
  }
  
  const data = rateLimitStore.get(ip);
  
  if (now < data.blockedUntil) {
    return { 
      allowed: false, 
      reason: 'blocked', 
      retryAfter: Math.ceil((data.blockedUntil - now) / 1000) 
    };
  }
  
  if (minute !== data.minuteStart) {
    data.minuteCount = 1;
    data.minuteStart = minute;
  }
  if (hour !== data.hourStart) {
    data.hourCount = 1;
    data.hourStart = hour;
  }
  
  if (data.minuteCount >= securityConfig.rateLimit.requestsPerMinute) {
    data.blockedUntil = now + securityConfig.rateLimit.blockDuration;
    rateLimitStore.set(ip, data);
    return { 
      allowed: false, 
      reason: 'minute_limit',
      retryAfter: Math.ceil(securityConfig.rateLimit.blockDuration / 1000)
    };
  }
  
  if (data.hourCount >= securityConfig.rateLimit.requestsPerHour) {
    data.blockedUntil = now + securityConfig.rateLimit.blockDuration;
    rateLimitStore.set(ip, data);
    return { 
      allowed: false, 
      reason: 'hour_limit',
      retryAfter: Math.ceil(securityConfig.rateLimit.blockDuration / 1000)
    };
  }
  
  data.minuteCount++;
  data.hourCount++;
  rateLimitStore.set(ip, data);
  
  return { allowed: true };
}

function getClientIP(request) {
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  const xRealIP = request.headers.get('X-Real-IP');
  
  return cfConnectingIP || xForwardedFor?.split(',')[0] || xRealIP || request.headers.get('CF-Connecting-IPv6') || 'unknown';
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  if (sanitized.includes('%')) {
    sanitized = sanitized.replace(/%[0-9A-Fa-f]{2}/g, '');
  }
  
  return sanitized;
}

function validateRequest(request, path) {
  const method = request.method;
  const allowedMethods = ['GET', 'POST', 'HEAD', 'OPTIONS'];
  if (!allowedMethods.includes(method)) {
    return { valid: false, reason: 'Method not allowed' };
  }
  
  const userAgent = request.headers.get('User-Agent') || '';
  if (securityConfig.blockedUserAgents.some(pattern => pattern.test(userAgent))) {
    return { valid: false, reason: 'Suspicious user agent' };
  }
  
  if (securityConfig.blockedPaths.some(pattern => pattern.test(path))) {
    return { valid: false, reason: 'Blocked path' };
  }
  
  if (method === 'POST') {
    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return { valid: false, reason: 'Request too large' };
    }
  }
  
  if (method === 'POST') {
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/x-www-form-urlencoded') && 
        !contentType.includes('multipart/form-data') &&
        !contentType.includes('application/json')) {
      return { valid: false, reason: 'Invalid content type' };
    }
  }
  
  return { valid: true };
}

function cleanupRateLimitStore() {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  
  for (const [ip, data] of rateLimitStore.entries()) {
    if (data.blockedUntil < oneHourAgo && 
        data.minuteStart < Math.floor(oneHourAgo / 60000)) {
      rateLimitStore.delete(ip);
    }
  }
}

setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIP = getClientIP(request);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': securityConfig.allowedOrigins[0],
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    const validation = validateRequest(request, path);
    if (!validation.valid) {
      return new Response('Forbidden', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          ...securityConfig.headers,
        },
      });
    }
    
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': rateLimitCheck.retryAfter.toString(),
          ...securityConfig.headers,
        },
      });
    }
    
    const staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.json', '.txt', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.mp3'];
    const isStaticFile = staticExtensions.some(ext => path.endsWith(ext));
    
    if (isStaticFile) {
      const cacheControl = path.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/) 
        ? 'public, max-age=31536000, immutable' 
        : 'public, max-age=3600';
      
      if (env.NODE_ENV === 'development') {
        const response = await handleLocalStatic(request, path);
        response.headers.set('Cache-Control', cacheControl);
        return addSecurityHeaders(response, request);
      }
      
      try {
        const response = await fetch(request);
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Cache-Control', cacheControl);
        return addSecurityHeaders(newResponse, request);
      } catch (error) {
        return new Response('Internal Server Error', {
          status: 500,
          headers: securityConfig.headers,
        });
      }
    }
    
    if (!path.includes('.') && !path.startsWith('/api')) {
      if (env.NODE_ENV === 'development') {
        try {
          const response = await fetch(new URL('./index.html', request.url));
          const responseWithHeaders = new Response(response.body, {
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
          return addSecurityHeaders(responseWithHeaders, request);
        } catch (error) {
          return new Response('Internal Server Error', {
            status: 500,
            headers: securityConfig.headers,
          });
        }
      }
    }
    
    if (path.startsWith('/api/')) {
      const apiKey = request.headers.get('X-API-Key');
      const authToken = request.headers.get('Authorization');
      
      if (!apiKey && !authToken) {
        return new Response('Unauthorized', {
          status: 401,
          headers: securityConfig.headers,
        });
      }
    }
    
    if (typeof handleRequest === 'function') {
      try {
        const result = await handleRequest({
          request,
          env,
          waitUntil: ctx.waitUntil,
          next: () => {
            return fetch(new URL('./index.html', request.url));
          },
        });
        
        if (result) {
          return addSecurityHeaders(result, request);
        }
      } catch (error) {
        return new Response('Internal Server Error', {
          status: 500,
          headers: securityConfig.headers,
        });
      }
    }
    
    try {
      const response = await fetch(request);
      if (response.status === 404) {
        const notFoundResponse = await fetch(new URL('./404.html', request.url));
        if (notFoundResponse.ok) {
          const responseWithHeaders = new Response(notFoundResponse.body, {
            status: 404,
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'no-cache',
            },
          });
          return addSecurityHeaders(responseWithHeaders, request);
        }
      }
      return addSecurityHeaders(response, request);
    } catch (error) {
      try {
        const notFoundResponse = await fetch(new URL('./404.html', request.url));
        if (notFoundResponse.ok) {
          const responseWithHeaders = new Response(notFoundResponse.body, {
            status: 404,
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'no-cache',
            },
          });
          return addSecurityHeaders(responseWithHeaders, request);
        }
      } catch (error2) {
        return new Response('Not Found', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            ...securityConfig.headers,
          },
        });
      }
    }
    
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        ...securityConfig.headers,
      },
    });
  },
};

async function handleLocalStatic(request, path) {
  const sanitizedPath = sanitizeInput(path);
  const filePath = sanitizedPath === '/' ? 'index.html' : sanitizedPath.substring(1);
  
  try {
    const file = await fetch(`file:///${process.cwd()}/${filePath}`);
    if (file.ok) {
      return file;
    }
  } catch (error) {
  }
  
  if (!path.includes('.')) {
    try {
      const indexFile = await fetch(`file:///${process.cwd()}/index.html`);
      if (indexFile.ok) {
        return new Response(indexFile.body, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
          },
        });
      }
    } catch (error) {
    }
  }
  
  try {
    const notFoundFile = await fetch(`file:///${process.cwd()}/404.html`);
    if (notFoundFile.ok) {
      return new Response(notFoundFile.body, {
        status: 404,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
        },
      });
    }
  } catch (error) {
  }
  
  return new Response('Not Found', { status: 404 });
}

export { handleRequest };
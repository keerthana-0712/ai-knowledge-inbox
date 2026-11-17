import net from 'net';

/**
 * Validates that a target URL is safe to fetch and protects against
 * Server-Side Request Forgery (SSRF) attacks targeting localhost,
 * private networks, and cloud instance metadata services.
 */
export function validateSafeUrl(urlString: string): { isValid: boolean; error?: string } {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlString);
  } catch {
    return { isValid: false, error: 'Invalid URL format.' };
  }

  // Enforce HTTP / HTTPS protocol
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Invalid protocol '${parsedUrl.protocol}'. Only http: and https: are allowed.`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Guard against localhost and common loopback aliases
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    return {
      isValid: false,
      error: 'Fetching from localhost, private networks, or metadata services is blocked for security.',
    };
  }

  // Check if hostname is an IP address
  const ipType = net.isIP(hostname);
  if (ipType === 4) {
    if (isPrivateIPv4(hostname)) {
      return {
        isValid: false,
        error: `IP address ${hostname} belongs to a private, loopback, or link-local range and cannot be fetched.`,
      };
    }
  } else if (ipType === 6) {
    if (isPrivateIPv6(hostname)) {
      return {
        isValid: false,
        error: `IPv6 address ${hostname} belongs to a private or loopback range and cannot be fetched.`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Checks if an IPv4 address falls into private, loopback, or link-local subnets.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IP, block it
  }

  const [a, b] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local / Cloud metadata service)
  if (a === 169 && b === 254) return true;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback or unique local / link-local.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  // Link-local (fe80::/10)
  if (normalized.startsWith('fe80:')) return true;
  // Unique local addresses (fc00::/7)
  if (normalized.startsWith('fc00:') || normalized.startsWith('fd')) return true;
  return false;
}

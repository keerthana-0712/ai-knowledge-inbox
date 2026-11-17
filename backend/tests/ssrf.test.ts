import { describe, it, expect } from 'vitest';
import { validateSafeUrl } from '../src/utils/ssrf.js';

describe('SSRF Protection & URL Validation', () => {
  it('should allow valid public HTTPS and HTTP URLs', () => {
    expect(validateSafeUrl('https://turium.ai').isValid).toBe(true);
    expect(validateSafeUrl('https://en.wikipedia.org/wiki/Artificial_intelligence').isValid).toBe(true);
    expect(validateSafeUrl('http://example.com/articles/rag-systems').isValid).toBe(true);
  });

  it('should block localhost and loopback hostnames', () => {
    expect(validateSafeUrl('http://localhost:3000').isValid).toBe(false);
    expect(validateSafeUrl('http://127.0.0.1:8080').isValid).toBe(false);
    expect(validateSafeUrl('http://0.0.0.0').isValid).toBe(false);
    expect(validateSafeUrl('http://subdomain.localhost').isValid).toBe(false);
  });

  it('should block private IPv4 network ranges', () => {
    // 10.0.0.0/8
    expect(validateSafeUrl('http://10.0.1.5/admin').isValid).toBe(false);
    // 192.168.0.0/16
    expect(validateSafeUrl('http://192.168.1.1').isValid).toBe(false);
    // 172.16.0.0/12
    expect(validateSafeUrl('http://172.20.0.1:5000').isValid).toBe(false);
  });

  it('should block cloud metadata services', () => {
    // AWS / GCP / Azure metadata endpoint
    expect(validateSafeUrl('http://169.254.169.254/latest/meta-data/').isValid).toBe(false);
    expect(validateSafeUrl('http://metadata.google.internal/computeMetadata/v1/').isValid).toBe(false);
  });

  it('should block non-HTTP protocols', () => {
    expect(validateSafeUrl('file:///etc/passwd').isValid).toBe(false);
    expect(validateSafeUrl('ftp://example.com/file.txt').isValid).toBe(false);
    expect(validateSafeUrl('javascript:alert(1)').isValid).toBe(false);
  });
});

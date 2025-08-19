# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported |
| ------- | --------- |
| 0.2.x   | ✅        |
| < 0.2   | ❌        |

## Reporting a Vulnerability

We take the security of the Quran App seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. **Contact Us Directly**

Send details of the vulnerability to: **[Your Security Email]**

Include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### 3. **Response Timeline**

- **24 hours**: Initial response acknowledging receipt
- **72 hours**: Initial assessment and triage
- **7 days**: Detailed response with next steps
- **30 days**: Resolution target for critical issues

## Security Measures

### Code Security

- **Dependencies**: Regular security audits with `npm audit`
- **Static Analysis**: ESLint security rules enabled
- **Type Safety**: Strict TypeScript mode
- **Input Validation**: Sanitization of user inputs
- **XSS Protection**: DOMPurify for HTML sanitization

### Infrastructure Security

- **HTTPS Only**: All traffic encrypted in transit
- **Security Headers**: CSP, HSTS, and other security headers
- **Environment Variables**: Secrets never committed to code
- **API Rate Limiting**: Protection against abuse

### Development Security

- **Branch Protection**: Main branch requires PR reviews
- **Dependency Scanning**: Automated vulnerability detection
- **Code Scanning**: GitHub CodeQL analysis
- **Secret Scanning**: Automated secret detection

## Security Best Practices

### For Contributors

1. **Never commit secrets**:

   ```bash
   # ❌ Wrong
   const API_KEY = "sk-1234567890abcdef";

   # ✅ Correct
   const API_KEY = process.env.API_KEY;
   ```

2. **Validate inputs**:

   ```typescript
   // ❌ Wrong
   const verse = await fetchVerse(params.id);

   # ✅ Correct
   const verseId = parseInt(params.id);
   if (isNaN(verseId) || verseId < 1) {
     throw new Error('Invalid verse ID');
   }
   const verse = await fetchVerse(verseId);
   ```

3. **Sanitize HTML**:

   ```typescript
   import DOMPurify from 'dompurify';

   const cleanHTML = DOMPurify.sanitize(userContent);
   ```

4. **Use proper types**:
   ```typescript
   // ✅ Proper typing prevents many security issues
   interface VerseRequest {
     surahId: number;
     verseNumber: number;
   }
   ```

### For Deployment

1. **Environment Variables**:

   ```bash
   # Production environment
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.example.com
   SECRET_KEY=use-strong-random-key
   ```

2. **Security Headers**:
   ```javascript
   // next.config.ts
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on',
     },
     {
       key: 'Strict-Transport-Security',
       value: 'max-age=63072000; includeSubDomains; preload',
     },
     {
       key: 'X-XSS-Protection',
       value: '1; mode=block',
     },
     {
       key: 'X-Frame-Options',
       value: 'DENY',
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff',
     },
     {
       key: 'Referrer-Policy',
       value: 'origin-when-cross-origin',
     },
   ];
   ```

## Known Security Considerations

### Client-Side Security

- **Local Storage**: Only non-sensitive data stored locally
- **Cross-Site Scripting (XSS)**: All user content sanitized
- **Content Security Policy**: Strict CSP headers implemented
- **HTTPS**: All external API calls use HTTPS

### API Security

- **Rate Limiting**: Implemented on API endpoints
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: No sensitive information in error messages
- **CORS**: Properly configured for allowed origins

### Third-Party Dependencies

- **Regular Updates**: Dependencies updated monthly
- **Vulnerability Scanning**: Automated with Dependabot
- **Minimal Dependencies**: Only necessary packages included
- **Audit Trail**: All dependency changes reviewed

## Incident Response

### If a Vulnerability is Discovered

1. **Immediate**: Assess the severity and impact
2. **Within 1 hour**: Implement temporary mitigation if needed
3. **Within 24 hours**: Develop and test a fix
4. **Within 48 hours**: Deploy fix to production
5. **Within 1 week**: Post-incident review and documentation

### Communication

- **Internal**: Notify development team immediately
- **Users**: Communicate security updates through release notes
- **Community**: Publish security advisories for significant issues

## Security Tools

### Automated Security Checks

```bash
# Run security audit
npm audit --audit-level=moderate

# Check for vulnerabilities in dependencies
npm audit fix

# Static security analysis
npm run lint:security
```

### Manual Security Testing

- **Input Validation Testing**: Test all form inputs
- **Authentication Testing**: Verify access controls
- **Session Management**: Test session handling
- **Cross-Site Scripting**: Test XSS prevention

## Resources

### Security References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [npm Security Best Practices](https://docs.npmjs.com/security)
- [React Security](https://react.dev/reference/react-dom/components/common#applying-css-styles)

### Security Checklist

- [ ] No secrets in code
- [ ] All inputs validated
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Error handling secure
- [ ] Logging configured
- [ ] Access controls implemented

## Contact

For security-related questions or concerns:

- **Email**: [Your Security Email]
- **Response Time**: Within 24 hours
- **Escalation**: For critical issues, mark email as "URGENT - SECURITY"

---

**Note**: This security policy is reviewed and updated quarterly to ensure it remains current with security best practices and emerging threats.

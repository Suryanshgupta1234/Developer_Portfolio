# Security Guidelines

## Environment Variables

**NEVER commit `.env` files to version control!**

All sensitive credentials are stored in `.env` files which are git-ignored.

### Server Environment Variables

Copy `server/.env.example` to `server/.env` and update with your actual credentials:

```bash
cd server
cp .env.example .env
# Edit .env with your secure credentials
```

### Client Environment Variables

Copy `client/.env.example` to `client/.env` and update with your actual values:

```bash
cd client
cp .env.example .env
# Edit .env with your configuration
```

## Admin Credentials

Admin credentials are stored securely in:
- `server/.env` file (git-ignored)
- Database with bcrypt hashed passwords

To update admin credentials:
1. Edit `server/.env` file
2. Run: `npm run update-admin` (from server directory)
3. Restart the server

## Production Deployment Checklist

- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Use strong admin password (min 12 chars, mixed case, numbers, symbols)
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV=production
- [ ] Configure CORS with specific origins (not wildcard)
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Review rate limiting settings
- [ ] Enable security headers (Helmet.js configured)
- [ ] Regular security updates: `npm audit fix`

## Best Practices

1. **Never log sensitive data** (passwords, tokens, API keys)
2. **Use environment variables** for all configuration
3. **Rotate secrets regularly** (JWT secret, API keys)
4. **Monitor authentication logs** for suspicious activity
5. **Keep dependencies updated** for security patches

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainer privately rather than opening a public issue.

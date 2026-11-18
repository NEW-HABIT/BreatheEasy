# 🛡️ Security Policy — BreatheEasy

## Supported Versions

| Version | Supported          | Security Maintenance Level |
| ------- | ------------------ | -------------------------- |
| 1.0.x   | :white_check_mark: | Full Active Support        |

---

## Security Architecture & Cryptographic Standards

BreatheEasy enforces zero-trust and defense-in-depth principles:

### 1. Password Hashing & Key Derivation
- Uses industry-standard **PBKDF2-HMAC-SHA256** with **100,000 iterations** (OWASP recommended standard).
- Every password hash incorporates an independent, cryptographically secure 16-byte random salt generated via `secrets.token_hex(16)`.
- Hash verification utilizes `secrets.compare_digest` to prevent timing-based side-channel attacks (**CWE-208: Observable Timing Discrepancy**).

### 2. HTTP Security Headers
All responses across Next.js Edge and FastAPI services include strict HTTP protection headers:
- `Content-Security-Policy`: Restricts script, style, and frame execution domains.
- `X-Content-Type-Options: nosniff`: Neutralizes MIME-type sniffing attacks.
- `X-Frame-Options: DENY`: Prevents UI redressing and clickjacking attacks.
- `X-XSS-Protection: 1; mode=block`: Activates browser reflected XSS filters.
- `Referrer-Policy: strict-origin-when-cross-origin`: Protects query string privacy.

### 3. Database & Query Safety
- **Zero Raw SQL Execution**: All database transactions leverage SQLAlchemy ORM with strictly parameterized queries to eliminate SQL injection (**CWE-89**).
- Ephemeral, serverless-safe SQLite routing `/tmp/breatheasy.db` prevents filesystem permission exposure in cloud environments.

---

## Reporting a Vulnerability

If you discover a security vulnerability within BreatheEasy, please report it via private disclosure rather than opening a public issue:

1. **Email:** security@breatheasy-app.org (or open a Private Security Advisory via GitHub).
2. **Response SLA:** The development team will acknowledge receipt within 24 hours and issue a patch within 48 hours.

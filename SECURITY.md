# Security Policy

## Supported versions
- Main branch: actively maintained
- Published releases/tags: supported for critical security fixes when feasible

## Reporting a vulnerability
- Email: k.yagci@students.htl-leonding.ac.at
- Preferred language: English (German welcome)
- Please include: steps to reproduce, impact, affected version/commit, and any PoC. Avoid sensitive data in reports.
- We aim to acknowledge within 3 business days and provide an initial assessment within 7 business days.

## Coordinated disclosure
- Please allow reasonable time for a fix before public disclosure.
- We will share status updates until a fix or mitigation is available.
- If a CVE is appropriate, we will coordinate assignment or share details to assist.

## Scope
- This repository and deployed artifacts originating from it.
- Exclusions: third-party services, user-generated content, social engineering, physical attacks, and denial-of-service that requires unreasonable resources to mitigate.

## Handling process
1) Triage and reproduce.
2) Assess severity and impact.
3) Develop and test a fix or mitigation.
4) Notify reporters with remediation plan and expected timeline.
5) Release a patch and document the resolution in changelog/release notes.

## Security best practices for contributors
- Do not commit secrets; use environment variables or secret managers.
- Prefer dependency updates that address CVEs; include references where relevant.
- When adding auth/session logic, follow least privilege and validate inputs strictly.
- Run lint/tests before opening PRs to avoid regressions that might widen attack surface.

# Auth

The sign-in screen — a single centered card, the minimum to authenticate and nothing else. No nav, no chrome; the task is the whole page.

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; background:var(--muted); padding:2.5rem 1rem; display:flex; justify-content:center;">
  <div style="width:100%; max-width:20rem; background:var(--card); border:1px solid var(--border); border-radius:0.5rem; padding:1.5rem; display:flex; flex-direction:column; gap:0.875rem;">
    <div style="display:flex; flex-direction:column; gap:0.25rem;"><strong style="font-size:1.125rem;">Sign in</strong><span style="font-size:0.8125rem; color:var(--muted-foreground);">Welcome back to Auterion Suite.</span></div>
    <div style="display:flex; flex-direction:column; gap:0.375rem;"><Label for="auth-email">Email</Label><Input id="auth-email" type="email" placeholder="you@auterion.com" /></div>
    <div style="display:flex; flex-direction:column; gap:0.375rem;"><Label for="auth-pw">Password</Label><Input id="auth-pw" type="password" placeholder="••••••••" /></div>
    <Button variant="primary" style="width:100%;">Sign in</Button>
    <span style="font-size:0.8125rem; color:var(--muted-foreground); text-align:center;">Forgot password?</span>
  </div>
</div>

## Composition

- A `Card`-like centered panel: title + one sentence, `Label` + `Input` pairs, a full-width primary `Button`. Errors surface inline under the field (the shared `invalid` API), not as a toast.
- Keep it minimal — no sidebar, no breadcrumbs. For SSO, a provider button stack replaces or precedes the credential fields.
- The same shell covers sign-up, reset-password, and 2FA — one card, swapped contents.

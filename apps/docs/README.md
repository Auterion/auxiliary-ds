# @auxiliary/docs

Auxiliary's documentation site, built with [VitePress](https://vitepress.dev/). Runs at `http://localhost:5173`.

## Status

Scaffold only. Step 6 of the build plan lands the VitePress config, the 7-section information architecture (Get started · Identity · Foundations · Components · Patterns · Operational · Practice), the foundation pages with live token values, and Carbon-grade component documentation pages for the first three primitives.

The accessibility CI gate (axe-core, zero violations) lands alongside Step 6, since it needs rendered pages to assert against.

This app is excluded from changesets — it's internal, not published.

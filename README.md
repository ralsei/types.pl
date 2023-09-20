# types.pl

![blobcatlambda](https://raw.githubusercontent.com/ralsei/types.pl/types.pl/public/favicon.ico)

ʷᵉ'ʳᵉ ᵗʰᵉ ʳᵃᵗˢ
ʷᵉ ʳᵘˡᵉ ᵗʰᵉ ᵗᵘⁿⁿᵉˡˢ

This is the Mastodon fork running on https://types.pl, which itself is a fork of glitch-soc.

Differences from glitch-soc:

- Various features of the Markdown parser are disabled, because they federate poorly.
  - Namely, lists are disabled, and so are superscripts and subscripts. They get auto-escaped.
- LaTeX support is provided, with `\( this for inline math \)`, and either `$$ this $$` or `\[ this \]`
  for display math. This uses MathJax.
  - This syntax may change for Markdown posts in the future.
- "Post" changed to "toot", despite being on version 4.1.3.
- Oatstodon theme, provided by [oat](https://hellsite.site/@oat).
- Various branding assets changed.

Long-term goals:

- Switch to Kramdown over Redcarpet. Redcarpet kinda sucks.
- World domination.

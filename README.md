# types.pl

![blobcatlambda](https://raw.githubusercontent.com/ralsei/types.pl/types.pl/public/favicon.ico)

ʷᵉ'ʳᵉ ᵗʰᵉ ʳᵃᵗˢ
ʷᵉ ʳᵘˡᵉ ᵗʰᵉ ᵗᵘⁿⁿᵉˡˢ

This is the Mastodon fork running on https://types.pl, which itself is a fork of glitch-soc.

Differences from glitch-soc:

- LaTeX support is provided via MathJax, with `\\( this for inline math \\)`, and either `$$ this $$` or `\\[ this \\]` for display math.
  - Additionally supports rendering MathML. This is in place for future work.
- Cherry-picks the [favourite federation fix](https://git.kescher.at/CatCatNya/catstodon/commit/16be9e975b495c43035cda4e82ead2cb5374f700) from [catstodon](https://git.kescher.at/CatCatNya/catstodon).
- "Post" changed to "toot", despite being on version 4.1.3.
- Oatstodon theme, provided by [oat](https://hellsite.site/@oat).
- Various branding assets changed.

Long-term goals:

- Switch to Kramdown over Redcarpet. Redcarpet kinda sucks.
- World domination.

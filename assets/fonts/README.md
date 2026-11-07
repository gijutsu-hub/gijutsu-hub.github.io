# Vendored fonts

Used only by `scripts/build-resume-pdf.ts` to embed type in the themed resume
PDF. They are committed rather than read from the host so the build produces an
identical file on any machine — a CI runner or deploy host has no system fonts
to borrow from.

| File | Family | Licence |
| --- | --- | --- |
| `Lato-*.ttf` | Lato, by Łukasz Dziedzic | SIL Open Font License 1.1 |
| `DejaVuSansMono*.ttf` | DejaVu Sans Mono | Bitstream Vera / Public domain additions |

Both permit embedding and redistribution. The ATS resume does not use these —
it uses Helvetica, a standard PDF font that needs no embedding at all.

# Website alignment verification — 10 October 2026

## Scope and comparison
Prepared ZIP baselines compared against current GitHub main. Urbyte base `30a7e1dddb94609bf4af1a9a34518543823a76d8`; KƎƎLO base `43b036e331a9c5d9ceb9c0e3a342e8893b7852a5`. Refetched both before release preparation; neither main advanced. Changes stay on `alignment/canonical-evidence-20261010`.

## Performed checks
| Check | Result |
| --- | --- |
| HTML parsing of both homepages and proofs page | PASS, lxml HTML parser reports zero errors |
| Duplicate HTML IDs | PASS, none on either homepage |
| JavaScript syntax | PASS, `node --check` and inline script compilation |
| CSS syntax | PASS, css-tree parses inline styles and KƎƎLO stylesheets |
| JSON-LD | PASS, all changed pages parse as JSON |
| Sitemap XML | PASS, both parse; KƎƎLO includes proofs.html |
| Internal links and fragments | PASS, checked local files and Urbyte rewrite mappings on changed pages |
| Evidence links | PASS, 13 linked PDFs present and parse with pypdf |
| Evidence integrity | PASS, all 13 PDFs byte-identical to supplied package; SHA-256 register committed |
| Calculator executable regression | PASS in jsdom, 2,000 services × AUD 50 monthly gives AUD 1,200,000 annual spend and AUD 420,000 illustrative waste; zero-service case gives zero |
| System-map executable regression | PASS in jsdom, all six panels open, Escape closes, page scrolling restored |
| Navigation, imagery and forms | PASS, original nav hrefs, image sources and complete form markup unchanged |
| Homepage inline JavaScript | PASS, byte-equivalent script content preserved |
| Givabit™ spelling | PASS, no incorrect spelling in repository text; no filenames, routes or integration identifiers renamed |
| Whitespace diff | PASS, `git diff --check` |
| Existing build/test commands | Not applicable, static repositories have no package.json or build/test scripts |

## Browser review and regression
Chromium/Playwright checks completed at 1440px desktop, 390px mobile and 320px mobile widths. Both homepages have one H1 and no browser JavaScript errors. Calculator values and all six system-map panels pass in Chromium as well as jsdom. No document-level horizontal overflow remains at the tested widths after narrow mobile grid fixes to Urbyte counters, stats and calculator. The proofs page fits mobile width; all 13 PDF URLs return HTTP 200 with a PDF header from the local server. Desktop/mobile screenshots were inspected.

The initial standard browser downloads failed; a packaged Chromium executable enabled the completed checks. External requests were blocked during screenshots, so remote fonts and Urbyte's external logo were not visually validated. Existing local hero artwork loaded correctly. No external form submission or email dispatch was performed. These checks verify the proposed static pages, not a production deployment.

## Production domain and deployment inspection
Live HTTP checks: `urbyte.com.au/` returns 307, `www.urbyte.com.au/` returns 200, and `keelo.urbyte.com.au/` returns 200 from GitHub. Root canonical, Open Graph URL and structured-data URL now agree with Urbyte's existing www sitemap hostname and Enterprise `/` route. No DNS or domain change.

Urbyte's Vercel project is Git-linked to Urbyte-landing; latest recorded production deployment belongs to existing main. Unspecified Vercel branches deploy by default. The proposed `vercel.json` change disables only this named review branch. Existing rewrites and main deployment behaviour are unchanged. Reference: https://vercel.com/docs/project-configuration/git-configuration

KƎƎLO reports GitHub Pages enabled, has only main before this work, contains its existing CNAME, and has no checked-in Actions workflows. Pages source settings could not be read through the available GitHub access. Main is not updated. No production deployment command or hosting setting mutation is performed.

## Existing behaviour retained
Urbyte's Consumer links currently target `/`; this existing destination is preserved as instructed and therefore returns the Enterprise root. Selecting a distinct Consumer destination requires a separately approved routing change.

The Urbyte homepage has a mailto contact CTA rather than a form. KƎƎLO's existing contact form markup and action are retained. No external enquiries were sent.

## Evidence and assurance
Source PDFs retain titles, dates, historical status and limitations. The data-centre summary and fleet appendix are supporting material, not extra independent proof runs. Submission 48 and the consultation record are public submissions, not endorsements. Existing KƎƎLO exposure copy was aligned to the reports: AUD 616,678.14 and 1,336.136 t CO2-e are estimated exposures, not realised savings or measured reductions. Illustrative application metrics are explicitly labelled.

## Release status
Prepared for separate review pull requests. No merge, force-push, production deployment or DNS modification authorised. Approval remains required before merge/deployment. External logo/font loading and actual contact delivery should be checked in the approved release environment.

# Security policy — reporting a vulnerability in AdapTier

AdapTier is an industrial building-automation platform: edge software installed at customer sites and a central
service at adaptier.io. We want to hear about security problems in either.

## How to report

E-mail **security@styrfabriken.se**, in Swedish or English. Please include:

- what is affected (an edge component, the central service, a customer origin `<name>.adaptier.io`, this website);
- how to reproduce it, and what an attacker could do with it;
- whether you want to be credited, and under which name.

Please do not include customer data you may have come across; describe it instead.

## What we do

- We confirm that we received your report within **5 working days**.
- We assess it, keep you informed, and agree with you on a date for disclosure once a fix is available.
- When a vulnerability is actively exploited, or a severe incident affects the security of our products, we report
  it as the EU Cyber Resilience Act requires, and we inform affected customers.
- Every released version of our software is shipped with a software bill of materials (CycloneDX), so we can tell
  which versions a reported component affects.

## Testing in good faith

Act in good faith: test only against systems you own or are allowed to test, do not access or change other
people's data, do not disrupt a running plant or service, and give us reasonable time to fix a problem before you
make it public. We will not pursue legal action against research done this way.

We do not run a paid bug bounty.

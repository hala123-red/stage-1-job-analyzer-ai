// File: pages/api/analyze-job.js

export default async function handler(req, res) {
  const { jobText } = await req.json(); // For Vercel Edge Functions

  const prompt = `
You are an expert job posting analyst. Given a job description, return the following:

1. A list of categorized red flags (from the Red Flag Library below)
2. A severity score per flag (1–5)
3. A human-readable explanation per flag
4. An overall trust score (0–100)
5. Final recommendation for job seekers

\ud83d\udd0d Use this Red Flag Library for analysis:

[RED FLAG LIBRARY BEGINS]

\ud83d\udccc 1. Missing or Vague Job & Company Info
- No company name listed
- No company website or digital footprint
- No physical office location or region
- No manager, department, or team context
- Overly generic job title (“Coordinator”, “Analyst”)

\ud83d\udccc 2. Posting May Be Pre-Filled or Internally Assigned
- Language like “Preference may be given to...”
- Requirements highly specific to internal systems/processes
- Excessively narrow qualifications
- Ambiguous language suggesting internal preference
- Short posting window (e.g. 5–7 days)
- Post appears during holidays/end-of-semester
- Role posted multiple times with minor title tweaks

\ud83d\udccc 3. Lack of Visibility or Recruitment Effort
- Only posted on an internal or obscure website
- No links on job boards, LinkedIn, or career sites
- No recruiter info or hiring contact

\ud83d\udccc 4. Unclear Responsibilities
- Only vague duties listed
- Missing daily or weekly tasks
- No mention of collaboration, KPIs, tools, or deliverables

\ud83d\udccc 5. Missing or Conflicting Timeline Details
- No posted-on or application deadline
- Unclear contract duration
- Dates contradict language
- No posting date might indicate an old post

\ud83d\udccc 6. Compensation & Benefits Missing or Misleading
- No salary, no benefits
- Commission-only role without warning
- Too wide salary range
- Unusual salary for job type or level
- "Subject to funding" or grant-approval language

\ud83d\udccc 7. Suspicious Application Methods
- Gmail, Yahoo, or personal email
- WhatsApp, Telegram, or SMS for applying
- Google Forms or odd platforms
- No company ATS or official link

\ud83d\udccc 8. Language & Tone Red Flags
- Excessive urgency
- Sloppy formatting or typos
- Unprofessional tone
- Marketing-speak with no substance

\ud83d\udccc 9. Unrealistic or Contradictory Requirements
- "No experience needed" for skilled roles
- Entry level but needs 5+ years experience
- Lists 15+ skills with no context
- Degree and cert requirements don’t match level

\ud83d\udccc 10. Legal/Privacy Omissions
- No EEO, DEI, or visa info
- No privacy disclosures

\ud83d\udccc 11. MLM / Scam / Fraud Markers
- Mentions crypto, gift cards
- Training fee or pay to start
- Franchise or affiliate model
- Requests ID or bank info early

\ud83d\udccc 12. Excessive Emphasis on Funding Source
- "Subject to grant funding"
- "Pending approval"
- No fallback plan or clarity

\ud83d\udcaa Academic Job Posting Red Flags (additional)

SECTION 1: Lack of Role Definition
- No defined research area
- Unclear or missing responsibilities
- No outcomes listed
- No balance of teaching/research

SECTION 2: Missing Structural & Funding Details
- No funding source
- No department, lab, or school
- No PI or supervisor
- No hiring committee/chair

SECTION 3: Lack of Transparency Around Hiring Authority
- No name of hiring authority
- HR refuses to disclose supervisor

SECTION 4: Ghost Job Patterns
- Posting live for months with no changes
- Same text used across titles
- Never publicly filled

SECTION 5: Timeline Irregularities
- No deadline
- Too short deadline
- "Open until filled" without updates
- Application via non-standard method

SECTION 6: Institutional and Contact Discrepancies
- Personal/free emails
- Only posted on obscure third-party sites
- No confirmation of application

Each red flag must include:
- Severity (1–5)
- Explanation
- Recommendation

Now analyze the following job posting:
"""${jobText}"""
`;

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const data = await openaiResponse.json();
  const analysis = data.choices[0].message.content;
  return new Response(JSON.stringify({ analysis }), { status: 200 });
}

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const { name, email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Missing email' }, { status: 400 });
    }

    const resendKey = Deno.env.get('RESEND_API_KEY') ?? '';
    const firstName = name ? name.split(' ')[0] : 'there';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
          .logo { font-size: 24px; font-weight: 700; color: #00e5ff; margin-bottom: 32px; }
          .card { background: #1a1a1a; border-radius: 16px; padding: 32px; margin-bottom: 24px; }
          h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px; }
          .subtitle { color: #888; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .highlight { color: #00e5ff; font-weight: 700; }
          .stat-row { display: flex; gap: 16px; margin: 24px 0; }
          .stat { flex: 1; background: rgba(0,229,255,0.07); border: 1px solid rgba(0,229,255,0.15); border-radius: 12px; padding: 16px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: 800; color: #00e5ff; }
          .stat-label { font-size: 12px; color: #888; margin-top: 4px; }
          .cta { display: block; background: linear-gradient(135deg, #00C9FF, #0077FF); color: #fff; text-align: center; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 16px; text-decoration: none; margin: 24px 0; }
          .footer { color: #555; font-size: 12px; text-align: center; margin-top: 32px; line-height: 1.6; }
          .footer a { color: #00e5ff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">urbyte</div>
          <div class="card">
            <h1>You're on the list, ${firstName}! 🎉</h1>
            <p class="subtitle">
              Welcome to the Urbyte waitlist. You're among the first Australians to claim back what's rightfully yours — the value locked inside your unused mobile data.
            </p>
            <div class="stat-row">
              <div class="stat">
                <div class="stat-number">$1B+</div>
                <div class="stat-label">data wasted yearly in Australia</div>
              </div>
              <div class="stat">
                <div class="stat-number">1GB</div>
                <div class="stat-label">= 10 DBUs in your wallet</div>
              </div>
            </div>
            <p style="color: #888; font-size: 14px; line-height: 1.7;">
              When Urbyte launches, you'll be first in line to start converting your unused data into <span class="highlight">DBUs</span> — digital units you can spend on rewards, cash back, or donate to Australian charities like Beyond Blue, Orange Sky, and 1800RESPECT.
            </p>
          </div>

          <p style="color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
            Want to get even more out of Urbyte from day one? Founding Members get a <span class="highlight">bonus DBU credit</span> and a chance to <span class="highlight">win equity</span> in the company.
          </p>
          <a href="https://urbyte.com.au#founding-member" class="cta">Become a Founding Member →</a>

          <p style="color: #555; font-size: 13px; text-align: center; line-height: 1.6;">
            Urbyte was built by someone who lived through homelessness and mental health struggles — the charities we support aren't random. They're personal.<br><br>
            Thanks for being part of this from the start. 🙏
          </p>

          <div class="footer">
            Urbyte Pty Ltd · <a href="https://urbyte.com.au">urbyte.com.au</a><br>
            Questions? Contact <a href="mailto:jarryd@urbyte.com.au">jarryd@urbyte.com.au</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Urbyte <accounts@urbyte.com.au>',
        to: [email],
        subject: `You're on the Urbyte waitlist, ${firstName}! 🎉`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ sent: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

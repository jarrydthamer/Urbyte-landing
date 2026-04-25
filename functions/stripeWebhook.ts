import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';

const DBU_BONUS: Record<string, number> = {
  bronze: 50,
  silver: 150,
  gold:   350,
};

const TIER_PRICE: Record<string, string> = {
  bronze: '$5/month',
  silver: '$15/month',
  gold:   '$29/month',
};

async function sendReceiptEmail(userEmail: string, userName: string, tier: string, dbuBonus: number, entryNumber: number) {
  const resendKey = Deno.env.get('RESEND_API_KEY') ?? '';
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const price = TIER_PRICE[tier] || '';
  const firstName = userName ? userName.split(' ')[0] : 'there';

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
        .tier-badge { display: inline-block; background: linear-gradient(135deg, #00e5ff, #0066ff); color: #000; font-weight: 700; font-size: 14px; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
        h1 { font-size: 28px; font-weight: 700; margin: 0 0 8px; }
        .subtitle { color: #888; font-size: 15px; margin-bottom: 24px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2a2a2a; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #888; font-size: 14px; }
        .detail-value { font-weight: 600; font-size: 14px; }
        .dbu-highlight { color: #00e5ff; font-size: 18px; font-weight: 700; }
        .entry-number { color: #888; font-size: 13px; margin-top: 24px; }
        .footer { color: #555; font-size: 12px; text-align: center; margin-top: 32px; line-height: 1.6; }
        .footer a { color: #00e5ff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">urbyte</div>
        <div class="card">
          <div class="tier-badge">${tierLabel} Member</div>
          <h1>Welcome, ${firstName}! 🎉</h1>
          <p class="subtitle">You're officially a Founding Member of Urbyte. Here's your receipt.</p>
          <div class="detail-row">
            <span class="detail-label">Plan</span>
            <span class="detail-value">Founding Member — ${tierLabel}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Price</span>
            <span class="detail-value">${price}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">DBU Bonus Credited</span>
            <span class="dbu-highlight">+${dbuBonus} DBUs</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Prize Draw</span>
            <span class="detail-value">✅ Eligible (equity draw)</span>
          </div>
          <p class="entry-number">Founders Entry #${entryNumber} of 50,000</p>
        </div>
        <p style="color: #888; font-size: 14px; line-height: 1.6;">
          Your DBUs are ready in your wallet. You'll be able to redeem them after 3 billing cycles — we'll remind you when the time comes.
        </p>
        <p style="color: #888; font-size: 14px; line-height: 1.6;">
          Thanks for believing in Urbyte from the start. This means everything to us. 🙏
        </p>
        <div class="footer">
          Urbyte Pty Ltd · <a href="https://urbyte.com.au">urbyte.com.au</a><br>
          Questions? Reply to this email or contact <a href="mailto:jarryd@urbyte.com.au">jarryd@urbyte.com.au</a>
        </div>
      </div>
    </body>
    </html>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Urbyte <accounts@urbyte.com.au>',
      to: [userEmail],
      subject: `Welcome to Urbyte, ${firstName}! Your Founding Member receipt 🎉`,
      html,
    }),
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') ?? '';
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } catch (err) {
      return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      const userEmail = meta.user_email;
      const tier = meta.tier;
      const dbuBonus = parseInt(meta.dbu_bonus || '0');
      const userName = meta.user_name || '';

      if (!userEmail || !tier) {
        return Response.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const db = base44.asServiceRole;

      let entryNumber = 1;

      // Check if already a founding member
      const existing = await db.entities.FoundersEntry.filter({ user_email: userEmail });
      if (existing.length === 0) {
        // Get current count for entry number
        const all = await db.entities.FoundersEntry.list();
        entryNumber = (all.length || 0) + 1;

        await db.entities.FoundersEntry.create({
          user_email: userEmail,
          user_name: userName,
          entry_number: entryNumber,
          tier,
          stripe_session_id: session.id,
          prize_draw_eligible: true,
        });

        // Send receipt email to new founding members only
        try {
          await sendReceiptEmail(userEmail, userName, tier, dbuBonus, entryNumber);
        } catch (emailErr) {
          console.error('Email send failed:', emailErr.message);
        }
      }

      // Credit DBU bonus to wallet
      const wallets = await db.entities.Wallet.filter({ user_email: userEmail });
      if (wallets.length > 0) {
        const wallet = wallets[0];
        await db.entities.Wallet.update(wallet.id, {
          dbu_balance: (wallet.dbu_balance || 0) + dbuBonus,
          total_earned: (wallet.total_earned || 0) + dbuBonus,
        });
      } else {
        await db.entities.Wallet.create({
          user_email: userEmail,
          dbu_balance: dbuBonus,
          total_earned: dbuBonus,
          total_redeemed: 0,
          dbu_rate: 10,
        });
      }

      // Log transaction
      await db.entities.Transaction.create({
        user_email: userEmail,
        type: 'bonus',
        amount_dbu: dbuBonus,
        description: `Founding Member ${tier.charAt(0).toUpperCase() + tier.slice(1)} — Welcome bonus`,
        reference_id: session.id,
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

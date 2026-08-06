const db = require('../config/db');

// In-memory fallback for offline mode
const mockProCustomers = new Map();

function buildCheckoutHtml(userId, qrCodeUrl, gpayUrl, isAlreadyPro, expiryDate) {
  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0b0c;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: #141416;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      max-width: 420px;
      width: 100%;
      padding: 30px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .brand {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #4b4b52;
      margin-bottom: 20px;
    }
    .title {
      font-size: 22px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
      color: #ffffff;
    }
    .sub {
      font-size: 12px;
      color: #88888b;
      font-weight: 500;
      margin-bottom: 25px;
    }
    .price-block {
      background: rgba(173, 255, 47, 0.04);
      border: 1px solid rgba(173, 255, 47, 0.15);
      border-radius: 20px;
      padding: 15px;
      margin-bottom: 25px;
    }
    .price {
      font-size: 28px;
      font-weight: 900;
      color: #adff2f;
      letter-spacing: -0.5px;
    }
    .price-term {
      font-size: 11px;
      color: #88888b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 3px;
    }
    .qr-container {
      display: inline-block;
      background: #ffffff;
      padding: 12px;
      border-radius: 22px;
      margin-bottom: 20px;
      box-shadow: 0 0 24px rgba(173, 255, 47, 0.12);
    }
    .qr-img {
      display: block;
      width: 200px;
      height: 200px;
    }
    .info-text {
      font-size: 12px;
      color: #6b6b72;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .upi-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 13px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
    }
    .upi-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #5a5a62;
      margin-bottom: 2px;
      text-align: left;
    }
    .upi-id {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      text-align: left;
    }
    .copy-btn {
      background: rgba(173, 255, 47, 0.08);
      color: #adff2f;
      border: 1px solid rgba(173, 255, 47, 0.18);
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .copy-btn:hover { background: #adff2f; color: #000000; }
    .divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.05);
      margin: 0 0 22px 0;
    }
    .pay-methods {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 22px;
    }
    .gpay-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #1a1a2e;
      border: 1px solid rgba(66, 133, 244, 0.3);
      border-radius: 14px;
      padding: 14px 20px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: #ffffff;
    }
    .gpay-btn:hover {
      background: #1e1e38;
      border-color: rgba(66, 133, 244, 0.6);
      box-shadow: 0 0 16px rgba(66, 133, 244, 0.15);
      transform: translateY(-1px);
    }
    .gpay-btn:active { transform: translateY(0); }
    .gpay-logo {
      display: flex;
      align-items: center;
      gap: 1px;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1;
    }
    .gpay-logo-g { color: #4285F4; }
    .gpay-logo-o1 { color: #EA4335; }
    .gpay-logo-o2 { color: #FBBC04; }
    .gpay-logo-g2 { color: #34A853; }
    .gpay-logo-l { color: #4285F4; }
    .gpay-logo-e { color: #EA4335; }
    .gpay-label {
      font-size: 13px;
      font-weight: 700;
      color: #e8e8f0;
      letter-spacing: 0.2px;
    }
    .gpay-chip {
      margin-left: auto;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #4285F4;
      background: rgba(66, 133, 244, 0.1);
      border: 1px solid rgba(66, 133, 244, 0.2);
      padding: 3px 7px;
      border-radius: 6px;
    }
    .or-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      color: #3a3a42;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .or-divider::before, .or-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.05);
    }
    .form-group {
      text-align: left;
      margin-bottom: 16px;
    }
    .form-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b6b72;
      display: block;
      margin-bottom: 8px;
    }
    .form-input {
      width: 100%;
      background: #1c1c1e;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      padding: 14px 16px;
      color: #ffffff;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 2px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus {
      border-color: rgba(173, 255, 47, 0.4);
      box-shadow: 0 0 0 3px rgba(173, 255, 47, 0.06);
    }
    .form-input::placeholder { color: #3a3a40; letter-spacing: 1px; }
    .submit-btn {
      width: 100%;
      background: #adff2f;
      color: #000000;
      border: none;
      border-radius: 14px;
      padding: 15px;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(173, 255, 47, 0.2);
    }
    .submit-btn:hover { background: #c0ff50; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(173, 255, 47, 0.3); }
    .submit-btn:active { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .error-banner {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.15);
      color: #ef4444;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      display: none;
      text-align: left;
    }
    .success-tick {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(173, 255, 47, 0.08);
      border: 2px solid rgba(173, 255, 47, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px auto 22px;
      color: #adff2f;
      font-size: 28px;
    }
    .success-screen { display: none; }
    .success-title {
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .success-sub {
      font-size: 12px;
      color: #6b6b72;
      line-height: 1.7;
      margin-bottom: 25px;
    }
    .close-btn {
      width: 100%;
      background: #1c1c1e;
      color: #6b6b72;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 14px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover { background: #222224; color: #aaaaaa; }
  `;

  const alreadyProHtml = `
    <div class="success-tick">&#10003;</div>
    <div class="success-title">Already PRO</div>
    <div class="success-sub">
      Your OnlyGains PRO membership is active.<br>
      Subscription expires: <strong style="color:#adff2f;">${expiryDate}</strong>
    </div>
    <button onclick="window.close()" class="close-btn">Close Window</button>
  `;

  const checkoutHtml = `
    <div id="checkoutForm">
      <div class="brand">OnlyGains</div>
      <div class="title">PRO Membership</div>
      <div class="sub">Unlock cumulative graphs & premium analytics</div>

      <div class="price-block">
        <div class="price">&#8377;120.00</div>
        <div class="price-term">per month</div>
      </div>

      <p class="info-text">Scan the QR code or tap Google Pay to make the &#8377;120 payment:</p>

      <div class="qr-container">
        <img class="qr-img" src="${qrCodeUrl}" alt="UPI QR Code" onerror="this.style.display='none'; document.getElementById('qrFallback').style.display='flex';">
        <div id="qrFallback" style="display:none; width:200px; height:200px; align-items:center; justify-content:center; flex-direction:column; gap:8px; color:#6b6b72; font-size:11px;">
          <div style="font-size:32px;">&#128247;</div>
          Use UPI ID below
        </div>
      </div>

      <div class="upi-box">
        <div>
          <div class="upi-label">UPI ID</div>
          <div class="upi-id">abc@okaxis</div>
        </div>
        <button type="button" class="copy-btn" id="copyBtn">Copy</button>
      </div>

      <div class="pay-methods">
        <a id="gpayBtn" class="gpay-btn" href="${gpayUrl}" onclick="return handleGpay(event)">
          <div class="gpay-logo">
            <span class="gpay-logo-g">G</span><span class="gpay-logo-o1">o</span><span class="gpay-logo-o2">o</span><span class="gpay-logo-g2">g</span><span class="gpay-logo-l">l</span><span class="gpay-logo-e">e</span>
          </div>
          <div class="gpay-label">Pay with Google Pay</div>
          <span class="gpay-chip">App</span>
        </a>
      </div>

      <div class="or-divider">After payment, enter ref number below</div>

      <div class="error-banner" id="errorBanner"></div>

      <form id="paymentForm">
        <div class="form-group">
          <label class="form-label">UPI Transaction UTR / Ref No.</label>
          <input type="text" class="form-input" id="utrInput" required placeholder="000000000000" maxlength="12" inputmode="numeric" pattern="[0-9]{12}">
        </div>
        <button type="submit" class="submit-btn" id="submitBtn">Activate PRO &rarr;</button>
      </form>
    </div>

    <div class="success-screen" id="successScreen">
      <div class="success-tick">&#10003;</div>
      <div class="success-title">You're PRO!</div>
      <div class="success-sub">
        Welcome to OnlyGains PRO.<br>
        Close this window and refresh the app to see your benefits.
      </div>
      <button onclick="window.close()" class="close-btn">Close Window</button>
    </div>

    <script>
      document.getElementById('copyBtn').addEventListener('click', function() {
        navigator.clipboard.writeText('abc@okaxis');
        this.textContent = 'Copied!';
        var self = this;
        setTimeout(function() { self.textContent = 'Copy'; }, 1500);
      });

      document.getElementById('paymentForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var utr = document.getElementById('utrInput').value.trim();
        var errorBanner = document.getElementById('errorBanner');
        var submitBtn = document.getElementById('submitBtn');

        errorBanner.style.display = 'none';

        if (!/^[0-9]{12}$/.test(utr)) {
          errorBanner.textContent = 'UTR must be exactly 12 numeric digits.';
          errorBanner.style.display = 'block';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';

        try {
          var res = await fetch('/api/pay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: '${userId}', utrNumber: utr })
          });
          var data = await res.json();
          if (res.ok && data.ok) {
            if (window.opener) window.opener.postMessage({ type: 'PAYMENT_SUCCESS' }, '*');
            document.getElementById('checkoutForm').style.display = 'none';
            document.getElementById('successScreen').style.display = 'block';
          } else {
            errorBanner.textContent = data.error || 'Verification failed. Double-check your UTR.';
            errorBanner.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Activate PRO \u2192';
          }
        } catch (err) {
          errorBanner.textContent = 'Network error. Please try again.';
          errorBanner.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Activate PRO \u2192';
        }
      });

      function handleGpay(e) {
        var ua = navigator.userAgent || '';
        var isAndroid = /Android/i.test(ua);
        var isIOS = /iPhone|iPad|iPod/i.test(ua);

        if (isAndroid) {
          // Try tez:// deep link first, fall back to Android intent
          var started = false;
          var timeout = setTimeout(function() {
            if (!started) {
              // Fallback: Android intent URI that opens Play Store if GPay not installed
              window.location = 'intent://upi/pay?pa=abc%40okaxis&pn=OnlyGains%20PRO&am=120.00&cu=INR#Intent;scheme=tez;package=com.google.android.apps.nbu.paisa.user;end';
            }
          }, 800);
          document.addEventListener('visibilitychange', function() { started = true; clearTimeout(timeout); }, { once: true });
          return true; // allow href=tez:// to fire
        } else if (isIOS) {
          // iOS GPay doesn't support UPI — open generic UPI link instead
          window.location = '${gpayUrl}'.replace('tez://', 'upi://');
          e.preventDefault();
          return false;
        } else {
          // Desktop — show a tooltip
          e.preventDefault();
          var btn = document.getElementById('gpayBtn');
          btn.querySelector('.gpay-label').textContent = 'Open on your phone';
          setTimeout(function() { btn.querySelector('.gpay-label').textContent = 'Pay with Google Pay'; }, 2000);
          return false;
        }
      }
    </script>
  `;

  const body = isAlreadyPro ? alreadyProHtml : checkoutHtml;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OnlyGains PRO</title>
  <style>${css}</style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}

exports.getPayPage = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send('<p style="color:red;padding:40px;font-family:sans-serif;">Missing userId. Return to the app and click Upgrade again.</p>');
  }

  const isDb = db.isDbAvailable() && db.getPool();
  let isAlreadyPro = false;
  let expiryDate = '';

  if (isDb) {
    const client = await db.getPool().connect();
    try {
      const profileRes = await client.query('SELECT user_id FROM fittrack_profiles WHERE user_id = $1', [userId]);
      if (profileRes.rows.length === 0) {
        return res.status(404).send('<p style="color:red;padding:40px;font-family:sans-serif;">Profile not found. Complete onboarding in the app first.</p>');
      }
      const proRes = await client.query(
        "SELECT expires_at FROM fittrack_pro_customers WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()",
        [userId]
      );
      isAlreadyPro = proRes.rows.length > 0;
      expiryDate = isAlreadyPro ? new Date(proRes.rows[0].expires_at).toLocaleDateString('en-IN') : '';
    } catch (err) {
      console.error('[Database Error] Failed to read subscription details:', err);
    } finally {
      client.release();
    }
  } else {
    isAlreadyPro = mockProCustomers.has(userId) && mockProCustomers.get(userId).expiresAt > Date.now();
    expiryDate = isAlreadyPro ? new Date(mockProCustomers.get(userId).expiresAt).toLocaleDateString('en-IN') : '';
  }

  const upiId = 'abc@okaxis';
  const upiUrl = 'upi://pay?pa=' + upiId + '&pn=OnlyGains%20PRO&am=120.00&cu=INR&tn=OG-' + userId.substring(0, 8);
  const gpayUrl = 'tez://upi/pay?pa=' + upiId + '&pn=OnlyGains%20PRO&am=120.00&cu=INR&tn=OG-' + userId.substring(0, 8);
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&color=000000&bgcolor=ffffff&data=' + encodeURIComponent(upiUrl);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(buildCheckoutHtml(userId, qrCodeUrl, gpayUrl, isAlreadyPro, expiryDate));
};

exports.verifyPayment = async (req, res) => {
  const { userId, utrNumber } = req.body;
  if (!userId || !utrNumber) {
    return res.status(400).json({ error: 'userId and utrNumber are required.' });
  }

  if (!/^\d{12}$/.test(utrNumber)) {
    return res.status(400).json({ error: 'Transaction Ref Number (UTR) must be exactly 12 digits.' });
  }

  const isDb = db.isDbAvailable() && db.getPool();
  if (isDb) {
    const client = await db.getPool().connect();
    try {
      const duplicateCheck = await client.query(
        'SELECT user_id FROM fittrack_pro_customers WHERE utr_number = $1',
        [utrNumber]
      );
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ error: 'This UTR has already been used!' });
      }

      await client.query(
        'INSERT INTO fittrack_pro_customers (user_id, status, utr_number, amount, subscribed_at, expires_at, updated_at) ' +
        'VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL \'30 days\', NOW()) ' +
        'ON CONFLICT (user_id) ' +
        'DO UPDATE SET status = EXCLUDED.status, ' +
        '              utr_number = EXCLUDED.utr_number, ' +
        '              amount = EXCLUDED.amount, ' +
        '              subscribed_at = NOW(), ' +
        '              expires_at = NOW() + INTERVAL \'30 days\', ' +
        '              updated_at = NOW()',
        [userId, 'active', utrNumber, 120.00]
      );

      res.json({ ok: true });
    } catch (error) {
      console.error('[Error] Payment verification failed:', error);
      res.status(500).json({ error: 'Internal database error' });
    } finally {
      client.release();
    }
  } else {
    for (const [, val] of mockProCustomers.entries()) {
      if (val.utrNumber === utrNumber) {
        return res.status(400).json({ error: 'This UTR has already been used!' });
      }
    }
    mockProCustomers.set(userId, {
      utrNumber,
      amount: 120.00,
      subscribedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    });
    res.json({ ok: true });
  }
};

exports.isMockPro = (userId) => {
  return mockProCustomers.has(userId) && mockProCustomers.get(userId).expiresAt > Date.now();
};

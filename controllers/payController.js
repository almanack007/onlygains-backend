const db = require('../config/db');

// In-memory fallback for offline mode
const mockProCustomers = new Map();

exports.getPayPage = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send(`
      <div style="background:#121212;color:#ff4b4b;padding:40px;text-align:center;font-family:sans-serif;min-height:100vh;">
        <h2>Error: userId is required in query string.</h2>
        <p>Close this window and try clicking "Upgrade to PRO" again from the app.</p>
      </div>
    `);
  }

  const isDb = db.isDbAvailable() && db.getPool();
  let isAlreadyPro = false;
  let expiryDate = '';

  if (isDb) {
    const client = await db.getPool().connect();
    try {
      // 1. Verify user profile exists
      const profileRes = await client.query('SELECT user_id FROM fittrack_profiles WHERE user_id = $1', [userId]);
      if (profileRes.rows.length === 0) {
        return res.status(404).send(`
          <div style="background:#121212;color:#ff4b4b;padding:40px;text-align:center;font-family:sans-serif;min-height:100vh;">
            <h2>Error: Profile not found for User ID "${userId}".</h2>
            <p>Please complete onboarding in OnlyGains app before upgrading.</p>
          </div>
        `);
      }

      // 2. Check if already active PRO
      const proRes = await client.query(
        "SELECT expires_at FROM fittrack_pro_customers WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()",
        [userId]
      );
      isAlreadyPro = proRes.rows.length > 0;
      expiryDate = isAlreadyPro ? new Date(proRes.rows[0].expires_at).toLocaleDateString() : '';
    } catch (err) {
      console.error('[Database Error] Failed to read subscription details:', err);
    } finally {
      client.release();
    }
  } else {
    // Offline / Mock Mode
    isAlreadyPro = mockProCustomers.has(userId) && mockProCustomers.get(userId).expiresAt > Date.now();
    expiryDate = isAlreadyPro ? new Date(mockProCustomers.get(userId).expiresAt).toLocaleDateString() : '';
  }

  const upiUrl = "upi://pay?pa=abc@okaxis&pn=OnlyGains%20PRO&am=120.00&cu=INR&tn=OG-" + userId.substring(0, 8);
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=" + encodeURIComponent(upiUrl);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OnlyGains PRO Checkout</title>
      <style>
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
        .title {
          font-size: 20px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pro-star {
          color: #fbbf24;
          filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.6));
        }
        .sub {
          font-size: 12px;
          color: #88888b;
          font-weight: bold;
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
          font-size: 24px;
          font-weight: 900;
          color: #adff2f;
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
          padding: 10px;
          border-radius: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(173, 255, 47, 0.15);
        }
        .qr-img {
          display: block;
          width: 200px;
          height: 200px;
        }
        .info-text {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .upi-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 12px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }
        .upi-id {
          font-family: monospace;
          font-size: 13px;
          font-weight: bold;
          color: #ffffff;
        }
        .copy-btn {
          background: rgba(173, 255, 47, 0.1);
          color: #adff2f;
          border: 1px solid rgba(173, 255, 47, 0.2);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .copy-btn:hover {
          background: #adff2f;
          color: #000000;
        }
        .form-group {
          text-align: left;
          margin-bottom: 20px;
        }
        .form-label {
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #a1a1aa;
          display: block;
          margin-bottom: 8px;
        }
        .form-input {
          width: 100%;
          background: #1e1e20;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px 16px;
          color: #ffffff;
          font-family: monospace;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 1px;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: #adff2f;
        }
        .submit-btn {
          width: 100%;
          background: #adff2f;
          color: #000000;
          border: none;
          border-radius: 16px;
          padding: 15px;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(173, 255, 47, 0.25);
        }
        .submit-btn:hover {
          background: #9eff1a;
          transform: translateY(-1px);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 12px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
          display: none;
        }
        .success-screen {
          display: none;
        }
        .success-tick {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(173, 255, 47, 0.12);
          border: 2px solid #adff2f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto;
          color: #adff2f;
          font-size: 32px;
          font-weight: bold;
          filter: drop-shadow(0 0 10px rgba(173,255,47,0.3));
        }
        .success-title {
          font-size: 22px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .success-sub {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.6;
          margin-bottom: 25px;
        }
      </style>
    </head>
    <body>
      <div class="card" id="mainCard">
        \${isAlreadyPro ? \`
          <div class="success-tick">&#10003;</div>
          <div class="success-title">Already PRO</div>
          <div class="success-sub">
            Your account is currently upgraded to OnlyGains PRO.<br>
            Active Subscription Expires: <strong style="color:#adff2f;">\${expiryDate}</strong>
          </div>
          <button onclick="window.close()" class="submit-btn" style="background:#2c2c2e;color:#ffffff;box-shadow:none;">Close Window</button>
        \` : \`
          <div id="checkoutForm">
            <div class="title"><span class="pro-star">&#9733;</span> OnlyGains PRO</div>
            <div class="sub">Upgrade to Premium Analytics</div>

            <div class="price-block">
              <div class="price">₹120.00</div>
              <div class="price-term">1-Month Membership</div>
            </div>

            <p class="info-text">
              Scan the QR code below inside any UPI app (GPay, PhonePe, Paytm) to make the payment:
            </p>

            <div class="qr-container">
              <img class="qr-img" src="\${qrCodeUrl}" alt="UPI QR Code">
            </div>

            <div class="upi-box">
              <span class="upi-id">abc@okaxis</span>
              <button type="button" class="copy-btn" id="copyBtn">Copy ID</button>
            </div>

            <div class="error-banner" id="errorBanner"></div>

            <form id="paymentForm">
              <div class="form-group">
                <label class="form-label">Enter 12-Digit UPI UTR / Ref Number</label>
                <input type="text" class="form-input" id="utrInput" required placeholder="e.g. 123456789012" maxlength="12" pattern="\\\\d{12}">
              </div>
              <button type="submit" class="submit-btn" id="submitBtn">Activate PRO Plan</button>
            </form>
          </div>

          <div class="success-screen" id="successScreen">
            <div class="success-tick">&#10003;</div>
            <div class="success-title">Upgrade Complete!</div>
            <div class="success-sub">
              Congratulations! You are now an OnlyGains PRO subscriber.<br><br>
              Please close this page, return to your app, and refresh to unlock your premium benefits.
            </div>
            <button onclick="window.close()" class="submit-btn" style="background:#2c2c2e;color:#ffffff;box-shadow:none;">Close Window</button>
          </div>
        \`}
      </div>

      <script>
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('abc@okaxis');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy ID'; }, 1500);
          });
        }

        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
          paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const utr = document.getElementById('utrInput').value.trim();
            const errorBanner = document.getElementById('errorBanner');
            const submitBtn = document.getElementById('submitBtn');

            errorBanner.style.display = 'none';

            if (!/^[0-9]{12}$/.test(utr)) {
              errorBanner.textContent = 'UTR must be exactly 12 numeric digits.';
              errorBanner.style.display = 'block';
              return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying Transaction...';

            try {
              const res = await fetch('/api/pay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: '\${userId}', utrNumber: utr })
              });
              
              const data = await res.json();
              if (res.ok && data.ok) {
                if (window.opener) {
                  window.opener.postMessage({ type: 'PAYMENT_SUCCESS' }, '*');
                }
                document.getElementById('checkoutForm').style.display = 'none';
                document.getElementById('successScreen').style.display = 'block';
              } else {
                errorBanner.textContent = data.error || 'Verification failed. Double check your UTR number.';
                errorBanner.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Activate PRO Plan';
              }
            } catch (err) {
              errorBanner.textContent = 'Network error. Please try again.';
              errorBanner.style.display = 'block';
              submitBtn.disabled = false;
              submitBtn.textContent = 'Activate PRO Plan';
            }
          });
        }
      </script>
    </body>
    </html>
  `);
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
        return res.status(400).json({ error: 'This Transaction Ref (UTR) has already been used!' });
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
    // Offline Mode Fallback
    for (const [key, val] of mockProCustomers.entries()) {
      if (val.utrNumber === utrNumber) {
        return res.status(400).json({ error: 'This Transaction Ref (UTR) has already been used!' });
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

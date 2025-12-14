async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    let errText = 'Request failed';
    try {
      if (ct.includes('application/json')) {
        const j = await res.json();
        errText = j.error || JSON.stringify(j);
      } else {
        errText = await res.text();
      }
    } catch {}
    throw new Error(errText);
  }
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

function bindLoginRegister() {
  const regForm = document.getElementById('registerForm');
  const regEmail = document.getElementById('regEmail');
  const regPassword = document.getElementById('regPassword');
  const regRole = document.getElementById('regRole');
  const regStatus = document.getElementById('regStatus');
  const loginBtn = document.getElementById('loginBtn');
  const meBox = document.getElementById('meBox');
  async function loadMe() {
    try {
      const r = await api('/api/auth/me');
      meBox.textContent = `ID: ${r.user.id} • ${r.user.email} • ${r.user.role}`;
    } catch {
      meBox.textContent = 'Not logged in';
    }
  }
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const r = await api('/api/auth/register', { method: 'POST', body: { email: regEmail.value, password: regPassword.value, role: regRole.value } });
      regStatus.textContent = 'Registered';
      await loadMe();
    } catch (err) {
      regStatus.textContent = err.message;
    }
  });
  loginBtn.addEventListener('click', async () => {
    try {
      const r = await api('/api/auth/login', { method: 'POST', body: { email: regEmail.value, password: regPassword.value } });
      regStatus.textContent = 'Logged in';
      await loadMe();
    } catch (err) {
      regStatus.textContent = err.message;
    }
  });
  loadMe();
}

function showProfile() {
  const box = document.getElementById('profileBox');
  (async () => {
    try {
      const r = await api('/api/auth/me');
      box.textContent = `Email: ${r.user.email} • Role: ${r.user.role}`;
    } catch {
      box.textContent = 'Not logged in';
    }
  })();
}

window.bindLoginRegister = bindLoginRegister;
window.showProfile = showProfile;

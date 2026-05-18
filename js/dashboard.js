// ── Data Sensor (ganti dengan Firebase realtime jika sudah siap) ──
let sensors = JSON.parse(localStorage.getItem('sensorNames')) || [
  { id: 'sensor_1', name: 'Suhu Ruangan',  icon: '🌡️', value: 28.4, unit: '°C',  status: 'normal'  },
  { id: 'sensor_2', name: 'Kelembapan',    icon: '💧', value: 65,   unit: '%',   status: 'normal'  },
  { id: 'sensor_3', name: 'Kualitas Udara',icon: '🌬️', value: 142,  unit: 'ppm', status: 'warning' },
  { id: 'sensor_4', name: 'Cahaya',        icon: '☀️', value: 890,  unit: 'lux', status: 'normal'  },
];

// ── Riwayat (dummy — ganti dengan Firestore query) ──
let history = JSON.parse(localStorage.getItem('sensorHistory')) || [];

function addHistoryEntry(sensor) {
  const entry = {
    waktu: new Date().toLocaleString('id-ID'),
    nama: sensor.name,
    nilai: sensor.value,
    satuan: sensor.unit,
    status: sensor.status,
  };
  history.unshift(entry);
  if (history.length > 200) history.pop();
  localStorage.setItem('sensorHistory', JSON.stringify(history));
}

// ── Navigasi Section ──
const navItems  = document.querySelectorAll('.nav-item');
const sections  = document.querySelectorAll('.section');
const topbarTitle = document.getElementById('topbarTitle');

function showSection(name) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  document.getElementById('section-' + name).classList.add('active');
  document.querySelector(`[data-section="${name}"]`).classList.add('active');
  topbarTitle.textContent = name.charAt(0).toUpperCase() + name.slice(1);

  if (name === 'riwayat') renderRiwayat();
  if (name === 'pengaturan') renderPengaturan();
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    showSection(item.dataset.section);
  });
});

// ── Sidebar Toggle ──
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

document.getElementById('sidebarToggle').addEventListener('click', () => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    sidebar.classList.toggle('open');
  } else {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
  }
});

// ── Jam Realtime ──
function updateClock() {
  document.getElementById('topbarTime').textContent =
    new Date().toLocaleTimeString('id-ID');
}
setInterval(updateClock, 1000);
updateClock();

// ── Render Sensor ──
function renderSensors() {
  const grid = document.getElementById('sensorGrid');
  grid.innerHTML = sensors.map(s => `
    <div class="sensor-card">
      <div class="sensor-card-icon">${s.icon}</div>
      <div class="sensor-card-name">${s.name}</div>
      <div>
        <span class="sensor-card-value">${s.value}</span>
        <span class="sensor-card-unit">${s.unit}</span>
      </div>
      <span class="sensor-card-status status-${s.status}">
        ${s.status === 'normal' ? 'Normal' : s.status === 'warning' ? 'Peringatan' : 'Bahaya'}
      </span>
    </div>
  `).join('');
}

// ── Simulasi update nilai sensor tiap 5 detik ──
function simulateValues() {
  sensors = sensors.map(s => {
    let delta = (Math.random() - 0.5) * 2;
    let newVal = parseFloat((s.value + delta).toFixed(1));

    let status = 'normal';
    if (s.unit === '°C'  && newVal > 35) status = 'danger';
    else if (s.unit === '°C'  && newVal > 30) status = 'warning';
    else if (s.unit === 'ppm' && newVal > 200) status = 'danger';
    else if (s.unit === 'ppm' && newVal > 100) status = 'warning';

    const updated = { ...s, value: newVal, status };
    addHistoryEntry(updated);
    return updated;
  });

  renderSensors();
}

renderSensors();
setInterval(simulateValues, 5000);

// ── Render Riwayat ──
function renderRiwayat(filter = '') {
  const tbody = document.getElementById('riwayatBody');
  const data  = filter
    ? history.filter(h =>
        h.nama.toLowerCase().includes(filter.toLowerCase()) ||
        String(h.nilai).includes(filter)
      )
    : history;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#aaa;padding:32px">Belum ada data</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(h => `
    <tr>
      <td>${h.waktu}</td>
      <td>${h.nama}</td>
      <td>${h.nilai}</td>
      <td>${h.satuan}</td>
      <td><span class="sensor-card-status status-${h.status}">
        ${h.status === 'normal' ? 'Normal' : h.status === 'warning' ? 'Peringatan' : 'Bahaya'}
      </span></td>
    </tr>
  `).join('');
}

document.getElementById('searchRiwayat').addEventListener('input', e => {
  renderRiwayat(e.target.value);
});

// Export CSV
document.getElementById('exportBtn').addEventListener('click', () => {
  const header = 'Waktu,Sensor,Nilai,Satuan,Status\n';
  const rows   = history.map(h =>
    `"${h.waktu}","${h.nama}",${h.nilai},${h.satuan},${h.status}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `riwayat-sensor-${Date.now()}.csv`;
  a.click();
});

// ── Render Pengaturan ──
function renderPengaturan() {
  const list = document.getElementById('settingsList');
  list.innerHTML = sensors.map((s, i) => `
    <div class="setting-item">
      <span class="setting-item-icon">${s.icon}</span>
      <span class="setting-item-id">${s.id}</span>
      <input
        class="setting-item-input"
        type="text"
        value="${s.name}"
        data-index="${i}"
        placeholder="Nama sensor..."
      />
    </div>
  `).join('');
}

document.getElementById('saveNamesBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('.setting-item-input');
  inputs.forEach(input => {
    const i = parseInt(input.dataset.index);
    sensors[i].name = input.value.trim() || sensors[i].name;
  });

  localStorage.setItem('sensorNames', JSON.stringify(sensors));
  renderSensors();

  const msg = document.getElementById('saveMsg');
  msg.textContent = '✓ Perubahan berhasil disimpan';
  setTimeout(() => msg.textContent = '', 3000);
});

// ── Logout ──
document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = 'login.html';
});
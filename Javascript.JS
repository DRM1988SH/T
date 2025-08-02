const splash = document.getElementById('splash');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const settingsBtn = document.getElementById('settingsBtn');

let currentUser = null;
let invoiceNumber = 1;
const entries = [];

const users = [
  { jobNumber: '70062', role: 'admin', location: 'الموقع الرئيسي' },
  { jobNumber: '80001', role: 'user', location: 'مدينة زايد' },
  { jobNumber: '80002', role: 'user', location: 'مدينة غياثي' },
];

// Splash
setTimeout(() => {
  splash.classList.remove('active');
  loginScreen.classList.add('active');
}, 2000);

// تسجيل الدخول
function login() {
  const input = document.getElementById('jobNumber').value;
  const user = users.find(u => u.jobNumber === input);

  if (user) {
    currentUser = user;
    showScreen('dashboard');
    if (user.role !== 'admin') settingsBtn.style.display = 'none';
    else settingsBtn.style.display = 'inline-block';
  } else {
    alert('رقم الوظيفة غير صحيح');
  }
}

function logout() {
  currentUser = null;
  showScreen('loginScreen');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function generateOptions(start, end) {
  return Array.from({length: end - start + 1}, (_, i) =>
    `<option value="${start + i}">${start + i}</option>`
  ).join('');
}

function openInputScreen() {
  const screen = document.createElement('div');
  screen.id = 'inputScreen';
  screen.className = 'screen active';

  const loc = currentUser.role === 'admin'
    ? `<select id="inputLocation">
         <option>الموقع الرئيسي</option>
         <option>مدينة زايد</option>
         <option>مدينة غياثي</option>
       </select>`
    : `<p><strong>الموقع:</strong> ${currentUser.location}</p>`;

  screen.innerHTML = `
    <div class="card">
      <h2>إدخال البيانات</h2>
      ${loc}
      <input type="text" id="clientName" placeholder="اسم المتعامل" />
      <input type="text" id="phoneNumber" placeholder="رقم التلفون" />
      <p><strong>رقم الفاتورة:</strong> ${invoiceNumber}</p>
      <select id="slaughterNumber">${generateOptions(1, 1000)}</select>
      <select id="stickerNumber">${generateOptions(1, 1000)}</select>
      <select id="animalType">
        <option>خروف</option>
        <option>ماعز</option>
        <option>بقر</option>
        <option>عجل صغير</option>
        <option>حوار صغير</option>
        <option>جمل</option>
      </select>
      <select id="cuttingType">
        <option>عزيمة</option>
        <option>ثلاجة</option>
        <option>كامل</option>
      </select>
      <input type="number" id="price" placeholder="سعر الخدمة" />
      <p><strong>الإجمالي:</strong> <span id="totalAmount">0</span> درهم</p>
      <div>
        <label><input type="radio" name="payment" value="بطاقة" checked /> بطاقة</label>
        <label><input type="radio" name="payment" value="نقدي" /> نقدي</label>
      </div>
      <button onclick="submitEntry()">إضافة وترحيل</button>
      <button onclick="printSticker()">🖨️ طباعة الاستيكر</button>
      <button onclick="printInvoice()">🧾 طباعة الفاتورة</button>
      <hr />
      <button onclick="showScreen('clientsScreen')">📋 تقرير المتعاملين</button>
      <button onclick="showScreen('reportScreen')">📊 التقرير الإحصائي</button>
      <button onclick="showScreen('dashboard')">🔙 القائمة الرئيسية</button>
    </div>
  `;

  document.getElementById('app').innerHTML = '';
  document.getElementById('app').appendChild(screen);

  document.getElementById('price').addEventListener('input', e => {
    const total = parseFloat(e.target.value || 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
  });
}

function submitEntry() {
  const name = document.getElementById('clientName').value;
  const phone = document.getElementById('phoneNumber').value;
  const price = parseFloat(document.getElementById('price').value || 0);
  const location = currentUser.role === 'admin'
    ? document.getElementById('inputLocation').value
    : currentUser.location;
  const payment = document.querySelector('input[name="payment"]:checked').value;

  entries.push({ name, phone, invoice: invoiceNumber, location, price, payment });

  updateTables();
  invoiceNumber++;
  openInputScreen();
}

function updateTables() {
  const clientBody = document.querySelector('#clientsTable tbody');
  const reportBody = document.querySelector('#reportTable tbody');
  clientBody.innerHTML = '';
  reportBody.innerHTML = '';

  entries.forEach(entry => {
    clientBody.innerHTML += `
      <tr>
        <td>${entry.name}</td>
        <td>${entry.phone}</td>
        <td>${entry.invoice}</td>
        <td>${entry.location}</td>
        <td>${entry.price} درهم</td>
      </tr>`;
    reportBody.innerHTML += `
      <tr>
        <td>${entry.invoice}</td>
        <td>${entry.location}</td>
        <td>${entry.name}</td>
        <td>${entry.price} درهم</td>
        <td>${entry.payment}</td>
      </tr>`;
  });
}

function printSticker() {
  alert('🖨️ طباعة الاستيكر - تحت التطوير');
}

function printInvoice() {
  alert('🧾 طباعة الفاتورة - تحت التطوير');
}

// ======== المتغيرات الأساسية ========
const splash = document.getElementById('splash');
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const settingsScreen = document.getElementById('settingsScreen');
const inputScreen = document.getElementById('inputScreen');
const clientsScreen = document.getElementById('clientsScreen');
const reportScreen = document.getElementById('reportScreen');
const logoutBtn = document.getElementById('logoutBtn');
const settingsBtn = document.getElementById('settingsBtn');

let currentUser = null;
let invoiceNumber = 1;
let entries = [];

const defaultCuttingTypes = ['عزيمة', 'ثلاجة', 'كامل'];

let cuttingTypes = [...defaultCuttingTypes];

const users = [
  { jobNumber: '70062', role: 'admin', location: 'الموقع الرئيسي' },
  { jobNumber: '80001', role: 'user', location: 'مدينة زايد' },
  { jobNumber: '80002', role: 'user', location: 'مدينة غياثي' },
];

// ======== شاشة الترحيب - بعد ثانيتين تظهر تسجيل الدخول ========
setTimeout(() => {
  splash.classList.remove('active');
  loginScreen.classList.add('active');
}, 2000);

// ======== دالة تسجيل الدخول ========
function login() {
  const inputJob = document.getElementById('jobNumber').value.trim();
  const user = users.find(u => u.jobNumber === inputJob);

  if (!user) {
    alert('رقم الوظيفة غير صحيح');
    return;
  }

  currentUser = user;
  invoiceNumber = 1; // اعادة ضبط رقم الفاتورة عند تسجيل دخول جديد
  entries = [];

  // اظهار القائمة الرئيسية
  showScreen('dashboard');

  // عرض بيانات المستخدم
  document.getElementById('userInfo').textContent =
    `مرحبا، رقم الوظيفة: ${user.jobNumber} - الموقع: ${user.location}`;

  // عرض زر الإعدادات فقط للمشرف
  if (user.role === 'admin') {
    settingsBtn.style.display = 'inline-block';
  } else {
    settingsBtn.style.display = 'none';
  }
}

// ======== دالة عرض شاشة ========
function showScreen(screenId) {
  // اخفاء كل الشاشات
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  // اظهار الشاشة المطلوبة
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
}

// ======== حدث تسجيل الدخول ========
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});

// ======== التنقل في القوائم ========
document.getElementById('btnInput').addEventListener('click', () => {
  renderInputForm();
  showScreen('inputScreen');
});

document.getElementById('btnClients').addEventListener('click', () => {
  renderClientsReport();
  showScreen('clientsScreen');
});

document.getElementById('btnReport').addEventListener('click', () => {
  renderStatisticsReport();
  showScreen('reportScreen');
});

settingsBtn.addEventListener('click', () => {
  renderSettings();
  showScreen('settingsScreen');
});

logoutBtn.addEventListener('click', () => {
  if (confirm('هل تريد تسجيل الخروج؟')) {
    currentUser = null;
    entries = [];
    showScreen('loginScreen');
  }
});

// ======== دالة إنشاء نموذج إدخال البيانات ========
function renderInputForm() {
  inputScreen.innerHTML = `
    <h2>إدخال بيانات المتعامل</h2>
    <form id="dataEntryForm">
      <label for="invoiceNo">رقم الفاتورة</label>
      <input type="number" id="invoiceNo" value="${invoiceNumber}" readonly />

      <label for="clientName">اسم المتعامل</label>
      <input type="text" id="clientName" placeholder="اسم المتعامل" required autocomplete="off" />

      <label for="phoneNumber">رقم التلفون</label>
      <input type="tel" id="phoneNumber" placeholder="رقم التلفون" required autocomplete="off" pattern="\\d{8,12}" title="ادخل رقم هاتف صحيح" />

      <label for="animalNo">رقم الذبيحة</label>
      <input type="text" id="animalNo" placeholder="رقم الذبيحة" required autocomplete="off" />

      <label for="stickerNo">رقم الاستيكر</label>
      <input type="text" id="stickerNo" placeholder="رقم الاستيكر" required autocomplete="off" />

      <label for="animalType">نوع الذبيحة</label>
      <select id="animalType" required>
        <option value="">اختر النوع</option>
        <option value="غنم">غنم</option>
        <option value="ماعز">ماعز</option>
        <option value="بقر">بقر</option>
      </select>

      <label for="cuttingType">نوع التقطيع</label>
      <select id="cuttingType" required>
        <option value="">اختر نوع التقطيع</option>
        ${cuttingTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
      </select>

      <label for="price">السعر</label>
      <input type="number" id="price" placeholder="السعر" required min="1" />

      <fieldset class="payment-method">
        <legend>طريقة الدفع</legend>
        <label><input type="radio" name="payment" value="كاش" required /> كاش</label>
        <label><input type="radio" name="payment" value="آجل" /> آجل</label>
      </fieldset>

      <label for="location">الموقع</label>
      <input type="text" id="location" value="${currentUser.location}" readonly />

      <label for="date">التاريخ</label>
      <input type="date" id="date" value="${new Date().toISOString().slice(0,10)}" required />

      <div class="form-buttons">
        <button type="submit">حفظ</button>
        <button type="button" id="cancelEntry">إلغاء</button>
      </div>
    </form>
  `;

  // حدث حفظ البيانات
  document.getElementById('dataEntryForm').addEventListener('submit', e => {
    e.preventDefault();
    saveEntry();
  });

  // إلغاء إدخال البيانات والعودة للقائمة
  document.getElementById('cancelEntry').addEventListener('click', () => {
    showScreen('dashboard');
  });
}

// ======== حفظ البيانات ========
function saveEntry() {
  const invoiceNo = document.getElementById('invoiceNo').value.trim();
  const clientName = document.getElementById('clientName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const animalNo = document.getElementById('animalNo').value.trim();
  const stickerNo = document.getElementById('stickerNo').value.trim();
  const animalType = document.getElementById('animalType').value;
  const cuttingType = document.getElementById('cuttingType').value;
  const price = parseFloat(document.getElementById('price').value);
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;

  // تحقق من الحقول المطلوبة
  if (!clientName || !phoneNumber || !animalNo || !stickerNo || !animalType || !cuttingType || !price || !paymentMethod || !date) {
    alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
    return;
  }

  // إضافة السجل للمصفوفة
  entries.push({
    invoiceNo,
    clientName,
    phoneNumber,
    animalNo,
    stickerNo,
    animalType,
    cuttingType,
    price,
    paymentMethod,
    location,
    date,
  });

  invoiceNumber++; // زيادة رقم الفاتورة تلقائيًا

  alert('تم حفظ البيانات بنجاح');
  showScreen('dashboard');
}

// ======== عرض تقرير المتعاملين ========
function renderClientsReport() {
  const tbody = clientsScreen.querySelector('tbody');
  tbody.innerHTML = '';

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11">لا توجد بيانات مسجلة</td></tr>`;
    return;
  }

  entries.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.invoiceNo}</td>
      <td>${entry.clientName}</td>
      <td>${entry.phoneNumber}</td>
      <td>${entry.animalNo}</td>
      <td>${entry.stickerNo}</td>
      <td>${entry.animalType}</td>
      <td>${entry.cuttingType}</td>
      <td>${entry.price.toFixed(2)}</td>
      <td>${entry.paymentMethod}</td>
      <td>${entry.location}</td>
      <td>${entry.date}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ======== عرض التقرير الإحصائي ========
function renderStatisticsReport() {
  reportScreen.innerHTML = `<h2>التقرير الإحصائي</h2>`;

  if (entries.length === 0) {
    reportScreen.innerHTML += `<p>لا توجد بيانات لعرض التقرير.</p>`;
    return;
  }

  // احصائيات بسيطة: عدد المتعاملين، مجموع الأسعار، المتوسط، عدد المتعاملين حسب نوع الذبيحة
  const totalEntries = entries.length;
  const totalPrice = entries.reduce((sum, e) => sum + e.price, 0);
  const avgPrice = (totalPrice / totalEntries).toFixed(2);

  const animalTypeCounts = {};
  entries.forEach(e => {
    animalTypeCounts[e.animalType] = (animalTypeCounts[e.animalType] || 0) + 1;
  });

  let statsHTML = `
    <ul>
      <li>إجمالي المتعاملين: <strong>${totalEntries}</strong></li>
      <li>إجمالي المبيعات: <strong>${totalPrice.toFixed(2)}</strong> ريال</li>
      <li>متوسط السعر: <strong>${avgPrice}</strong> ريال</li>
      <li>عدد المتعاملين حسب نوع الذبيحة:</li>
  `;

  for (const [type, count] of Object.entries(animalTypeCounts)) {
    statsHTML += `<li>- ${type}: ${count}</li>`;
  }
  statsHTML += '</ul>';

  reportScreen.innerHTML += statsHTML;
  reportScreen.innerHTML += `<button onclick="showScreen('dashboard')" class="nav-btn">عودة للقائمة الرئيسية</button>`;
}

// ======== شاشة الإعدادات (للمشرف فقط) ========
function renderSettings() {
  if (!currentUser || currentUser.role !== 'admin') {
    alert('غير مسموح بالدخول إلى الإعدادات');
    return;
  }

  settingsScreen.innerHTML = `
    <h2>الإعدادات</h2>
    <p>إدارة أنواع التقطيع</p>
    <ul id="cuttingTypesList"></ul>

    <form id="addCuttingTypeForm" style="margin-top:15px;">
      <input type="text" id="newCuttingType" placeholder="نوع التقطيع جديد" autocomplete="off" required />
      <button type="submit">إضافة</button>
    </form>

    <button onclick="showScreen('dashboard')" class="nav-btn">عودة للقائمة الرئيسية</button>
  `;

  renderCuttingTypesList();

  document.getElementById('addCuttingTypeForm').addEventListener('submit', e => {
    e.preventDefault();
    const newTypeInput = document.getElementById('newCuttingType');
    const newType = newTypeInput.value.trim();
    if (newType && !cuttingTypes.includes(newType)) {
      cuttingTypes.push(newType);
      newTypeInput.value = '';
      renderCuttingTypesList();
      alert('تم إضافة نوع التقطيع بنجاح');
    } else {
      alert('نوع التقطيع موجود مسبقًا أو غير صالح');
    }
  });
}

// ======== عرض قائمة أنواع التقطيع مع حذف ========
function renderCuttingTypesList() {
  const ul = document.getElementById('cuttingTypesList');
  ul.innerHTML = '';
  cuttingTypes.forEach((type, index) => {
    const li = document.createElement('li');
    li.textContent = type;

    if (cuttingTypes.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.textContent = 'حذف';
      delBtn.onclick = () => {
        if (confirm(`هل تريد حذف نوع التقطيع "${type}"؟`)) {
          cuttingTypes.splice(index, 1);
          renderCuttingTypesList();
        }
      };
      li.appendChild(delBtn);
    }

    ul.appendChild(li);
  });
}

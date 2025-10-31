import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const auth = window.firebaseAuth;
const db = window.firebaseDb;

const loginContainer = document.getElementById('loginContainer');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const appContainer = document.querySelector('.container');
const logoutBtn = document.getElementById('logoutBtn');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN');
    await loadTrades();
    await showStudentsList();
  } else {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

loginBtn.onclick = async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginError.style.display = 'none';
  } catch (err) {
    loginError.style.display = 'block';
    loginError.textContent = err.message;
  }
};

logoutBtn.onclick = () => {
  signOut(auth);
};

async function loadTrades() {
  const tradeSelector = document.getElementById('tradeSelector');
  const studentTrade = document.getElementById('studentTrade');
  const recordsTradeSelector = document.getElementById('recordsTradeSelector');
  [tradeSelector, studentTrade, recordsTradeSelector].forEach(sel => {
    while (sel.options.length > 1) sel.remove(1);
  });
  const tradesSnapshot = await getDocs(collection(db, 'trades'));
  tradesSnapshot.forEach(docSnap => {
    const trade = docSnap.data();
    addOption(tradeSelector, trade.code, `${trade.name} (${trade.code})`);
    addOption(studentTrade, trade.code, `${trade.name} (${trade.code})`);
    addOption(recordsTradeSelector, trade.code, `${trade.name} (${trade.code})`);
  });
}

function addOption(select, value, text) {
  const opt = document.createElement("option");
  opt.value = value; opt.textContent = text;
  select.appendChild(opt);
}

// (Continue converting your attendance and student functions to use Firestore here)...

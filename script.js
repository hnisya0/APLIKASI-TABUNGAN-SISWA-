// Data State Tabungan
let tabungan = {
    nama: "",
    saldo: 0,
    riwayat: []
};

// DOM Elements
const formDaftar = document.getElementById('form-daftar');
const dashboard = document.getElementById('dashboard');
const displayNama = document.getElementById('display-nama');
const displaySaldo = document.getElementById('display-saldo');
const inputJumlah = document.getElementById('jumlah');
const btnSetor = document.getElementById('btn-setor');
const btnTarik = document.getElementById('btn-tarik');
const tabelRiwayat = document.getElementById('tabel-riwayat');

// Format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Mendapatkan Waktu Saat Ini
function getWaktuSekarang() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// Update Tampilan UI
function updateUI() {
    displayNama.textContent = tabungan.nama;
    displaySaldo.textContent = formatRupiah(tabungan.saldo);

    // Render Riwayat
    tabelRiwayat.innerHTML = '';
    tabungan.riwayat.slice().reverse().forEach(item => {
        const row = document.createElement('tr');
        
        let badgeClass = 'badge-awal';
        if (item.jenis === 'Tambah Uang') badgeClass = 'badge-setor';
        if (item.jenis === 'Tarik Uang') badgeClass = 'badge-tarik';

        row.innerHTML = `
            <td>${item.waktu}</td>
            <td><span class="badge ${badgeClass}">${item.jenis}</span></td>
            <td>${formatRupiah(item.nominal)}</td>
            <td>${formatRupiah(item.saldoAkhir)}</td>
        `;
        tabelRiwayat.appendChild(row);
    });
}

// Handler Registrasi Akun
formDaftar.addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const saldoAwal = parseFloat(document.getElementById('saldo-awal').value);

    if (nama && !isNaN(saldoAwal)) {
        tabungan.nama = nama;
        tabungan.saldo = saldoAwal;
        tabungan.riwayat.push({
            waktu: getWaktuSekarang(),
            jenis: 'Saldo Awal',
            nominal: saldoAwal,
            saldoAkhir: saldoAwal
        });

        // Sembunyikan form pendaftaran dan tampilkan dashboard
        formDaftar.parentElement.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        updateUI();
    }
});

// Handler Tambah Uang (Setor)
btnSetor.addEventListener('click', function () {
    const jumlah = parseFloat(inputJumlah.value);

    if (isNaN(jumlah) || jumlah <= 0) {
        alert('Masukkan nominal angka yang valid!');
        return;
    }

    tabungan.saldo += jumlah;
    tabungan.riwayat.push({
        waktu: getWaktuSekarang(),
        jenis: 'Tambah Uang',
        nominal: jumlah,
        saldoAkhir: tabungan.saldo
    });

    inputJumlah.value = '';
    updateUI();
});

// Handler Tarik Uang
btnTarik.addEventListener('click', function () {
    const jumlah = parseFloat(inputJumlah.value);

    if (isNaN(jumlah) || jumlah <= 0) {
        alert('Masukkan nominal angka yang valid!');
        return;
    }

    if (jumlah > tabungan.saldo) {
        alert('Saldo tidak mencukupi untuk melakukan penarikan!');
        return;
    }

    tabungan.saldo -= jumlah;
    tabungan.riwayat.push({
        waktu: getWaktuSekarang(),
        jenis: 'Tarik Uang',
        nominal: jumlah,
        saldoAkhir: tabungan.saldo
    });

    inputJumlah.value = '';
    updateUI();
});

const upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
const kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];

const pengirimanList = [
  { kode: "REG", nama: "Reguler (3-5 hari)" },
  { kode: "EXP", nama: "Ekspres (1-2 hari)" }
];

const paketBahanAjarList = [
  { kode: "PAKET-UT-001", namaPaket: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 125000 },
  { kode: "PAKET-UT-002", namaPaket: "PAKET IPA & Saintek", isi: ["BIOL4201", "FISIP4001"], harga: 135000 },
  { kode: "PAKET-UT-003", namaPaket: "PAKET Komunikasi & PAUD", isi: ["SKOM4101", "PAUD4101"], harga: 145000 }
];

const initialDeliveryOrders = [
  {
    nomorDO: "DO2026-001",
    nim: "041234567",
    nama: "Rina Wulandari",
    paket: "PAKET IPS Dasar",
    ekspedisi: "JNE Regular",
    tanggal: "31-Oct-2026",
    total: "Rp 125.000",
    status: "Dalam Perjalanan"
  }
];

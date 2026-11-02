const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const doList = ref([...initialDeliveryOrders]);
    const paketOptions = ref([...paketBahanAjarList]);
    const ekspedisiOptions = ref(["JNE Regular", "JNE Express", "Pos Indonesia", "J&T Express"]);
    
    const errorMessage = ref('');
    const successMessage = ref('');

    const form = ref({
      nim: '',
      nama: '',
      ekspedisi: '',
      selectedPaket: null,
      tanggal: '31-Oct-2026'
    });

    const computedTotalHarga = computed(() => {
      if (!form.value.selectedPaket) return 'Rp 0';
      return 'Rp ' + form.value.selectedPaket.harga.toLocaleString('id-ID');
    });

    function generateNoDO() {
      const tahun = new Date().getFullYear();
      const seq = String(doList.value.length + 2).padStart(3, '0');
      return `DO${tahun}-${seq}`;
    }

    function submitDO() {
      if (!form.value.nim || !form.value.nama || !form.value.ekspedisi || !form.value.selectedPaket) {
        errorMessage.value = "Semua field formulir pemesanan wajib diisi!";
        return;
      }

      const newDO = {
        nomorDO: generateNoDO(),
        nim: form.value.nim,
        nama: form.value.nama,
        paket: form.value.selectedPaket.namaPaket,
        ekspedisi: form.value.ekspedisi,
        tanggal: form.value.tanggal || '31-Oct-2026',
        total: computedTotalHarga.value,
        status: "Diproses"
      };

      doList.value.unshift(newDO);
      errorMessage.value = '';
      successMessage.value = `Delivery Order ${newDO.nomorDO} berhasil dibuat!`;
      form.value = {
        nim: '',
        nama: '',
        ekspedisi: '',
        selectedPaket: null,
        tanggal: '31-Oct-2026'
      };

      setTimeout(() => { successMessage.value = ''; }, 3000);
    }

    function updateTanggalKirim(doItem) {
      const tanggalBaru = prompt(`Masukkan Tanggal Kirim baru untuk ${doItem.nomorDO}:`, doItem.tanggal);
      if (tanggalBaru !== null && tanggalBaru.trim() !== '') {
        doItem.tanggal = tanggalBaru.trim();
        doItem.status = "Dalam Perjalanan";
        successMessage.value = `Tanggal kirim DO ${doItem.nomorDO} berhasil diperbarui menjadi ${doItem.tanggal}!`;
        setTimeout(() => { successMessage.value = ''; }, 3000);
      }
    }

    return {
      doList, paketOptions, ekspedisiOptions, form, errorMessage, successMessage, computedTotalHarga, submitDO, updateTanggalKirim
    };
  }
});

app.mount('#app');

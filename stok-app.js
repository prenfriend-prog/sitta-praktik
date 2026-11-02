const { createApp, ref, computed, watch, onMounted } = Vue;

const StokItem = {
  name: 'StokItem',
  props: ['item'],
  emits: ['edit-item', 'delete-item'],
  template: `
    <tr :class="{'table-warning': item.qty < item.safety && item.qty > 0, 'table-danger': item.qty === 0}">
      <td><strong>{{ item.kode }}</strong></td>
      <td>
        {{ item.judul }}
        <div v-html="item.catatanHTML" class="small text-muted"></div>
      </td>
      <td><span class="badge bg-secondary">{{ item.kategori }}</span></td>
      <td>{{ item.upbjj }}</td>
      <td><code>{{ item.lokasiRak }}</code></td>
      <td><strong>{{ item.qty }}</strong> / <small class="text-muted">Min: {{ item.safety }}</small></td>
      <td>{{ formatRupiah(item.harga) }}</td>
      <td>
        <span class="badge" :class="statusBadge.class">{{ statusBadge.text }}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-warning me-1 px-2 py-1" @click="$emit('edit-item', item)">✏️ Edit</button>
        <button class="btn btn-sm btn-outline-danger px-2 py-1" @click="$emit('delete-item', item)">🗑️ Hapus</button>
      </td>
    </tr>
  `,
  computed: {
    statusBadge() {
      if (this.item.qty === 0) return { text: 'Kosong', class: 'bg-danger' };
      if (this.item.qty < this.item.safety) return { text: 'Menipis', class: 'bg-warning text-dark' };
      return { text: 'Aman', class: 'bg-success' };
    }
  },
  methods: {
    formatRupiah(val) {
      if (!val && val !== 0) return 'Rp 0';
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    }
  }
};

const app = createApp({
  components: {
    'stok-item': StokItem
  },
  setup() {
    const stokList = ref([]);
    const upbjjOptions = ref([...upbjjList]);
    const kategoriOptions = ref([...kategoriList]);

    const filterUPBJJ = ref('');
    const filterKategori = ref('');
    const showCritical = ref(false);
    const sortBy = ref('az');
    const errorMessage = ref('');
    const successMessage = ref('');

    const newItem = ref({
      kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: ''
    });

    onMounted(async () => {
      try {
        const response = await fetch('./dataBahanAjar.json');
        if (response.ok) {
          stokList.value = await response.json();
        }
      } catch (err) {
        console.error("Error loading JSON:", err);
      }
    });

    watch(filterUPBJJ, (newVal) => {
      if (!newVal) filterKategori.value = '';
    });

    const filteredStok = computed(() => {
      let result = [...stokList.value];
      if (filterUPBJJ.value) {
        result = result.filter(item => item.upbjj === filterUPBJJ.value);
      }
      if (filterKategori.value) {
        result = result.filter(item => item.kategori === filterKategori.value);
      }
      if (showCritical.value) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }
      return result.sort((a, b) => {
        if (sortBy.value === 'az') return a.judul.localeCompare(b.judul);
        if (sortBy.value === 'za') return b.judul.localeCompare(a.judul);
        if (sortBy.value === 'asc') return a.qty - b.qty;
        if (sortBy.value === 'desc') return b.qty - a.qty;
        return 0;
      });
    });

    function resetFilter() {
      filterUPBJJ.value = '';
      filterKategori.value = '';
      showCritical.value = false;
      sortBy.value = 'az';
    }

    function addItem() {
      if (!newItem.value.kode || !newItem.value.judul || !newItem.value.kategori || !newItem.value.upbjj) {
        errorMessage.value = "Kode, Judul, Kategori, dan UT Daerah wajib diisi!";
        return;
      }
      stokList.value.push({ ...newItem.value });
      errorMessage.value = '';
      successMessage.value = 'Bahan Ajar berhasil ditambahkan!';
      newItem.value = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
      setTimeout(() => { successMessage.value = ''; }, 3000);

      const modalEl = document.getElementById('addModal');
      if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    }

    function handleEditItem(item) {
      const newQty = prompt(`Edit Qty untuk ${item.judul}:`, item.qty);
      if (newQty !== null && !isNaN(newQty) && newQty !== '') {
        item.qty = parseInt(newQty, 10);
        successMessage.value = `Stok ${item.judul} berhasil diperbarui!`;
        setTimeout(() => { successMessage.value = ''; }, 3000);
      }
    }

    function handleDeleteItem(item) {
      if (confirm(`Apakah Anda yakin ingin menghapus bahan ajar ${item.judul}?`)) {
        stokList.value = stokList.value.filter(i => i.kode !== item.kode);
        successMessage.value = `Bahan ajar ${item.judul} berhasil dihapus!`;
        setTimeout(() => { successMessage.value = ''; }, 3000);
      }
    }

    return {
      stokList, upbjjOptions, kategoriOptions, filterUPBJJ, filterKategori, showCritical, sortBy,
      filteredStok, resetFilter, newItem, errorMessage, successMessage, addItem, handleEditItem, handleDeleteItem
    };
  }
});

app.mount('#app');

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

import pagination from './pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'harrykuo-vuecourseurl';

let productModal = {};
let deleteProductModal = {};

const app = createApp({
  components: {
    pagination,
  },
  data() {
    return {
      isNew: false,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  methods: {
    adminCheck() {
      const url = `${apiUrl}/api/user/check`;

      axios.post(url)
        .then(() => {
          this.getProductsList();
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
          window.location = 'index.html';
        });
    },
    getProductsList(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then(res => {
          const { products, pagination } = res.data;

          this.products = products;
          this.pagination = pagination;
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
        });
    },
    openModal(isNew, item) {
      this.isNew = false;
      this.tempProduct = {
        imagesUrl: [],
      };

      if (isNew === 'new') {
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        deleteProductModal.show();
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
    });

    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      keyboard: false,
    });

    if (token === '') {
      alert('您尚未登入，請重新登入。');
      window.location = 'index.html';
    }

    axios.defaults.headers.common.Authorization = token;
    this.adminCheck();
  },
});

app.component('productModal', {
  props: {
    isNew: {
      type: Boolean,
      default: false,
    },
    tempProduct: {
      type: Object,
      default() {
        return {
          imagesUrl: [],
        };
      },
    },
  },
  template:'#productModal',
  data() {
    return {
      imageFileUploading: false,
    };
  },
  methods: {
    setProductData() {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let requestType = 'post';

      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        requestType = 'put';
      }

      axios[requestType](url, {data: this.tempProduct})
        .then(res => {
          const { message } = res.data;

          alert(message);
          productModal.hide();
          this.$emit('get-products-list');
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
        });
    },
    addMultiImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
    uploadImageFile() {
      const url = `${apiUrl}/api/${apiPath}/admin/upload`;

      const imageFileInput = this.$refs.imageFileInputField;
      const uploadImageFile = imageFileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadImageFile);

      this.imageFileUploading = true;

      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          const { imageUrl } = res.data;

          this.imageFileUploading = false;
          imageFileInput.value = '';
          this.tempProduct.imageUrl = imageUrl;
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);

          this.imageFileUploading = false;
          imageFileInput.value = '';
        });
    },
  },
});

app.component('deleteProductModal', {
  props: {
    tempProduct: {
      type: Object,
      default() {
        return {
          imagesUrl: [],
        };
      },
    },
  },
  template:'#deleteProductModal',
  methods: {
    deleteProductData() {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then(res => {
          const { message } = res.data;

          alert(message);
          deleteProductModal.hide();
          this.$emit('get-products-list');
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
        });
    },
  },
});

app.mount('#app');

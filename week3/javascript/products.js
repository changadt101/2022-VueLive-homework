import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let productModal = {};
let deleteProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'harrykuo-vuecourseurl',
      isNew: false,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    adminCheck() {
      const url = `${this.apiUrl}/api/user/check`;

      axios.post(url)
        .then(() => {
          this.getProductsList();
        })
        .catch((error) => {
          const { message } = error.response.data;

          alert(message);
          window.location = 'index.html';
        });
    },
    getProductsList(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((res) => {
          const { products } = res.data;

          this.products = products;
        })
        .catch((error) => {
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
    addMultiImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
    setProductData() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let requestType = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        requestType = 'put';
      }

      axios[requestType](url, {data: this.tempProduct})
        .then((res) => {
          const { message } = res.data;

          alert(message);
          productModal.hide();
          this.getProductsList();
        })
        .catch((error) => {
          const { message } = error.response.data;

          alert(message);
        });
    },
    deleteProductData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then((res) => {
          const { message } = res.data;

          alert(message);
          deleteProductModal.hide();
          this.getProductsList();
        })
        .catch((error) => {
          const { message } = error.response.data;

          alert(message);
        });
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

app.mount('#app');

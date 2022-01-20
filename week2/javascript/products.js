import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'harrykuo-vuecourseurl',
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    adminCheck() {
      const url = `${this.apiUrl}/api/user/check`;

      axios.post(url)
        .then((res) => {
          if (res.data.success) {
            this.getProducts();
          } else {
            const { message } = res.data;

            alert(message);
            window.location = 'index.html';
          }
        })
        .catch((error) => {
          console.log(error);
          window.location = 'index.html';
        });
    },
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;

      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            const { products } = res.data;

            this.products = products;
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProductDetail(item) {
      this.tempProduct = item;
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (token === '') {
      alert('您尚未登入，請重新登入。');
      window.location = 'index.html';
    }

    axios.defaults.headers.common.Authorization = token;

    this.adminCheck();
  },
});

app.mount('#app');

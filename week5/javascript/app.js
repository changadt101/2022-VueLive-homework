import productModal from './productModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true,
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'harrykuo-vuecourseurl';

const app = Vue.createApp({
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      loadingStatus: {
        loadingProduct: '',
        loadingCartItem: '',
        loadingAction: '',
      },
      cartData: {
        carts: [],
      },
      products: [],
      productId: '',
      orderData: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    getProductsList() {
      const url = `${apiUrl}/api/${apiPath}/products/all`;

      axios.get(url)
        .then(res => {
          const { products } = res.data;

          this.products = products;
        })
        .catch(error => {
          const { message } = error.response.data;
          alert(message);

          this.products = [];
        });
    },
    openProductModal(productId) {
      this.productId = productId;
      this.$refs.productModal.openModal();
    },
    getCartData() {
      const url = `${apiUrl}/api/${apiPath}/cart`;

      axios.get(url)
        .then(res => {
          const { data } = res.data;

          this.cartData = data;
        })
        .catch(error => {
          const { message } = error.response.data;
          alert(message);

          this.cartData = {};
        });
    },
    addToCart(productId, quantity = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      const addToCartParams = {
        product_id: productId,
        qty: quantity,
      };

      this.loadingStatus.loadingProduct = productId;
      this.loadingStatus.loadingAction = 'addToCart';

      axios.post(url, { data: addToCartParams })
        .then(res => {
          const { message } = res.data;

          this.loadingStatus.loadingProduct = '';
          this.loadingStatus.loadingAction = '';

          alert(message);
          this.$refs.productModal.closeModal();
          this.$refs.productModal.quantity = 1;
          this.getCartData();
        })
        .catch(error => {
          const { message } = error.response.data;

          this.loadingStatus.loadingProduct = '';
          this.loadingStatus.loadingAction = '';
          alert(message);
        });
    },
    updateCartProduct(item) {
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const updateCartProductParams = {
        product_id: item.product_id,
        qty: item.qty,
      };

      this.loadingStatus.loadingCartItem = item.id;

      axios.put(url, { data: updateCartProductParams })
        .then(res => {
          const { message } = res.data;

          this.loadingStatus.loadingCartItem = '';
          alert(message);
          this.getCartData();
        })
        .catch(error => {
          const { message } = error.response.data;

          this.loadingStatus.loadingCartItem = '';
          alert(message);
        });
    },
    deleteAllCartProducts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;

      axios.delete(url)
        .then(res => {
          const { message } = res.data;

          alert(message);
          this.getCartData();
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
        });
    },
    deleteCartProduct(itemId) {
      const url = `${apiUrl}/api/${apiPath}/cart/${itemId}`;

      this.loadingStatus.loadingCartItem = itemId;
      this.loadingStatus.loadingAction = 'deleteCartProduct';

      axios.delete(url)
        .then(res => {
          const { message } = res.data;

          this.loadingStatus.loadingCartItem = '';
          this.loadingStatus.loadingAction = '';

          alert(message);
          this.getCartData();
        })
        .catch(error => {
          const { message } = error.response.data;

          this.loadingStatus.loadingCartItem = '';
          this.loadingStatus.loadingAction = '';
          alert(message);
        });
    },
    submitOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const orderParams = this.orderData;

      axios.post(url, { data: orderParams })
        .then(res => {
          const { message } = res.data;

          alert(message);
          this.$refs.orderForm.resetForm();
          this.orderData.message = '';
          this.getCartData();
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
        });
    },
  },
  mounted() {
    this.getProductsList();
    this.getCartData();
  },
});

app.mount('#app');

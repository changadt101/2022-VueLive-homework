export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  template: '#productModal',
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'harrykuo-vuecourseurl',
      modal: {},
      product: {},
      quantity: 1,
    };
  },
  watch: {
    id() {
      this.getProductData();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProductData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/product/${this.id}`;

      axios.get(url)
        .then(res => {
          const { product } = res.data;

          this.product = product;
        })
        .catch(error => {
          const { message } = error.response.data;

          alert(message);
          this.product = {
            id: '',
            title: '',
            category: '',
            imageUrl: '',
            origin_price: 0,
            price: 0,
            description: '',
            content: '',
          };
        });
    },
    addToCart() {
      this.$emit('add-to-cart', this.product.id, this.quantity);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
    });
  },
};

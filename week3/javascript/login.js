import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const url = `${this.apiUrl}/admin/signin`;

      axios.post(url, this.user)
        .then((res) => {
          const { token, expired } = res.data;

          document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
          window.location = 'products.html';
        })
        .catch((error) => {
          const { message } = error.response.data;

          alert(message);

          this.user.password = '';
          this.focusOnInputElement('#password');
        });
    },
    focusOnInputElement(element) {
      const inputElement = document.querySelector(element);
      inputElement.focus();
    },
  },
  mounted() {
    this.focusOnInputElement('#username');
  },
});

app.mount('#app');

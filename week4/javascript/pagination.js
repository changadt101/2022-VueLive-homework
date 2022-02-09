export default {
  props: {
    pages: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-products-list', pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{ active: page === pages.current_page }" v-for="page in pages.total_pages" :key="'pagination-' + page">
        <span v-if="page === pages.current_page" class="page-link">{{ page }}</span>
        <a v-else class="page-link" href="#" @click.prevent="$emit('get-products-list', page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-products-list', pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
};

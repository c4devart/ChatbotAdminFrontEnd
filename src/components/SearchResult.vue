<template>
  <div class="search-result pointer" @click="click" v-if="data.answer">
    {{ data.answer }}
  </div>
</template>
<script>
export default {
  name: "SearchResult",
  props: {
    data: {
      type: Object,
      default() {
        return {
          answer: ""
        };
      }
    }
  },
  methods: {
    click() {
      if (this.data.answer != "") {
        this.$store.dispatch("app/selSuggestion", this.data.answer);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.search-result {
  background-color: $searchResultBgColor;
  margin-bottom: 10px;
  padding: 10px;
  color: white;
  border-radius: 5px;

  &:last-child {
    margin-bottom: 0px;
  }
}
</style>

<template>
  <div class="search-container pd-5 mg-10">
    <div class="search-title">
      suggestions
    </div>
    <div class="search-content">
      <div class="search-input">
        <b-form-input v-model="searchkey" placeholder=""></b-form-input>
      </div>
      <div class="search-result"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchCard",
  components: {},
  computed: {},
  data() {
    return {
      searchkey: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.search-container {
  background: white;

  .search-content {
    padding-top: 5px;

    .search-result {
      height: 200px;
    }
  }
}
</style>

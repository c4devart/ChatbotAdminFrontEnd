<template>
  <div class="customer-item">
    <img src="@/assets/imgs/avatar.png" class="customer-avatar" />
    <div class="customer-name">{{ $t(data.name) }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: "Menu"
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.customer-item {
  margin: 3px 6px;
  border: 2px red solid;
  padding: 5px 10px;
  height: $navbarHeight;
}

.customer-item:hover {
  margin: 3px 6px;
  border: 0px red solid;
  padding: 5px 10px;
  height: $navbarHeight;
  background-color: #3e81be86;
}

.customer-avatar {
  border-radius: 50%;
  border: 1px blue solid;
  display: inline-block;
  margin-right: 20px;
  height: 100%;
}
.customer-name {
  display: inline-block;
}
</style>

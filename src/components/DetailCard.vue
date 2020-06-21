<template>
  <div class="detail-container pd-5">
    <div class="detail-title">
      {{ title }}
    </div>
    <slot class="detail-content" name="content" />
  </div>
</template>

<script>
export default {
  name: "DetailCard",
  components: {},
  computed: {},
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.detail-container {
  background-color: $detailCardBgColor;
  border-radius: 5px;
  border: $detailCardBorderColor 2px solid;
  padding: 10px 5px;
  margin-bottom: 5px;
  .detail-content {
    padding-top: 5px;
    height: 100px;
  }

  .detail-title {
    color: $detailTitleColor;
    font-size: 1.2em;
    margin-left: 10px;
    font-weight: 600;
  }
}
</style>

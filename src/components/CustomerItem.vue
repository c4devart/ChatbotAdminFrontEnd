<template>
  <div>
    <div :class="classObj" @click="click">
      <div class="user_symbol_container">
        <span class="symbol-content">{{ nameShortCut }}</span>
      </div>
      <div class="user-name-msg">
        <div class="customer-name">
          {{ data.name ? data.name : $t("unnamed_visitor") }}
        </div>
        <div class="last-message">{{ data.last_message }}</div>
      </div>
      <b-badge v-if="isNew && unreadCnt == 0" variant="danger">{{
        $t("new_badge")
      }}</b-badge>
      <b-badge v-if="!isNew && unreadCnt > 0" variant="danger">{{
        unreadCnt
      }}</b-badge>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    },
    unreadCnt: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(["selected_customer"]),
    classObj() {
      return {
        "customer-item pointer": true,
        active: this.isActive,
        new: this.isNew
      };
    },
    nameShortCut() {
      if (!this.data.name) {
        return this.$t("unnamed_visitor")
          .substring(0, 2)
          .toUpperCase();
      }
      return this.data.name.substring(0, 2).toUpperCase();
    }
  },
  data() {
    return {};
  },
  methods: {
    click() {
      if (this.isNew) {
        this.$store.dispatch("app/decreaseUnreadCount");
      }
      this.$store.dispatch("app/updateActiveStatus", this.index);
      this.$store.dispatch("app/setSelectIndex", this.index);
      this.$emit("clicked", this.index);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.customer-item {
  position: relative;
  margin: 3px 6px;
  padding: 20px;
  height: 80px;
  color: $fontColor;
  .badge {
    position: absolute;
    right: 20px;
    top: 40%;
  }
  // &:hover {
  //   background-color: $customerItemHoverBgColor;
  //   border: $customerItemBorderColor 1px solid;
  //   border-radius: 10px;
  // }
  .user_symbol_container {
    float: left;
    text-align: center;
    line-height: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 16px;
    opacity: 0.7;
    span.symbol-content {
      display: block;
      width: 40px;
      height: 40px;
      color: rgb(255, 255, 255);
      overflow: hidden;
      border-radius: 50%;
      background: rgb(103, 172, 162);
    }
  }

  .user-name-msg {
    margin-right: 50px;
    .customer-name {
      font-size: 16px;
      line-height: 1.5;
      margin-left: 50px;
      margin-top: -3px;
    }

    .last-message {
      line-height: 2;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px 10px 0px 50px;
      overflow: hidden;
      font-size: 13px;
    }
  }

  &.active {
    background-color: $customerItemActiveBgColor;
    border: $customerItemBorderColor 1px solid;
    border-radius: 10px;
  }
  &.new {
    background-color: $customerItemHoverBgColor;
    border: $customerItemBorderColor 1px solid;
    border-radius: 10px;
  }
}
</style>

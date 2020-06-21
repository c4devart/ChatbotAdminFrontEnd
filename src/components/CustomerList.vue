<template>
  <div class="customer-list v-full">
    <div class="customer-list--header flex-space-between-vc">
      {{ $t("online_chat") }}
    </div>
    <div class="customer-list--content no-scrollbar">
      <b-button v-b-toggle.accordion-1 class="waiting">
        <i v-if="collapseStates[0]" class="fa fa-angle-down mr-2"></i>
        <i v-if="!collapseStates[0]" class="fa fa-angle-right mr-2"></i>
        {{ $t("waiting_for_response") }}
        <b-badge variant="light" class="chat-count">{{
          waiting_customers.length
        }}</b-badge>
      </b-button>
      <b-collapse id="accordion-1" v-model="collapseStates[0]">
        <customer-item
          v-for="item in waiting_customers"
          :key="item.index"
          :data="item"
          :isActive="item.active"
          :isNew="item.isNew"
          :index="item.index"
          :unreadCnt="item.unread_cnt"
          @clicked="customerItemClick"
        />
      </b-collapse>
      <b-button
        v-b-toggle.accordion-2
        class="mychats"
        v-if="my_customers.length > 0"
      >
        <i v-if="collapseStates[1]" class="fa fa-angle-down mr-2"></i>
        <i v-if="!collapseStates[1]" class="fa fa-angle-right mr-2"></i>
        {{ $t("my_chats") }}
        <b-badge variant="light" class="chat-count">{{
          my_customers.length
        }}</b-badge>
      </b-button>
      <b-collapse id="accordion-2" v-model="collapseStates[1]">
        <customer-item
          v-for="item in my_customers"
          :key="item.index"
          :data="item"
          :isActive="item.active"
          :isNew="item.isNew"
          :index="item.index"
          :unreadCnt="item.unread_cnt"
          @clicked="customerItemClick"
        />
      </b-collapse>
      <b-button
        v-b-toggle.accordion-3
        class="watchchats"
        v-if="sv_customers.length > 0"
      >
        <i v-if="collapseStates[2]" class="fa fa-angle-down mr-2"></i>
        <i v-if="!collapseStates[2]" class="fa fa-angle-right mr-2"></i>
        {{ $t("supervised_chats") }}
        <b-badge variant="light" class="chat-count">{{
          sv_customers.length
        }}</b-badge>
      </b-button>
      <b-collapse id="accordion-3" v-model="collapseStates[2]">
        <customer-item
          v-for="item in sv_customers"
          :key="item.index"
          :data="item"
          :isActive="item.active"
          :isNew="item.isNew"
          :index="item.index"
          :unreadCnt="item.unread_cnt"
          @clicked="customerItemClick"
        />
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomerItem from "@/components/CustomerItem";

export default {
  name: "CustomerList",
  components: {
    CustomerItem
  },
  computed: {
    ...mapGetters(["new_customers"]),
    waiting_customers() {
      return this.new_customers
        .filter(customer => customer.show_alert == true)
        .reverse();
    },
    my_customers() {
      return this.new_customers
        .filter(customer => customer.is_accepted == true)
        .reverse();
    },
    sv_customers() {
      return this.new_customers
        .filter(customer => customer.is_supervised == true)
        .reverse();
    }
  },
  data() {
    return {
      collapseStates: [true, true, true]
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    customerItemClick(index) {
      if (this.new_customers.length < index) {
        return;
      }
      let selectedSessionId = this.new_customers[index].session_id;
      this.$emit("fromListToParent", selectedSessionId);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.customer-list {
  width: $customerListWidth;
  height: calc(100% - #{$navbarHeight});
  position: fixed;
  top: $navbarHeight;
  left: $menubarWidth;
  bottom: 0;
  background: $customerListBgColor;
  border-right: 1px $containerBorderColor solid;
  .customer-list--header {
    height: $customerListHeaderHeight;
    background: $customerListBgColor;
    justify-content: center;
    border-bottom: 2px $containerBorderColor solid;
    font-size: 20px;
    font-weight: 500;
  }
  .customer-list--content {
    height: calc(100% - #{$customerListHeaderHeight});
    .chat-count {
      position: absolute;
      top: 30%;
      right: 30px;
      font-size: 14px;
    }
    .waiting,
    .mychats,
    .watchchats {
      position: relative;
      width: 100%;
      margin: 10px 0px;
      font-size: 16px;
      background-color: white;
      padding: 15px;
      text-align: left;
      //border: 2px $containerBorderColor solid;
      border: 0px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2),
        0 2px 4px 0 rgba(0, 0, 0, 0.19);
      color: black;
      &:active {
        background-color: white !important;
        color: black;
      }
      &:active:focus {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2),
          0 2px 4px 0 rgba(0, 0, 0, 0.19);
      }
    }
  }
}
</style>

<template>
  <div class="customer-list v-full">
    <div class="customer-list--header flex-space-between-vc">
      {{ $t("archived_chat") }}
    </div>
    <b-input-group class="search-input-group">
      <b-form-input
        v-model="search"
        type="search"
        id="searchInput"
        :placeholder="$t('searchPlaceholder')"
        @keyup.enter="handleSearch"
      ></b-form-input>
      <b-input-group-append>
        <b-button :disabled="!search" @click="handleSearch">
          {{ $t("searchLabel") }}
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <div class="customer-list--content no-scrollbar">
      <archive-customer-item
        v-for="(item, i) in customers"
        :key="i"
        :data="item"
        :isactive="item.active"
        :index="i"
        @clicked="customerItemClick"
      />
    </div>
  </div>
</template>

<script>
import ArchiveCustomerItem from "@/components/ArchiveCustomerItem";
export default {
  name: "ArchiveCustomerList",
  components: {
    ArchiveCustomerItem
  },
  props: {
    customers: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      search: ""
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    customerItemClick(args) {
      if (this.customers.length < args.index) {
        return;
      }
      for (let i = 0; i < this.customers.length; i++) {
        if (i !== args.index) {
          this.customers[i].active = false;
        } else {
          this.customers[i].active = true;
        }
      }
      this.$emit("fromListToParent", args);
      this.$forceUpdate();
    },
    handleSearch() {
      this.$emit("handleSearch", this.search);
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
    font-weight: 600;
  }
  .customer-list--content {
    height: calc(100% - #{$customerListHeaderHeight});
  }
}

.search-input-group {
  padding: 5px;
}
</style>

<template>
  <div ref="sidebar" :class="{ show: show }" class="sidebar-container">
    <div class="sidebar-background" />
    <div class="sidebar">
      <div
        class="handle-button"
        :style="{ top: buttonTop + 'px' }"
        @click="showOrHide"
      >
        <div style="width: 20px; height: 20px; background-color: red;" />
      </div>
      <div class="sidebar-header flex-space-between-vc">
        ongoing chat
      </div>
      <div class="sidebar-content">
        <customer-item v-for="(item, i) in items" :key="i" :data="item" />
      </div>
    </div>
  </div>
</template>

<script>
import CustomerItem from "./components/CustomerItem";
export default {
  name: "Sidebar",
  components: {
    CustomerItem
  },
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      type: Number,
      default: 50
    }
  },
  computed: {},
  data() {
    return {
      show: true,
      items: [
        {
          name: "aaa"
        },
        {
          name: "bbb"
        },
        {
          name: "ccc"
        },
        {
          name: "ddd"
        },
        {
          name: "eee"
        }
      ]
    };
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick();
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    const elx = this.$refs.sidebar;
    elx.remove();
  },
  methods: {
    addEventClick() {
      window.addEventListener("click", this.closeSidebar);
    },
    closeSidebar(evt) {
      const parent = evt.target.closest(".sidebar");
      if (!parent) {
        this.show = false;
        window.removeEventListener("click", this.closeSidebar);
      }
      this.$emit("showOrHide", this.show);
    },
    showOrHide() {
      this.show = !this.show;
      this.$emit("showOrHide", this.show);
    }
  },
  created: function() {
    this.$emit("showOrHide", this.show);
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.sidebar-container {
  position: relative;
}
.sidebar-background {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  @include media-breakpoint-up(md) {
    display: none;
  }
  @include media-breakpoint-down(md) {
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }
  background: rgba(0, 0, 0, 0.2);
}

.sidebar {
  width: $sidebarWidth;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  // @include media-breakpoint-down(md) {
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  // }
  transform: translate(-100%);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  background: $sidebarBgColor;
  @include media-breakpoint-up(md) {
    position: fixed;
  }
}

.show {
  // @include media-breakpoint-down(md) {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  // }

  .sidebar-background {
    opacity: 1;
    @include media-breakpoint-up(md) {
      opacity: 0;
    }
    width: 100%;
    height: 100%;
  }

  .sidebar {
    transform: translate(0);
    padding-left: $menubarWidth;
    // @include media-breakpoint-down(md) {
    //   transform: translate(0);
    // }
  }
  .handle-button {
    display: none;
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  right: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
  // @include media-breakpoint-up(md) {
  //   display: none;
  // }
}
.sidebar-header {
  height: 85px;
  background: white;
  justify-content: center;
  padding-top: $navbarHeight;
  border-bottom: 1px grey solid;
}

.sidebar-content {
}
</style>

<template>
  <div>
    <router-link v-if="!logout" :to="data.url" :class="classObj">
      <div class="menubar-item-part h-center fs-17 pd-10">
        <img
          v-if="data.url == '/chat'"
          src="@/assets/imgs/chat.png"
          class="menubar-item--icon"
        />
        <img
          v-if="data.url == '/contact'"
          src="@/assets/imgs/contact.png"
          class="menubar-item--icon"
        />
        <img
          v-if="data.url == '/archieve'"
          src="@/assets/imgs/archieve.png"
          class="menubar-item--icon"
        />
        <div class="menubar-item--lbl">{{ $t(data.title) }}</div>
      </div>
    </router-link>
    <div v-else @click="onMenuClick" :class="classObj">
      <div class="menubar-item-part h-center fs-17 pd-10">
        <img
          v-if="data.url == ''"
          src="@/assets/imgs/avatar.png"
          class="menubar-item--icon"
        />
        <div class="menubar-item--lbl">{{ $t(data.title) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    classObj: {
      get() {
        let active = false;
        if (this.$route.path === this.data.url) {
          active = true;
        }
        return {
          "menubar-item": true,
          "h-full": true,
          active: active,
          pointer: true
        };
      }
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          title: "Menu"
        };
      }
    },
    logout: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onMenuClick() {
      this.$emit("click", this.data.url);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.menubar-item {
  &.active {
    .menubar-item--lbl {
      color: $menubarItemActiveColor;
    }
    .menubar-item-part {
      background: grey;
    }
  }
  .menubar-item--icon {
    width: 30px;
    height: 30px;
  }
  .menubar-item--lbl {
    color: $menubarItemColor;
  }
}
</style>

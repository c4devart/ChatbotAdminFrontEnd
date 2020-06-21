<template>
  <div>
    <router-link
      v-if="!logout"
      :to="data.url"
      :class="classObj"
      class="no-decoration"
    >
      <div class="menubar-item-part h-center fs-17 pd-4 m-t-10">
        <vue-fontawesome
          v-if="data.url == '/chat'"
          icon="comments"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/contact'"
          icon="users"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/archieve'"
          icon="archive"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/site'"
          icon="globe"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/operator'"
          icon="user"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/faq'"
          icon="question"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <vue-fontawesome
          v-if="data.url == '/setting'"
          icon="cog"
          size="1.5"
          color="white"
        >
        </vue-fontawesome>
        <b-badge
          v-if="data.url == '/chat' && unread_count > 0"
          variant="danger"
          class="unread_count"
          >{{ unread_count }}
        </b-badge>
        <div class="menubar-item--lbl m-t-10">{{ $t(data.title) }}</div>
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
import { mapGetters } from "vuex";
export default {
  components: {},
  computed: {
    ...mapGetters(["unread_count"]),
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
      this.$emit("click");
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
  .menubar-item-part {
    position: relative;
    .unread_count {
      position: absolute;
      top: 40%;
      right: 20px;
    }
  }

  .menubar-item--icon {
    width: 30px;
    height: 30px;
  }
  .menubar-item--lbl {
    color: $menubarItemColor;
    font-size: 12px;
  }
}
.no-decoration {
  text-decoration: none;
}
</style>

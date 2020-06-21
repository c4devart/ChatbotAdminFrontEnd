<template>
  <div ref="bot" :class="{ show: show }" class="bot-container">
    <div class="bot-background" />
    <div class="bot">
      <div
        class="handle-button"
        :style="{ top: buttonTop + 'px' }"
        @click="show = !show"
      >
        <div style="width: 20px; height: 20px; background-color: red;" />
        <!-- <font-awesome-icon :icon="show?'chevron-right' : 'chevron-left'" /> -->
      </div>
      <div class="bot-header flex-space-between-vc">
        <b-form-select
          v-model="selected"
          :options="options"
          size="sm"
          class="mt-2"
        ></b-form-select>
      </div>
      <div class="bot-content">
        <search-card />
        <detail-card />
        <detail-card />
        <detail-card />
      </div>
    </div>
  </div>
</template>

<script>
import SearchCard from "./components/SearchCard";
import DetailCard from "./components/DetailCard";

export default {
  name: "Bot",
  components: {
    SearchCard,
    DetailCard
  },
  props: {
    clickNotClose: {
      type: Boolean,
      default: false
    },
    buttonTop: {
      default: 250,
      type: Number
    }
  },
  computed: {},
  data() {
    return {
      show: true,
      selected: "a",
      options: [
        { value: "a", text: "Operator1" },
        { value: "b", text: "Operator2" },
        { value: "c", text: "Operator3" }
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
    const elx = this.$refs.bot;
    elx.remove();
  },
  methods: {
    addEventClick() {
      window.addEventListener("click", this.closeSidebar);
    },
    closeSidebar(evt) {
      const parent = evt.target.closest(".bot");
      if (!parent) {
        this.show = false;
        window.removeEventListener("click", this.closeSidebar);
      }
    },
    reload() {}
  },
  created: function() {}
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.bot-container {
  position: relative;
}
.bot-background {
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

.bot {
  width: 100%;
  width: $botDetailWidth;
  height: 100%;
  // position: absolute;
  top: $navbarHeight;
  right: 0;
  position: fixed !important;

  @include media-breakpoint-down(md) {
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform: translate(100%);
  }
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  background: $botDetailBgColor;
  @include media-breakpoint-up(md) {
    position: absolute;
  }
}

.show {
  @include media-breakpoint-down(md) {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  }

  .bot-background {
    opacity: 1;
    @include media-breakpoint-up(md) {
      opacity: 0;
    }
    width: 100%;
    height: 100%;
  }

  .bot {
    @include media-breakpoint-down(md) {
      transform: translate(0);
    }
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
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
  @include media-breakpoint-up(md) {
    display: none;
  }
}

.bot-header {
  height: 30px;
  background: white;
  justify-content: center;
  border-bottom: 1px grey solid;
}

.bot-content {
}
</style>

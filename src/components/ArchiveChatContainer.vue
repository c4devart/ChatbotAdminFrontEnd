<template>
  <div class="chatarea-container flex-col-space-between-vc">
    <div class="chatarea-history">
      <div class="chatarea-header flex-space-between-vc">
        <span class="container-header">{{
          customer && customer.name
            ? customer.name
            : ""
        }}</span>
        <b-badge
          v-for="(tag, idx) in getTags"
          :key="idx"
          pill
          variant="danger"
          class="mr-1 p-2 tags"
        >
          {{ tag }}
        </b-badge>
      </div>
      <div
        id="chatarea"
        class="chatarea-content no-scrollbar"
      >
        <ul class="chats">
          <archive-chat-msg
            v-for="(message, i) in messages"
            :key="i"
            :data="message"
            :selected-customer="customer"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ArchiveChatMsg from "@/components/ArchiveChatMsg.vue";
import { mapGetters, mapState } from "vuex";
export default {
  name: "ArchiveChatContainer",
  components: {
    ArchiveChatMsg
  },
  props: {
    messages: {
      type: Array,
      default() {
        return [];
      }
    },
    customer: Object
  },
  computed: {
    ...mapState("app", ["suggestion"]),
    ...mapGetters(["user_id"]),
    getTags() {
      if(this.customer.tags) {
        return JSON.parse(this.customer.tags)
      }
      else 
        return [];
    }
  },
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
  created: function() {}
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.chatarea-container {
  height: 100%;
  background: white;
  width: calc(
    100% - #{$menubarWidth} - #{$botDetailWidth} - #{$customerListWidth}
  );
  position: fixed;
  left: calc(#{$customerListWidth} + #{$menubarWidth});
  top: $navbarHeight;
  border-left: 1px $containerBorderColor solid;
  border-right: 1px $containerBorderColor solid;

  .chatarea-header {
    height: $chatAreaHeaderHeight;
    width: 100%;
    background: white;
    border-bottom: 2px $containerBorderColor solid;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
  }

  .chatarea-history {
    width: 100%;
    height: 100%;
    padding-bottom: calc(#{$chatAreaInputHeight} + #{$chatTagHeight} + 20px);
    // &.no-input {
    //   padding-bottom: 20px;
    // }
  }

  .chatarea-content {
    padding: 20px;
  }

  .chats {
    margin: -15px 0 0;
    padding: 0px 0px 10px 0px;
  }

  .chatarea-input {
    position: absolute;
    left: 0;
    right: 0;
    bottom: $chatTagHeight;
    height: $chatAreaInputHeight;
    .input-panel {
      position: relative;
      left: 0;
      right: 0;
      border: 2px $containerBorderColor solid;
      border-radius: 5px;
      height: calc(#{$chatAreaInputHeight} - #{$chatTagHeight});
      margin: 0px 10px;
      .text-input {
        position: absolute;
        height: calc(100% - 40px);
        border: none;
        &:focus {
          box-shadow: none;
          border: none;
        }
      }
      .btn-send {
        position: absolute;
        z-index: 99;
        right: 20px;
        bottom: 5px;
        padding: 0.3rem 1rem;
      }
      .extra-input {
        position: absolute;
        z-index: 99;
        left: 20px;
        bottom: 5px;
        .extra-btn {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 0px;
          &:last-child {
            margin: 0px;
          }
        }
      }
    }
    .supervised {
      background: darkgrey;
      .text-input {
        background: darkgrey;
      }
    }
    .chat-tag {
      padding: 10px;
    }
  }
}

.container-header {
  font-size: 22px;
  margin-right: 10px;
}
.tags {
  font-size: 14px;
}
</style>

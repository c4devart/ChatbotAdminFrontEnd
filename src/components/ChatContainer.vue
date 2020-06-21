<template>
  <div
    class="chatarea-container flex-col-space-between-vc"
    :class="supervisedArea"
  >
    <div class="chatarea-history">
      <div class="chatarea-header flex-space-between-vc">
        {{
          selected_customer && selected_customer.name
            ? selected_customer.name
            : ""
        }}
      </div>
      <div
        id="chatarea"
        class="chatarea-content no-scrollbar"
        v-if="selected_customer"
      >
        <ul class="chats">
          <chat-msg
            v-for="(message, i) in messages"
            :key="i"
            :data="message"
            @closedChat="removeChatSession"
          />
        </ul>
      </div>
    </div>
    <div
      v-if="selected_customer && selected_customer.is_accepted"
      class="chatarea-input"
    >
      <div
        v-if="!selected_customer.chat_closed"
        :class="[
          !selected_customer.is_accepted
            ? 'input-panel supervised'
            : 'input-panel'
        ]"
      >
        <b-button
          href="#"
          variant="primary"
          class="btn-send"
          @click="sendMsg"
          :disabled="!selected_customer.is_accepted"
          >{{ $t("send") }}</b-button
        >
        <div class="extra-input" v-if="selected_customer.is_accepted">
          <!-- <p class="extra-btn h5">
            <b-icon icon="chat-square" class="pointer"></b-icon>
          </p> -->
          <!-- <p class="extra-btn h5">
            <b-icon icon="paperclip" rotate="45" class="pointer"></b-icon>
          </p> -->
        </div>
        <b-form-textarea
          id="textarea-no-resize"
          :placeholder="$t('chats.msgbox_placeholder')"
          no-resize
          class="text-input no-scrollbar no-border"
          v-model="value"
          :disabled="!selected_customer.is_accepted"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMsg"
          @keydown.enter.alt.exact="newLine"
          @input="writingMsg"
        ></b-form-textarea>
        {{ suggestion }}
      </div>
      <div
        class="chat-tag"
        v-if="!selected_customer.show_alert && !selected_customer.is_supervised"
      >
        <b-button-group size="sm">
          <b-button
            pill
            v-for="(btn, idx) in btnTags"
            :key="idx"
            :pressed.sync="btn.state"
            variant="outline-danger"
            class="mr-2"
            @click="addTags()"
          >
            {{ btn.caption }}
          </b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ChatMsg from "@/components/ChatMsg.vue";
import { mapGetters, mapState } from "vuex";
import firebase from "../firebase";
// import { sendNotification } from "@/api/notification";
import { addNewMsg, addCustomerTags } from "@/api/chat";
export default {
  name: "ChatContainer",
  components: {
    ChatMsg
  },
  props: {
    messages: {
      type: Array,
      default() {
        return [];
      }
    },
    btnTags: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapState("app", ["suggestion"]),
    ...mapGetters(["selected_customer", "site_no", "user_id"]),
    supervisedArea() {
      if (this.selected_customer) {
        return this.selected_customer.is_supervised ? "supervised-area" : "";
      }
      return "";
    },
  },
  watch: {
    messages() {
      this.addChatItem();
    },
    suggestion(newVal) {
      if (newVal != "") {
        this.value = newVal;
        document.getElementById("textarea-no-resize").focus();
        this.$store.dispatch("app/selSuggestion", "");
      }
    }
  },
  data() {
    return {
      value: "",
      ref: firebase.database().ref("chat"),
      timer_flag: false,
      msgAutoId: "",
      writing_interval: null,
      curVal: ""
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    addTags() {
      let selTags = this.btnTags.filter(btn => btn.state == true);
      let captions = [];
      for (let i = 0; i < selTags.length; i++) {
        captions.push(selTags[i].caption);
      }
      this.$store.dispatch("app/setTags", {index: this.selected_customer.index, tags: JSON.stringify(captions)});
      let customer_id = this.selected_customer.id;
      addCustomerTags({ id: customer_id, tags: captions });
    },
    addChatItem() {
      if (this.selected_customer != undefined) {
        let self = this;
        Vue.nextTick(function() {
          self.scrollToEnd();
        });
      }
    },
    scrollToEnd() {
      var container = document.getElementById("chatarea");
      container.scrollTop = container.scrollHeight;
    },
    newLine() {
      this.value = `${this.value}\n`;
    },
    writingMsg() {
      if (this.timer_flag == false) {
        let chatSessionId = this.selected_customer.session_id;
        this.curVal = "";
        this.sendTypingMsg(chatSessionId);
        this.writing_interval = setInterval(
          this.sendTypingMsg,
          2000,
          chatSessionId
        );
        this.timer_flag = true;
      }
    },
    sendTypingMsg(chatSessionId) {
      if (this.curVal == this.value) {
        clearInterval(this.writing_interval);
        if (this.msgAutoId)
          this.ref
            .child(chatSessionId)
            .child(this.msgAutoId)
            .update({
              chat_type: 5,
              message: this.value,
              created_at: Date.now()
            });
        this.curVal = "";
        this.timer_flag = false;
      } else {
        this.curVal = this.value;
        if (this.msgAutoId == "") {
          this.msgAutoId = this.ref.child(chatSessionId).push().key;
          this.ref
            .child(chatSessionId)
            .child(this.msgAutoId)
            .set({
              admin_id: this.user_id,
              chat_session_id: chatSessionId,
              chat_type: 5,
              created_at: Date.now(),
              is_read: 0,
              message: this.value,
              site_no: this.site_no,
              type: 1
            });
        } else {
          this.ref
            .child(chatSessionId)
            .child(this.msgAutoId)
            .update({
              chat_type: 5,
              message: this.value,
              created_at: Date.now()
            });
        }
      }
    },
    sendMsg() {
      if (this.value == "") return;
      let chatSessionId = this.selected_customer.session_id;
      let pushData = {
        admin_id: this.user_id,
        chat_session_id: chatSessionId,
        chat_type: 0,
        created_at: Date.now(),
        is_read: 0,
        message: this.value,
        site_no: this.site_no,
        type: 1,
        filename: ""
      };
      if (this.msgAutoId) {
        this.ref
          .child(chatSessionId)
          .child(this.msgAutoId)
          .remove();
        this.ref.child(chatSessionId).push(pushData);
      } else {
        this.ref.child(chatSessionId).push(pushData);
      }
      addNewMsg(pushData);
      this.value = "";
      this.timer_flag = false;
      this.msgAutoId = "";
      if (this.writing_interval != null) clearInterval(this.writing_interval);
    },
    removeChatSession(sessionId) {
      this.$emit("removeChatSession", sessionId);
    }
  },
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

.supervised-area {
  background: $supervisedAreaBgColor;
}
</style>

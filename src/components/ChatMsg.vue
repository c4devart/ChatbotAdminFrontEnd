<template>
  <li :class="isOwn">
    <div v-if="isMessageWrapper" class="message-wrapper">
      <span class="chat-time">{{ getDate }}</span>
      <div v-if="avatarType == 'User'" class="user-symbol-container">
        <span class="symbol-content">{{ nameShortCut }}</span>
      </div>
      <img
        v-if="avatarType == 'Operator'"
        src="@/assets/imgs/avatar.png"
        class="avatar"
      />
      <img
        v-if="avatarType == 'Bot'"
        src="@/assets/imgs/bot_logo.png"
        class="avatar"
      />
      <div class="message">
        <span class="body">{{ data.message }}</span>
      </div>
      <div class="clearfix"></div>
    </div>
    <div v-if="isCustomerWrapper" class="customer-wrapper">
      <span class="chat-time">{{ getDate }}</span>
      <div class="user-symbol-container">
        <span class="symbol-content">{{ nameShortCut }}</span>
      </div>
      <div class="info-wrapper">
        <p v-if="data.chat_type == 1">
          <span>{{ $t("name") }}: </span>
          {{ data.message }}
        </p>
        <p v-if="data.chat_type == 2">
          <span>{{ $t("email") }}: </span>
          {{ data.message }}
        </p>
      </div>
      <div class="clearfix"></div>
    </div>
    <div v-if="isSystemWrapper" class="system-wrapper">
      <span class="chat-time">{{ getDate }}</span>
      <div class="text">
        <div class="left-line"></div>
        <div class="system-message">{{ data.message }}</div>
        <div class="right-line"></div>
      </div>
      <a
        v-if="data.type == 7 && selected_customer.chat_closed"
        href="javascript:;"
        @click="closedChat"
        class="close-link"
        >{{ $t("close_this_chat") }}</a
      >
      <div class="clearfix"></div>
    </div>
    <div v-if="isRateWrapper" class="rate-wrapper">
      <span class="chat-time">{{ getDate }}</span>
      <div class="message">
        <p class="rate-desc">{{ $t("rate_desc", { mark: data.mark }) }}</p>
        <star-rating
          :rating="parseInt(data.mark)"
          :star-size="15"
          :read-only="true"
          :show-rating="false"
          :rounded-corners="true"
          active-color="#fd7e14"
          inactive-color="#b3b7bb"
        ></star-rating>
        <p v-if="data.message" class="comment">{{ data.message }}</p>
      </div>
      <div class="clearfix"></div>
    </div>
    <div v-if="data.type == 2 && data.chat_type == 5" class="pending-message">
      <div v-if="avatarType == 'User'" class="user-symbol-container">
        <span class="symbol-content">{{ nameShortCut }}</span>
      </div>
      <div class="message">
        <span class="body">{{ data.message }}</span>
      </div>
      <div class="clearfix"></div>
    </div>
  </li>
</template>

<script>
import StarRating from "vue-star-rating";
import { mapGetters } from "vuex";
export default {
  components: {
    StarRating
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(["selected_customer"]),
    isOwn() {
      let ownType = "";
      if (this.data.type == 6 || this.data.type == 7 || this.data.type == 8)
        ownType = "middle";
      if (
        this.data.type == 5 ||
        this.data.type == 3 ||
        this.data.type == 0 ||
        (this.data.type == 1 && this.data.chat_type != 5)
      )
        ownType = "out";
      if (this.data.type == 2 || this.data.type == 4) ownType = "in";
      return ownType;
    },
    nameShortCut() {
      if (this.selected_customer && this.selected_customer.name) {
        return this.selected_customer.name.substring(0, 2).toUpperCase();
      } else {
        return this.$t("unnamed_visitor")
          .substring(0, 2)
          .toUpperCase();
      }
    },
    getDate() {
      var date = new Date(this.data.created_at);
      // var month = date.getMonth() + 1;
      // var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      // if (month < 10) {
      //   month = "0" + month;
      // }
      // if (day < 10) {
      //   day = "0" + day;
      // }
      // if (hour < 10) {
      //   hour = "0" + hour;
      // }
      // if (minute < 10) {
      //   minute = "0" + minute;
      // }

      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    avatarType() {
      let avatarType = "Operator";
      if (this.data.type == 2 || this.data.type == 4) avatarType = "User";
      else if (
        this.data.type == 0 ||
        this.data.type == 3 ||
        this.data.type == 5
      )
        avatarType = "Bot";
      return avatarType;
    },
    isMessageWrapper() {
      let isMessageWrapper = false;
      if (
        this.data.type != 6 &&
        this.data.type != 7 &&
        this.data.type != 8 &&
        this.data.chat_type == 0
      ) {
        isMessageWrapper = true;
        return isMessageWrapper;
      }
      if (
        this.data.type == 0 &&
        (this.data.chat_type == 1 || this.data.chat_type == 2)
      )
        isMessageWrapper = true;
      return isMessageWrapper;
    },
    isFileWrapper: {
      get() {
        let isFileWrapper = false;
        if (this.data.chat_type == 3 || this.data.chat_type == 4)
          isFileWrapper = true;
        return isFileWrapper;
      }
    },
    isCustomerWrapper: {
      get() {
        let isCustomerWrapper = false;
        if (
          this.data.type == 2 &&
          (this.data.chat_type == 1 || this.data.chat_type == 2)
        )
          isCustomerWrapper = true;
        return isCustomerWrapper;
      }
    },
    isSystemWrapper: {
      get() {
        let isSystemWrapper = false;
        if (this.data.type == 6 || this.data.type == 7) isSystemWrapper = true;
        return isSystemWrapper;
      }
    },
    isRateWrapper() {
      let isRateWrapper = false;
      if (this.data.type == 8) isRateWrapper = true;
      return isRateWrapper;
    }
  },
  data() {
    return {};
  },
  methods: {
    closedChat() {
      this.$store.dispatch("app/showChatClose", {
        closed: false,
        sessionId: this.data.chat_session_id
      });
      this.$emit("closedChat", this.data.chat_session_id);
    }
  }
};
</script>
<style lang="scss" scoped>
.chats {
  li {
    list-style: none;
    padding: 5px 0;
    margin: 10px auto;
    font-size: 14px;
    min-height: 41px;
    .chat-time {
      display: block;
      color: #424d57;
      font-size: 12px;
    }
    .avatar {
      height: 35px;
      width: 35px;
      border-radius: 50% !important;
    }
    .message {
      display: block;
      padding: 5px;
      position: relative;
      max-width: 60%;
      word-break: break-all;
    }
    .customer-wrapper p {
      padding: 10px 22px;
      color: #424d57;
      line-height: 1.5em;
      word-break: break-word;
      span {
        color: rgba(66, 77, 87, 0.6);
      }
    }
    .info-wrapper {
      float: left;
      p {
        margin: 0px;
        background: #f1f1f3;
        border-radius: 0px 30px 30px 30px;
      }
    }
  }
  li.in {
    text-align: left;
    color: black;
    .chat-time {
      margin: 0px 0px 5px 50px;
    }
    .user-symbol-container {
      float: left;
      margin-right: 10px;
      text-align: center;
      line-height: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 16px;
      opacity: 0.7;
      .symbol-content {
        display: block;
        width: 40px;
        height: 40px;
        color: rgb(255, 255, 255);
        overflow: hidden;
        border-radius: 50%;
        background: rgb(103, 172, 162);
      }
    }
    .message {
      float: left;
      padding: 10px 20px;
      background: #f1f1f3;
      border-radius: 0px 30px 30px 30px;
      word-spacing: initial;
      word-break: break-word;
    }
    .pending-message .message {
      background-image: url("~@/assets/imgs/writing@2x.gif");
      background-repeat: no-repeat;
      padding-left: 50px;
      background-position: 22px 8px;
      background-size: 24px 22px;
      font-style: italic;
      background-color: lightgrey;
    }
  }
  li.out {
    text-align: right;
    .chat-time {
      display: block;
      margin: 0px 45px 5px 0px;
      color: #424d57;
    }
    .avatar {
      float: right;
      margin-left: 10px;
    }
    .message {
      color: white;
      float: right;
      padding: 10px 20px;
      background: #4484ef;
      border-radius: 30px 0px 30px 30px;
    }
  }
  li.middle {
    text-align: center;
    padding: 10px 0px 10px 0px;
    .chat-time {
      font-size: 16px;
    }
    .text {
      display: flex;
      height: 30px;
      align-items: center;
      justify-content: center;
      text-align: center;
      .left-line,
      .right-line {
        height: 1px;
        flex-grow: 1;
        background-color: rgb(221, 226, 230);
        min-width: 8px;
      }
      .system-message {
        font-size: 15px;
        color: rgb(122, 130, 137);
        flex-grow: 0;
        max-width: 80%;
        line-height: 1.5;
        padding: 0px 20px;
      }
    }
    .close-link {
      text-decoration: underline;
    }
    .rate-wrapper {
      text-align: center;
      .message {
        margin: auto;
        width: 50%;
        padding: 10px 20px;
        background: #d5d7d8;
        border-radius: 20px 20px 20px 20px;
        word-spacing: initial;
        word-break: break-word;
      }
      .vue-star-rating {
        display: inline-block;
        margin-bottom: 10px;
      }
      .rate-desc {
        text-align: left;
        margin: 5px;
      }
      .comment {
        text-align: left;
        margin: 5px;
      }
    }
  }
}
</style>

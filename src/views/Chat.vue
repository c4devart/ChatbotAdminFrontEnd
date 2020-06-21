<template>
  <div class="h-full v-full">
    <audio id="incomingAlarm">
      <source src="@/assets/alert/incoming_chat.mp3" type="audio/mpeg" />
    </audio>
    <customer-list @fromListToParent="onClickItem" />
    <chat-container
      :messages="messages"
      :btnTags="btnTags"
      @removeChatSession="removeSession"
    />
    <bot-detail
      @fromDetailToParent="onAcceptOrWatch"
      @updateSuggestions="updateSuggestions"
      :suggestions="suggestions"
      :keywords="keywords"
    />
  </div>
</template>

<script>
import CustomerList from "@/components/CustomerList.vue";
import BotDetail from "@/components/BotDetail.vue";
import ChatContainer from "@/components/ChatContainer";
import firebase from "../firebase";
import { mapGetters } from "vuex";
import { addNewMsg, getSuggestionsByAWS } from "@/api/chat";

let ref = firebase.database().ref("chat");

export default {
  name: "Chat",
  components: {
    CustomerList,
    BotDetail,
    ChatContainer
  },
  computed: {
    ...mapGetters([
      "user_id",
      "selected_customer",
      "roles",
      "selected_index",
      "site_no",
      "new_customers"
    ])
  },
  watch: {
    keywords(newVal) {
      this.keywords = newVal;
    }
  },
  async mounted() {
    this.audioPlayer = this.$el.querySelector("#incomingAlarm");
    if (this.selected_customer != undefined) {
      // let sessionId = this.selected_customer.session_id;
      // let resp = await getChatsBySessionId({
      //   chat_session_id: sessionId,
      //   admin_id: this.user_id
      // });
      // this.messages = resp.data;

      // for(var i=0; i<this.new_customers.length; i++) {
      //   if(this.new_customers[i].is_accepted || this.new_customers[i].is_supervised) {
      //     this.addChildEventListener(this.new_customers[i].session_id);
      //   }
      // }
      this.addChildEventListener(this.selected_customer.session_id);
      this.setTags();
    }
    this.$store.dispatch("app/initUnreadCount");
  },
  data() {
    return {
      messages: [],
      suggestions: [],
      keywords: [],
      typingMsgIdx: 0,
      audioPlayer: null,
      btnTags: [
        { caption: this.$t("tags.blacklist"), state: false },
        { caption: this.$t("tags.suspicious"), state: false },
        { caption: this.$t("tags.good"), state: false },
        { caption: this.$t("tags.spam"), state: false }
      ]
    };
  },
  methods: {
    onClickItem(sessionId) {
      // let index = args.index;
      // let resp = await getChatsBySessionId({
      //   chat_session_id: sessionId,
      //   admin_id: this.user_id
      // });
      // this.messages = resp.data;
      this.messages = [];
      this.setTags();
      this.addChildEventListener(sessionId);
    },
    setTags() {
      if(this.selected_customer.tags) {
        var tags = JSON.parse(this.selected_customer.tags);
        for(var i = 0; i < this.btnTags.length; i++) {
          if(tags.includes(this.btnTags[i].caption)) {
            let btnTag = this.btnTags[i];
            btnTag.state = true;
            this.btnTags.splice(i, 1, btnTag);
          } else {
            let btnTag = this.btnTags[i];
            btnTag.state = false;
            this.btnTags.splice(i, 1, btnTag);
          }
        }
      } else {
        this.btnTags = [
          { caption: this.$t("tags.blacklist"), state: false },
          { caption: this.$t("tags.suspicious"), state: false },
          { caption: this.$t("tags.good"), state: false },
          { caption: this.$t("tags.spam"), state: false }
        ];
      }
    },
    updateSuggestions(suggestions) {
      this.suggestions = suggestions;
    },
    onAcceptOrWatch(args) {
      let sessionId = args.sessionId;
      let isAccepted = args.isAccepted;
      this.onClickItem(sessionId);

      if (isAccepted) {
        let chatParams = {
          chat_session_id: sessionId,
          message: this.$t("common_question_1"),
          is_read: 0,
          admin_id: this.user_id,
          type: 1,
          chat_type: 0,
          created_at: Date.now(),
          site_no: this.site_no,
          filename: ""
        };
        ref.child(sessionId).push(chatParams);
        addNewMsg(chatParams);
      }
    },

    receiveTypingMsg(data, eventType) {
      if (eventType == "added") {
        this.typingMsgIdx = this.messages.length - 1;
      } else if (eventType == "changed") {
        this.messages[this.typingMsgIdx].message = data.message;
      } else {
        if (this.typingMsgIdx != 0) {
          this.messages.splice(this.typingMsgIdx, 1);
          this.typingMsgIdx = 0;
        }
      }
    },

    addChildEventListener(sessionId) {
      ref.child(sessionId).off();
      let self = this;
      let initTime = Date.now();
      ref.child(sessionId).on("child_added", function(snapshot) {
        // waiting for response
        if (self.selected_customer.show_alert) {
          // if(snapshot.val().type == 7) {
          //   console.log('here');
          //   self.messages.push(snapshot.val());
          //   self.$store.dispatch("app/showChatClose", {closed: true, sessionId: snapshot.val().chat_session_id});
          //   ref.child(sessionId).off();
          // }
          if (snapshot.val().admin_id == 0 && snapshot.val().type != 6) {
            self.messages.push(snapshot.val());
          } else {
            if (snapshot.val().admin_id != self.user_id) {
              self.selected_customer.is_acceptable = false;
            }
          }
          if (snapshot.val().type == 7) {
            if (
              self.selected_customer.session_id ==
              snapshot.val().chat_session_id
            ) {
              self.messages.push(snapshot.val());
              self.$store.dispatch("app/showChatClose", {
                closed: true,
                sessionId: snapshot.val().chat_session_id
              });
              ref.child(sessionId).off();
            } else {
              self.increaseUnreadCnt(snapshot.val().chat_session_id, 7);
            }
          }
        } else {
          if (
            self.selected_customer.session_id == snapshot.val().chat_session_id
          ) {
            if (snapshot.val().chat_type != 5) {
              self.messages.push(snapshot.val());
              if (snapshot.val().type != 8)
                self.$store.dispatch("app/updateLastMessage", {
                  sessionId: snapshot.val().chat_session_id,
                  lastMsg: snapshot.val().message
                });
            }
            if (snapshot.val().type == 2 && snapshot.val().chat_type == 5) {
              self.messages.push(snapshot.val());
              self.receiveTypingMsg(snapshot.val(), "added");
            }
            if (
              initTime < snapshot.val().created_at &&
              snapshot.val().type == 2 &&
              snapshot.val().chat_type == 0
            ) {
              getSuggestionsByAWS({ text: snapshot.val().message }).then(
                response => {
                  const { code, data } = response;
                  if (code === 20000) {
                    self.suggestions = data.suggestions;
                    self.keywords = data.keywords;
                  }
                }
              );
              self.receiveTypingMsg(snapshot.val(), "removed");
            }
            if (
              initTime < snapshot.val().created_at &&
              snapshot.val().type != 1 &&
              snapshot.val().chat_type != 5
            ) {
              if (self.$router.currentRoute.path != "/chat")
                self.$store.dispatch("app/increaseUnreadCount");
              self.playAlarm();
            }
            if (
              snapshot.val().admin_id != 0 &&
              snapshot.val().admin_id != self.user_id
            ) {
              self.selected_customer.is_acceptable = false;
            }
          } else {
            //invisible chat session
            if (
              (snapshot.val().type == 2 && snapshot.val().chat_type != 5) ||
              snapshot.val().type == 6 ||
              snapshot.val().type == 7
            ) {
              self.increaseUnreadCnt(snapshot.val().chat_session_id);
              self.$store.dispatch("app/updateLastMessage", {
                sessionId: snapshot.val().chat_session_id,
                lastMsg: snapshot.val().message
              });
              if (self.$router.currentRoute.path != "/chat")
                self.$store.dispatch("app/increaseUnreadCount");
            }
          }
          if (snapshot.val().type == 7) {
            self.$store.dispatch("app/showChatClose", {
              closed: true,
              sessionId: snapshot.val().chat_session_id
            });
            // ref.child(sessionId).off();
            // self.removeSession(snapshot.val().chat_session_id);
          }
        }
      });

      ref.child(sessionId).on("child_changed", function(snapshot) {
        if (
          self.selected_customer.session_id == snapshot.val().chat_session_id
        ) {
          if (snapshot.val().type == 2 && snapshot.val().chat_type == 5) {
            self.receiveTypingMsg(snapshot.val(), "changed");
          }
        }
      });
    },

    removeSession(sessionId) {
      ref.child(sessionId).off();
      this.$store.dispatch("app/removeChatSession", sessionId);
      this.messages = [];
      if (this.selected_customer != undefined) {
        this.onClickItem(this.selected_customer.session_id);
      }
      /** Initialize data */
      this.suggestions = [];
      this.keywords = [];
    },

    increaseUnreadCnt(sessionId, type = 0) {
      this.playAlarm();
      this.$store.dispatch("app/setUnreadCnt", {
        sessionId: sessionId,
        type: type
      });
    },

    playAlarm() {
      if (this.audioPlayer != null) {
        this.audioPlayer.play();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

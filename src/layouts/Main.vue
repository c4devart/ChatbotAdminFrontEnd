<template>
  <div class="v-full h-full">
    <audio id="incomingAlarm">
      <source src="@/assets/alert/incoming_chat.mp3" type="audio/mpeg" />
    </audio>
    <navbar />
    <menubar />
    <div class="app-container pos-rel">
      <router-view />
    </div>
  </div>
</template>

<script>
import { getNewCustomer } from "@/api/chat";
// import { sendNotification } from "@/api/notification";
import Navbar from "./Navbar.vue";
import Menubar from "./Menubar";
import firebase from "../firebase";
import { mapGetters } from "vuex";

export default {
  components: {
    Navbar,
    Menubar
  },
  computed: {
    ...mapGetters([
      "unread_count",
      "site_no",
      "incoming_alarm",
      "new_customers",
      "user_id"
    ])
  },
  data() {
    return {
      ref: firebase.database().ref("chat"),
      fcmKeyPair:
        "BMAq3-5ZCLoGsX8H1i1RlBVbsV6Vgffn9vAIJIkGCv-GldoThdkjhd9EZ1HAse1aER42gYWhnNRyyqTV2bhKcug",
      token: "",
      audioPlayer: null
    };
  },
  mounted() {
    this.audioPlayer = this.$el.querySelector("#incomingAlarm");
    // const messaging = firebase.messaging();
    // messaging.usePublicVapidKey(this.fcmKeyPair);
    // messaging
    //   .requestPermission()
    //   .then(() => firebase.messaging().getToken())
    //   .then(token => {
    //     console.log(token);
    //     this.token = token; // Receiver Token to use in the notification
    //   })
    //   .catch(function(err) {
    //     console.log("Unable to get permission to notify.", err);
    //   });

    // messaging.onTokenRefresh(function() {
    //   messaging
    //     .getToken()
    //     .then(function(refreshedToken) {
    //       console.log("onTokenRefresh getToken", refreshedToken);
    //       this.token = refreshedToken;
    //     })
    //     .catch(function(err) {
    //       console.log(
    //         "onTokenRefresh getToken Unable to retrieve refreshed token ",
    //         err
    //       );
    //     });
    // });

    // messaging.onMessage(function(payload) {
    //   console.log("Message received. ", payload);
    // });

    var childRef = this.ref;
    // var adminId = this.user_id;
    let self = this;
    childRef.on("child_changed", async function(snapshot) {
      const s = await childRef
        .child(snapshot.key)
        .orderByChild("created_at")
        .limitToLast(1)
        .once("value");
      s.forEach(async function(data) {
        if (data.val().type == 5 && data.val().site_no == self.site_no) {
          let sessionId = data.val().chat_session_id;
          let resp = await getNewCustomer({ chat_session_id: sessionId });
          let newCustomer = resp.data[0];
          // sendNotification({
          //   token: self.token,
          //   customer_name: newCustomer.name
          // });
          newCustomer.active = false; // selected or not
          newCustomer.show_alert = true; // accept or watch new chat
          newCustomer.is_accepted = false; // accepted or not
          newCustomer.is_supervised = false; // supervised or not
          newCustomer.isNew = true; // new customer coming
          newCustomer.unread_cnt = 0;
          newCustomer.is_acceptable = true;
          newCustomer.is_supervisable = true;
          newCustomer.chat_closed = false;

          self.$store.dispatch("app/setNewCustomer", newCustomer);
          if (self.$router.currentRoute.path != "/chat")
            self.$store.dispatch("app/increaseUnreadCount");
          //play incomming chat alarm!
          //self.$store.dispatch("app/setIncomingAlarm", true);
          self.playAlarm();
        }
        // In case of staying on other page
        // if (data.val().admin_id == self.user_id && data.val().chat_type != 5) {
        //   console.log('here');
        //   self.$store.dispatch("app/increaseUnreadCount");
        //   self.playAlarm();
        // }
      });
    });
  },
  beforeDestroy() {
    this.ref.off("child_changed");
    this.$store.dispatch("app/initNewCustomers");
  },
  methods: {
    playAlarm() {
      if (this.audioPlayer != null) {
        this.audioPlayer.play();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

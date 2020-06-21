<template>
  <div class="h-full v-full">
    <archive-customer-list
      :customers="customers"
      @fromListToParent="onClickItem"
      @handleSearch="handleSearch"
    />
    <archive-chat-container
      :customer="customer"
      :messages="messages"
    />
    <archive-customer-detail :customer="customer" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getChatArchives, getArchiveChatsBySessionId } from "@/api/chat";
import ArchiveCustomerList from "@/components/ArchiveCustomerList.vue";
import ArchiveCustomerDetail from "@/components/ArchiveCustomerDetail.vue";
import ArchiveChatContainer from "@/components/ArchiveChatContainer";

export default {
  components: {
    ArchiveChatContainer,
    ArchiveCustomerList,
    ArchiveCustomerDetail
  },
  computed: {
    ...mapGetters(["user_id"])
  },
  async created() {
    try {
      let resp1 = await getChatArchives({ admin_id: this.user_id });
      this.customers = resp1.data;
      for (let i = 0; i < this.customers.length; i++) {
        if (i == 0) {
          this.customers[i].active = true;
        } else {
          this.customers[i].active = false;
        }
      }
      let resp2 = await getArchiveChatsBySessionId({
        chat_session_id: this.customers[0].session_id,
        admin_id: this.user_id
      });
      this.messages = resp2.data;
      this.customer.name = this.customers[0].name;
      this.customer.email = this.customers[0].email;
      this.customer.ip_address = this.customers[0].ip_address;
      this.customer.device = this.customers[0].device;
      this.customer.browser = this.customers[0].browser;
      this.customer.lat = this.customers[0].lat;
      this.customer.lng = this.customers[0].lng;
      this.customer.location = this.customers[0].location;
      this.customer.no_of_chat = this.customers[0].no_of_chat;
      this.customer.latest = this.customers[0].latest;
      this.customer.from = this.customers[0].from;
      this.customer.tags = this.customers[0].tags;
    } catch (err) {
      this.customers = [];
    }
  },
  data() {
    return {
      customer: {
        name: "",
        email: "",
        ipaddress: "",
        device: "",
        browser: "",
        lat: "",
        lng: "",
        location: "",
        noOfChat: 0,
        lastSeen: "",
        from: "",
        tags: ""
      },
      messages: [],
      customers: []
    };
  },
  methods: {
    async onClickItem(args) {
      this.messages = [];
      let resp = await getArchiveChatsBySessionId({
        chat_session_id: args.sessionId,
        admin_id: this.user_id
      });
      this.messages = resp.data;
      this.customer = this.customers[args.index];
    },
    async handleSearch(search) {
      let resp = await getChatArchives({
        admin_id: this.user_id,
        search: search
      });
      this.customers = resp.data;
      for (let i = 0; i < this.customers.length; i++) {
        if (i == 0) {
          this.customers[i].active = true;
        } else {
          this.customers[i].active = false;
        }
      }
      let resp2 = await getArchiveChatsBySessionId({
        chat_session_id: this.customers[0].session_id,
        admin_id: this.user_id
      });
      this.messages = resp2.data;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.chatarea-header {
  height: 35px;
  width: 100%;
  background: white;
  border: solid 1px grey;
}
</style>

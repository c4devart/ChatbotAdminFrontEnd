<template>
  <div class="bot-detail-list v-full">
    <div class="bot-detail-list--header flex-space-between-vc"></div>
    <div class="bot-detail-list--content no-scrollbar">
      <archive-general-info-card
        :generalinfo="{
          name: customer.name,
          email: customer.email,
          location: customer.location,
          lat: customer.lat,
          lng: customer.lng
        }"
      />
      <archive-technology-card
        :technology="{
          ip_address: customer.ip_address,
          device: customer.device,
          browser: customer.browser
        }"
      />
      <archive-additional-info-card
        :additionalInfo="{
          no_of_chat: customer.no_of_chat,
          last_seen: customer.latest,
          from: customer.from
        }"
      />
    </div>
  </div>
</template>

<script>
import ArchiveTechnologyCard from "@/components/ArchiveTechnologyCard";
import ArchiveGeneralInfoCard from "@/components/ArchiveGeneralInfoCard";
import ArchiveAdditionalInfoCard from "@/components/ArchiveAdditionalInfoCard";

export default {
  name: "ArchiveCustomerDetail",
  components: {
    ArchiveTechnologyCard,
    ArchiveGeneralInfoCard,
    ArchiveAdditionalInfoCard
  },
  props: {
    customer: Object
  },
  computed: {},
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";

.bot-detail-list {
  width: $botDetailWidth;
  height: calc(100% - #{$navbarHeight});
  position: fixed;
  top: $navbarHeight;
  right: 0;
  bottom: 0;
  background: $customerListBgColor;
  border-left: 1px $containerBorderColor solid;

  .bot-detail-list--header {
    height: $botDetailListHeaderHeight;
    justify-content: center;
    border-bottom: 2px $containerBorderColor solid;
    .operator {
      max-width: 200px;
      margin: auto;
    }
  }

  .bot-detail-list--content {
    margin: 5px;
    height: calc(100% - #{$botDetailListHeaderHeight});
  }

  .alert {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 5px;
    .btn-accept {
      width: 45%;
    }
    .btn-watch {
      width: 45%;
    }
  }
}
</style>

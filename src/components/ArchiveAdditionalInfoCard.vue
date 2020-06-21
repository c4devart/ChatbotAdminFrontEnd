<template>
  <detail-card v-if="additionalInfo.no_of_chat != undefined" :title="$t('additionalInfo')">
    <div slot="content">
      <div class="additional-info">
        <span
          v-if="additionalInfo.no_of_chat > 1"
          v-html="$t('returning_visitor')"
        ></span>
        <span v-else v-html="$t('new_visitor')"></span>:
        <span class="spec">{{ additionalInfo.no_of_chat }} chats</span>
        <br />
        <span v-html="$t('Last seen')"></span>:
        <span class="spec">{{ formattedTime }}</span> <br />
        <span v-html="$t('Came from')"></span>:
        <span class="spec"
          ><a :href="additionalInfo.from" target="_blank">{{
            additionalInfo.from
          }}</a></span
        >
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "ArchiveAdditionalInfoCard",
  components: {
    DetailCard
  },
  props: {
    additionalInfo: Object
  },
  computed: {
    ...mapGetters(["site_link"]),
    formattedTime() {
      let latest = this.additionalInfo.latest;
      return moment(latest).format("MMMM D, h:mm a");
    }
  },
  created() {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.additional-info {
  margin-left: 10px;
  color: $specLabelColor;
  .spec {
    padding: 3px 0px;
    color: $specColor;
    &:last-child {
      padding: 0px;
    }
  }
}
</style>

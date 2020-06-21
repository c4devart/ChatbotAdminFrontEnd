<template>
  <detail-card v-if="selected_customer" :title="$t('additionalInfo')">
    <div slot="content">
      <div class="additional-info">
        <span
          v-if="selected_customer.no_of_chat - 1 > 0"
          v-html="$t('returning_visitor')"
        ></span>
        <span v-else v-html="$t('new_visitor')"></span>:
        <span class="spec">{{ selected_customer.no_of_chat }} chats</span>
        <br />
        <span v-html="$t('Last seen')"></span>:
        <span class="spec">{{ formattedTime }}</span> <br />
        <span v-html="$t('Came from')"></span>:
        <span class="spec"
          ><a :href="selected_customer.from" target="_blank">{{
            selected_customer.from
          }}</a></span
        >
        <br />
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "AdditionalInfoCard",
  components: {
    DetailCard
  },
  computed: {
    ...mapGetters(["selected_customer", "site_link"]),
    formattedTime() {
      let latest = this.selected_customer.last_seen;
      return moment(latest).format("MMMM D, h:mm a");
    }
  },
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

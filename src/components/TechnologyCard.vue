<template>
  <detail-card v-if="selected_customer" :title="$t('technology')">
    <div slot="content">
      <div class="technology-specs">
        <span v-html="$t('ipAddress')"></span>:
        <span class="spec">{{
          selected_customer.ip_address ? selected_customer.ip_address : "N/A"
        }}</span>
        <br />
        <span v-html="$t('OS/Device')"></span>:
        <span class="spec">{{
          selected_customer.device ? selected_customer.device : "N/A"
        }}</span>
        <br />
        <span v-html="$t('Browser')"></span>:
        <span class="spec">{{
          selected_customer.browser ? selected_customer.browser : "N/A"
        }}</span>
        <br />
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";
import { mapGetters } from "vuex";

export default {
  name: "TechnologyCard",
  components: {
    DetailCard
  },
  computed: {
    ...mapGetters(["selected_customer"])
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.technology-specs {
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

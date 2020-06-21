<template>
  <detail-card
    v-if="technology.ip_address || technology.device || technology.browser"
    :title="$t('technology')"
  >
    <div slot="content">
      <div class="technology-specs">
        <span v-html="$t('ipAddress')"></span>:
        <span class="spec">{{
          technology.ip_address ? technology.ip_address : "N/A"
        }}</span>
        <br />
        <span v-html="$t('OS/Device')"></span>:
        <span class="spec">{{
          technology.device ? technology.device : "N/A"
        }}</span>
        <br />
        <span v-html="$t('Browser')"></span>:
        <span class="spec">{{
          technology.browser ? technology.browser : "N/A"
        }}</span>
        <br />
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";

export default {
  name: "ArchiveTechnologyCard",
  components: {
    DetailCard
  },
  props: {
    technology: Object
  },
  computed: {},
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

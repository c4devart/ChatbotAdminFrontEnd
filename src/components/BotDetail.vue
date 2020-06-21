<template>
  <div class="bot-detail-list v-full">
    <div class="bot-detail-list--header flex-space-between-vc">
      <!-- <b-form-select
        v-if="operatorSelect"
        v-model="selected"
        :options="options"
        size="sm"
        class="operator"
      ></b-form-select> -->
    </div>
    <div class="bot-detail-list--content no-scrollbar">
      <b-alert
        v-if="selected_customer && selected_customer.show_alert"
        variant="warning"
        show
        fade
        class="mb-1"
      >
        <span class="customer-coming">{{ $t("new_customer_alert") }}</span>
        <span
          v-if="!selected_customer.is_acceptable"
          class="already-accepted-msg"
          >{{ $t("already_accepted") }}</span
        >
        <div class="actions mt-2 mb-1">
          <b-button
            v-if="selected_customer.is_acceptable"
            variant="success"
            class="btn-accept"
            @click="acceptChat"
            >{{ $t("accept") }}</b-button
          >
          <b-button
            v-if="selected_customer.is_supervisable"
            variant="secondary"
            class="btn-watch ml-2"
            @click="watchChat"
            >{{ $t("watch") }}</b-button
          >
        </div>
      </b-alert>
      <search-card
        @keywordSelected="getSuggestionsBykeyword"
        :results="suggestions"
        :preKeywords="keywords"
      />
      <general-info-card />
      <technology-card />
      <additional-info-card />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getChatOperators, getSuggestionsByKeyword } from "@/api/chat";
import SearchCard from "@/components/SearchCard";
import TechnologyCard from "@/components/TechnologyCard";
import GeneralInfoCard from "@/components/GeneralInfoCard";
import AdditionalInfoCard from "@/components/AdditionalInfoCard";

export default {
  name: "BotDetail",
  components: {
    SearchCard,
    TechnologyCard,
    GeneralInfoCard,
    AdditionalInfoCard
  },
  props: {
    suggestions: {
      type: Array,
      default() {
        return [];
      }
    },
    keywords: {
      type: Array,
      default() {
        return [];
      }
    },
    operatorSelect: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["user_id", "selected_customer", "selected_index", "site_no"])
  },
  data() {
    return {
      selected: "",
      options: [{ value: "", text: "Operator" }]
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    acceptChat() {
      this.$store.dispatch("app/acceptChat", this.selected_index);
      this.$store.dispatch("app/hideAlert", this.selected_index);
      let sessionId = this.selected_customer.session_id;
      this.$emit("fromDetailToParent", {
        sessionId: sessionId,
        isAccepted: true
      });
    },
    watchChat() {
      this.$store.dispatch("app/watchChat", this.selected_index);
      this.$store.dispatch("app/hideAlert", this.selected_index);
      let sessionId = this.selected_customer.session_id;
      this.$emit("fromDetailToParent", {
        sessionId: sessionId,
        isAccepted: false
      });
    },
    async getSuggestionsBykeyword(selectedKeywords) {
      let resp = await getSuggestionsByKeyword({
        keywords: selectedKeywords
      });
      let suggestions = resp.data;
      this.$emit("updateSuggestions", suggestions);
    }
  },
  created: async function() {
    try {
      let resp = await getChatOperators({ admin_id: this.user_id });
      this.options = resp.data;
      this.options.unshift({ value: "", text: this.$t("select_operator") });
    } catch (err) {
      this.options = [{ value: "", text: this.$t("no_operator") }];
    }
  }
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

  .alert-warning {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 5px;
    border: 2px red solid;
    .btn-accept {
      width: 45%;
    }
    .btn-watch {
      width: 45%;
    }
  }
}

.customer-coming {
  display: block;
}

.already-accepted-msg {
  display: block;
  font-size: 16px;
}
</style>

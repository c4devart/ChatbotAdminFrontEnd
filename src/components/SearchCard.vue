<template>
  <detail-card
    v-if="selected_customer && selected_customer.is_accepted"
    :title="$t('suggestions')"
  >
    <div slot="content">
      <div class="search-input">
        <!-- <b-input-group class="mt-3">
          <template v-slot:append>
            <b-input-group-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-text>
          </template>
          <b-form-input
            v-model="searchkey"
            :placeholder="$t('searchPlaceholder')"
          ></b-form-input>
        </b-input-group> -->
        <multiselect
          v-model="selectedKeywords"
          :multiple="true"
          track-by="id"
          label="keyword"
          :searchable="true"
          :closeOnSelect="true"
          :options="keywordList"
          :hide-selected="true"
          :taggable="true"
          @input="onInput"
          @tag="addTag"
          :clearAllButton="true"
          :placeholder="$t('select_keyword')"
          :selectLabel="$t('enter_select')"
          :tagPlaceholder="$t('tag_placeholder')"
          :deselectLabel="$t('enter_select')"
          :showLabels="false"
        >
        </multiselect>
      </div>
      <div class="search-results">
        <search-result v-for="(result, i) in results" :key="i" :data="result" />
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";
import SearchResult from "@/components/SearchResult";
import Multiselect from "vue-multiselect";
import { mapGetters } from "vuex";
import { getKeywordList } from "@/api/category";

export default {
  name: "SearchCard",
  components: {
    DetailCard,
    SearchResult,
    Multiselect
  },
  props: {
    results: {
      type: Array,
      default() {
        return [];
      }
    },
    preKeywords: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters(["selected_customer"])
  },
  watch: {
    preKeywords(newVal) {
      // remove duplicates
      this.selectedKeywords = newVal.reduce((unique, o) => {
        if (
          !unique.some(
            obj => obj.keyword.toLowerCase() === o.keyword.toLowerCase()
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);
    }
  },
  data() {
    return {
      keywordList: [],
      selectedKeywords: []
    };
  },
  mounted() {
    this.getAllKeywords();
    this.selectedKeywords = this.preKeywords;
  },
  methods: {
    getAllKeywords() {
      getKeywordList({
        is_deleted: 0
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.keywordList = data;
        }
      });
    },
    addTag(newTag) {
      this.selectedKeywords.push({ id: 0, keyword: newTag });
      // this.keywordList.push({ id: 0, keyword: newTag });
      this.$emit("keywordSelected", this.selectedKeywords);
    },
    onInput(option) {
      this.$emit("keywordSelected", option);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-input {
  margin-top: 10px;
  margin-bottom: 10px;
}
.search-results {
  margin-top: 10px;
  margin-bottom: 10px;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

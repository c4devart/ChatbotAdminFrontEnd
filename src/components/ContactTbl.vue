<template>
  <div>
    <!-- <div class="filter-box mb-4">
    <span>{{$t('searchLabel')}} : </span><b-form-input class="search mr-4" :placeholder="$t('searchPlaceholder')"></b-form-input>
    <span>{{$t('statusLabel')}} : </span><b-form-select class="status mr-4" v-model="selected" :options="options"></b-form-select>
    </div> -->
    <b-row>
      <b-col lg="3">
        <b-form-group
          :label="$t('filter') + ' : '"
          label-cols-md="3"
          label-align-md="left"
          label-size="md"
          label-for="filterInput"
        >
          <b-input-group size="md">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              :placeholder="$t('filter_placeholder')"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">
                {{ $t("clear") }}
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="3">
        <b-form-group
          :label="$t('status') + ' : '"
          label-cols-md="3"
          label-align-md="left"
          label-size="md"
          label-for="statusFilterSelect"
        >
          <b-input-group size="md">
            <b-form-select
              v-model="statusFilter"
              :options="options"
              id="statusFilterSelect"
              :placeholder="$t('statusFilter_placeholder')"
            ></b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table
      show-empty
      small
      stacked="md"
      hover
      bordered
      responsive=""
      tbody-tr-class="contacts-table-tr"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
    >
      <template v-slot:cell(name)="row">
        <div class="flex-row-hl-vc">
          <img src="@/assets/imgs/avatar.png" class="contact-avatar" />
          <div class="ml-2 mr-4">
            {{ row.item.name }}
          </div>
          <b-badge
            v-for="(tag, idx) in tags"
            :key="idx"
            pill
            variant="primary"
            class="mr-4"
          >
            {{ tag }}
          </b-badge>
        </div>
      </template>
      <template v-slot:cell(action)>
        <b-button size="md" variant="primary">
          {{ $t("enter") }}
        </b-button>
      </template>
      <template v-slot:cell(show_details)="row">
        <b-button
          size="md"
          @click="row.toggleDetails"
          class="mr-2"
          variant="primary"
        >
          {{ row.detailsShowing ? $t("hide_details") : $t("show_details") }}
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <rate-history :items="row.item.rate_history" />
        <chat-history :items="row.item.chat_history" />
      </template>
    </b-table>
    <b-row>
      <b-col sm="12" md="1">
        <b-form-group
          label=""
          label-cols-sm="0"
          label-cols-md="0"
          label-cols-lg="0"
          label-align-md="left"
          label-size="md"
          label-for="perPageSelect"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="md"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="12" md="11">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          size="md"
        ></b-pagination>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RateHistory from "@/components/RateHistory";
import ChatHistory from "@/components/ChatHistory";

export default {
  name: "ContactTbl",
  components: {
    RateHistory,
    ChatHistory
  },
  computed: {},
  props: {
    fields: {
      type: Array,
      default() {
        return [
          {
            key: "name",
            label: this.$t("name"),
            sortable: true,
            sortDirection: "desc",
            class: "text-center pt-3"
          },
          {
            key: "email",
            label: this.$t("email"),
            sortable: true,
            sortDirection: "desc",
            class: "text-center pt-3"
          },
          {
            key: "action",
            label: this.$t("action"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center pt-3"
          },
          {
            key: "status",
            label: this.$t("status"),
            sortable: true,
            sortDirection: "desc",
            class: "text-center pt-3"
          },
          {
            key: "operator",
            label: this.$t("operator"),
            sortable: true,
            sortDirection: "desc",
            class: "text-center pt-3"
          },
          {
            key: "show_details",
            label: this.$t("show_details"),
            class: " pt-3"
          }
        ];
      }
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tags: ["chatting", "idle"],
      selected: "chating",
      options: [
        { value: "chating", text: this.$t("chating") },
        { value: "busy", text: this.$t("busy") },
        { value: "idle", text: this.$t("idle") }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      filter: "",
      statusFilter: "idle"
    };
  },
  methods: {
    // reload() {
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.contact-avatar {
  border-radius: 50%;
  width: 30px;
}
.filter-box {
  .search {
    display: inline;
    width: $filterBoxWidth;
  }
  .status {
    display: inline;
    width: $filterBoxWidth;
  }
}
</style>

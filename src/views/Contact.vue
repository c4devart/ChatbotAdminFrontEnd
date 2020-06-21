<template>
  <div class="contact-container">
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
              @keyup.enter="handleFilter"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">
                {{ $t("clear") }}
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <!--b-col lg="3">
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
              @change="handleFilter"
            ></b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col-->
    </b-row>
    <b-table
      show-empty
      small
      stacked="md"
      hover
      bordered
      responsive=""
      head-variant="dark"
      tbody-tr-class="contacts-table-tr"
      @sort-changed="sortingChanged"
      :items="items"
      :fields="fields"
      :empty-text="$t('no_data')"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
    >
      <template v-slot:cell(index)="row">
        {{ (currentPage - 1) * perPage + row.index + 1 }}
      </template>
      <template v-slot:cell(name)="row">
        <div class="flex-row-hl-vc">
          <img src="@/assets/imgs/avatar.png" class="contact-avatar" />
          <div class="ml-2 mr-4">
            {{ row.item.name }}
          </div>
          <b-badge
            v-for="(tag, idx) in row.item.tags"
            :key="idx"
            pill
            variant="danger"
            class="mr-1"
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
      <template v-slot:cell(created_at)="row">
        <span>{{ row.item.created_at | formatDate }}</span>
      </template>
      <template v-slot:cell(status)="row">
        <b-badge pill :variant="options[row.item.status].variant" class="mr-4">
          {{ options[row.item.status].text }}
        </b-badge>
      </template>
      <template v-slot:cell(operator)>
        <span></span>
      </template>
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" variant="success" @click="row.toggleDetails">
          <vue-fontawesome
            icon="chevron-circle-down"
            size="1"
            color="white"
          ></vue-fontawesome>
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <rate-history :id="row.item.id" />
        <chat-history :id="row.item.id" />
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
          @change="paginationChanged"
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
import { listCustomer } from "@/api/customer";

export default {
  name: "Contact",
  components: {
    RateHistory,
    ChatHistory
  },
  computed: {},
  props: {},
  data() {
    return {
      fields: [
        {
          key: "index",
          label: this.$t("no"),
          sortable: false,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2 no_width"
        },
        {
          key: "name",
          label: this.$t("name"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "email",
          label: this.$t("email"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        /*{
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
        },*/
        {
          key: "ip_address",
          label: this.$t("ip"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "device",
          label: this.$t("device"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "browser",
          label: this.$t("browser"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "location",
          label: this.$t("location"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "created_at",
          label: this.$t("created_at"),
          sortable: true,
          sortDirection: "desc",
          class: "text-center pt-2 pb-2"
        },
        {
          key: "show_details",
          label: this.$t("show_details"),
          class: "text-center pt-2 pb-2"
        }
      ],
      items: [],
      options: [
        { value: 0, text: this.$t("chating"), variant: "primary" },
        { value: 1, text: this.$t("idle"), variant: "success" },
        { value: 2, text: this.$t("logout"), variant: "danger" }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50],
      filter: "",
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      statusFilter: -1
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    statusVariant() {},
    paginationChanged() {
      this.reload();
    },
    sortingChanged(ctx) {
      console.log(ctx);
      this.loadList();
      // ctx.sortBy   ==> Field key for sorting by (or null for no sorting)
      // ctx.sortDesc ==> true if sorting descending, false otherwise
    },
    handleFilter() {
      this.reload();
    },
    loadList() {
      listCustomer({
        keyword: this.filter,
        status: this.statusFilter,
        sort: this.sortBy,
        dir: this.sortDirection,
        page: this.currentPage,
        limit: this.perPage
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.totalRows = data.total;
          this.items = [];
          this.items = this.items.concat(data.items);
        }
      });
    },
    reload() {
      //this.currentPage = 1;
      this.loadList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.contact-container {
  padding: 20px;
  background: white;
}
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

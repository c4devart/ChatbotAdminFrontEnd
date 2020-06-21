<template>
  <div>
    {{ $t("rate_history") }}
    <b-table
      show-empty
      bordered
      hover
      responsive
      :fields="fields"
      :items="items"
    >
      <template v-slot:cell(date)="row">
        <span>{{ row.item.date | formatDate }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { rateDetail } from "@/api/customer";
export default {
  name: "RateHistory",
  components: {},
  computed: {},
  mounted() {
    this.reload();
  },
  props: {
    fields: {
      type: Array,
      default() {
        return [
          {
            key: "date",
            label: this.$t("date"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center"
          },
          {
            key: "mark",
            label: this.$t("mark"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center"
          },
          {
            key: "note",
            label: this.$t("Note"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center"
          }
        ];
      }
    },
    id: {
      type: Number,
      default: 0
    }
  },
  methods: {
    loadList() {
      rateDetail({
        id: this.id
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.items = [];
          for (let i = 0; i < data.length; i++) {
            this.items[i] = {
              date: data[i]["created_at"],
              mark: data[i]["mark"],
              note: data[i]["note"]
            };
          }
        }
      });
    },
    reload() {
      this.loadList();
    }
  },
  data() {
    return {
      items: []
    };
  }
};
</script>

<style lang="scss" scoped></style>

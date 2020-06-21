<template>
  <div>
    {{ $t("chat_history") }}
    <!-- Main table element -->
    <b-table
      show-empty
      small
      bordered
      responsive
      stacked="md"
      :items="items"
      :fields="fields"
    >
      <!-- <template v-slot:cell(actions)="row">
        <b-button
          size="sm"
          class="mr-2"
          variant="primary"
          @click="gotoHistory(row)"
        >
          {{ $t("go_to_history") }}
        </b-button>
      </template> -->
      <template v-slot:cell(date)="row">
        <span>{{ row.item.date | formatDate }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { chatDetail } from "@/api/customer";
export default {
  name: "ChatHistory",
  components: {},
  computed: {},
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
            key: "name",
            label: this.$t("name"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center"
          },
          {
            key: "email",
            label: this.$t("email"),
            sortable: false,
            sortDirection: "desc",
            class: "text-center"
          }
          /* {
            key: "actions",
            label: this.$t("actions"),
            sortable: false,
            class: "text-center"
          } */
        ];
      }
    },
    id: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.reload();
  },
  data() {
    return {
      filterOn: [],
      items: []
    };
  },
  methods: {
    loadList() {
      chatDetail({
        id: this.id
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.items = [];
          for (let i = 0; i < data.length; i++) {
            this.items[i] = {
              date: data[i]["started_at"],
              name: data[i]["name"],
              email: data[i]["email"],
              session_id: data[i]["session_id"]
            };
          }
        }
      });
    },
    reload() {
      this.loadList();
    },
    gotoHistory(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped></style>

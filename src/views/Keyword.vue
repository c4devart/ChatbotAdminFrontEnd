<template>
  <div class="h-full v-full no-scrollbar keyword-container">
    <div class="flex-space-between-vc">
      <b-button variant="primary" size="md" @click="add">
        {{ $t("add") }}
      </b-button>
      <b-form-input
        v-model="filter"
        type="search"
        class="filter-input"
        @keyup.enter="handleSearch"
        :placeholder="$t('filter_placeholder')"
      ></b-form-input>
    </div>
    <b-table
      show-empty
      small
      stacked="md"
      hover
      striped
      bordered
      head-variant="dark"
      responsive
      tbody-tr-class="contacts-table-tr"
      class="mt-4"
      @sort-changed="sortingChanged"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
    >
      <template v-slot:cell(index)="row">
        {{ (currentPage - 1) * perPage + row.index + 1 }}
      </template>
      <template v-slot:cell(action)="row">
        <b-button size="sm" variant="primary" @click="edit(row)">
          <vue-fontawesome icon="edit" size="1" color="white"></vue-fontawesome>
        </b-button>
        <b-button size="sm" variant="danger" class="ml-2" @click="del(row)">
          <vue-fontawesome
            icon="trash"
            size="1"
            color="white"
          ></vue-fontawesome>
        </b-button>
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
    <b-modal
      id="modal-prevent-closing"
      v-model="formModalShow"
      ref="modal"
      :title="isFormModalEdit ? $t('edit_keyword') : $t('add_keyword')"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="form_state.keyword"
          :label="$t('keyword_name')"
          label-for="keyword_name-input"
          :invalid-feedback="$t('keyword_name_required')"
        >
          <b-form-input
            id="keyword_name-input"
            v-model="form.keyword"
            :state="form_state.keyword"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { listKeyword, editKeyword, addKeyword } from "@/api/keyword";
import { deepClone } from "@/utils/index";

export default {
  name: "KeywordTbl",
  components: {},
  computed: {},
  props: {},
  data() {
    return {
      formModalShow: false,
      isFormModalEdit: false,
      form: {
        keyword: ""
      },
      form_state: {
        keyword: null
      },
      items: [],
      fields: [
        {
          key: "index",
          label: this.$t("no"),
          sortable: false,
          sortDirection: "asc",
          class: "text-center pt-3 no_width"
        },
        {
          key: "keyword",
          label: this.$t("keyword"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "action",
          label: this.$t("action"),
          sortable: false,
          sortDirection: "desc",
          class: "text-center pt-3"
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50],
      filter: "",
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc"
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    paginationChanged() {
      this.reload();
    },
    sortingChanged(ctx) {
      console.log(ctx);
      this.loadList();
      // ctx.sortBy   ==> Field key for sorting by (or null for no sorting)
      // ctx.sortDesc ==> true if sorting descending, false otherwise
    },
    handleSearch() {
      this.reload();
    },
    loadList() {
      listKeyword({
        keyword: this.filter,
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
      // this.currentPage = 1
      this.loadList();
    },
    add() {
      this.isFormModalEdit = false;
      this.formModalShow = true;
    },
    edit(row) {
      this.form = deepClone(row.item);
      this.form_state = {
        keyword: null
      };
      this.isFormModalEdit = true;
      this.formModalShow = true;
    },
    del(row) {
      this.$bvModal
        .msgBoxConfirm(this.$t("are_you_sure"))
        .then(value => {
          if (!value) {
            return;
          }
          editKeyword({
            id: row.item.id,
            is_deleted: 1
          }).then(response => {
            const { code } = response;
            if (code === 20000) {
              this.reload();
              this.showToast("success", "del_keyword_success");
            }
          });
        })
        .catch(err => {
          console.log(err);
          // An error occurred
        });
    },
    updateFormState() {
      this.form_state.keyword = this.form.keyword !== "";
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.updateFormState();
      return valid;
    },
    resetModal() {
      this.form = {
        keyword: ""
      };
      this.form_state = {
        keyword: null
      };
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      const uploadData = this.form;
      if (this.isFormModalEdit) {
        editKeyword(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.showToast("success", "edit_keyword_success");
              this.reload();
            } else {
              this.showToast("danger", "edit_keyword_failed");
            }
            this.hideFormModal();
          })
          .catch(err => {
            console.log(err);
            this.hideFormModal();
          });
      } else {
        addKeyword(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.reload();
              this.showToast("success", "add_keyword_success");
            } else {
              this.showToast("danger", "add_keyword_failed");
            }
            this.hideFormModal();
          })
          .catch(err => {
            console.log(err);
            this.hideFormModal();
          });
      }
    },
    hideFormModal() {
      this.$nextTick(() => {
        this.formModalShow = false;
        // this.$bvModal.hide('modal-prevent-closing')
      });
    },
    showToast(_variant, msg) {
      this.$bvToast.toast(this.$t(msg), {
        title: this.$t("success"),
        variant: _variant,
        autoHideDelay: 2000,
        appendToast: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.keyword-container {
  padding: 20px;
}
.filter-input {
  max-width: 200px;
}
.no_width {
  width: 60px;
}
</style>

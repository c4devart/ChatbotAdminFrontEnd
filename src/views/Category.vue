<template>
  <div class="h-full v-full no-scrollbar category-container">
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
      responsive
      tbody-tr-class="contacts-table-tr"
      class="mt-4"
      head-variant="dark"
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
          @change="paginationChanged"
          align="right"
          size="md"
        ></b-pagination>
      </b-col>
    </b-row>
    <b-modal
      id="modal-prevent-closing"
      v-model="formModalShow"
      ref="modal"
      :title="isFormModalEdit ? $t('edit_category') : $t('add_category')"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="form_state.category_name"
          :label="$t('category_name')"
          label-for="category_name-input"
          :invalid-feedback="$t('category_name_required')"
        >
          <b-form-input
            id="category_name-input"
            v-model="form.category_name"
            :state="form_state.category_name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.parent_id"
          :label="$t('parent_name')"
          label-for="parent_name-input"
        >
          <b-form-select
            id="parent_name-input"
            v-model="form.parent_id"
            :options="parents"
            :state="form_state.parent_id"
            required
          ></b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { listCategory, editCategory, getCategory } from "@/api/category";
import { deepClone } from "@/utils/index";

export default {
  name: "CategoryTbl",
  components: {},
  computed: {},
  props: {},
  data() {
    return {
      formModalShow: false,
      isFormModalEdit: false,
      parents: [],
      form: {
        parent_id: "",
        category_name: ""
      },
      form_state: {
        parent_id: null,
        category_name: null
      },
      items: [],
      fields: [
        {
          key: "index",
          label: this.$t("no"),
          sortable: false,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "category_name",
          label: this.$t("category_name"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "parent_id",
          label: this.$t("parent_name"),
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
    sortingChanged() {
      //console.log(ctx);
      this.loadList();
      // ctx.sortBy   ==> Field key for sorting by (or null for no sorting)
      // ctx.sortDesc ==> true if sorting descending, false otherwise
    },
    handleSearch() {
      this.reload();
    },
    loadList() {
      listCategory({
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
    getSite() {
      getCategory({
        is_deleted: 0
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.parents = [];
          for (var i = 0; i < data.total; i++) {
            this.parents.push({
              value: data.items[i].id,
              text: data.items[i].category_name
            });
          }
        }
      });
    },
    reload() {
      //   this.currentPage = 1
      this.loadList();
    },
    add() {
      this.isFormModalEdit = false;
      this.formModalShow = true;
      this.getSite();
    },
    edit(row) {
      this.form = deepClone(row.item);
      this.form_state = {
        parent_id: null,
        category_name: null
      };
      this.isFormModalEdit = true;
      this.formModalShow = true;
      this.getSite();
    },
    del(row) {
      this.$bvModal
        .msgBoxConfirm(this.$t("are_you_sure"))
        .then(value => {
          if (!value) {
            return;
          }
          editCategory({
            id: row.item.id,
            is_deleted: 1
          }).then(response => {
            const { code } = response;
            if (code === 20000) {
              this.reload();
              this.showToast("success", "del_site_success");
            }
          });
        })
        .catch(err => {
          console.log(err);
          // An error occurred
        });
    },
    updateFormState() {
      this.form_state.parent_id = this.form.parent_id !== "";
      this.form_state.category_name = this.form.category_name !== "";
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.updateFormState();
      return valid;
    },
    resetModal() {
      this.form = {
        parent_id: "",
        category_name: ""
      };
      this.form_state = {
        parent_id: null,
        category_name: null
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
        editCategory(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.showToast("success", "edit_category_success");
              this.reload();
            } else {
              this.showToast("danger", "edit_category_failed");
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
.category-container {
  padding: 20px;
}
.filter-input {
  max-width: 200px;
}
</style>

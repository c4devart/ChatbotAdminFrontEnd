<template>
  <div class="h-full v-full no-scrollbar site-container">
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
      :empty-text="$t('no_data')"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
    >
      <template v-slot:cell(link)="row">
        <a v-html="row.value" target="_blank" :href="`${row.value}`"></a>
      </template>
      <template v-slot:cell(index)="row">
        {{ (currentPage - 1) * perPage + row.index + 1 }}
      </template>
      <template v-slot:cell(logo)="row">
        <img
          v-if="row.item.logo !== null && row.item.logo !== ''"
          :src="baseUrl + row.item.logo"
          class="site-logo"
        />
      </template>
      <template v-slot:cell(created_at)="row">
        <span>{{ row.item.created_at | formatDate }}</span>
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
      :title="isFormModalEdit ? $t('edit_site') : $t('add_site')"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="form_state.link"
          :label="$t('link')"
          label-for="link-input"
          :invalid-feedback="$t('link_required')"
        >
          <b-form-input
            id="link-input"
            v-model="form.link"
            placeholder="https://google.com"
            :state="form_state.link"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.site_name"
          :label="$t('site_name')"
          label-for="site_name-input"
          :invalid-feedback="$t('site_name_required')"
        >
          <b-form-input
            id="site_name-input"
            v-model="form.site_name"
            placeholder="PAIZA CASINO"
            :state="form_state.site_name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="form_state.logo"
          :label="$t('logo')"
          label-for="logo-input"
        >
          <b-form-file
            id="logo-input"
            v-model="form.logo"
            accept="image/jpeg, image/png, image/gif"
            :state="Boolean(form.logo)"
            :placeholder="$t('logo_placeholder')"
          ></b-form-file>
        </b-form-group>
      </form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="secondary" @click="cancel()">
          {{ $t("close") }}
        </b-button>
        <b-button size="sm" variant="success">{{ $t("ok") }}</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { listSite, editSite, addSite } from "@/api/site";
import { deepClone } from "@/utils/index";
import { base_domain, main_port } from "@/config";

export default {
  name: "SiteTbl",
  components: {},
  computed: {},
  props: {},
  data() {
    return {
      baseUrl: "http://" + base_domain + ":" + main_port,
      formModalShow: false,
      isFormModalEdit: false,
      form: {
        link: "",
        logo: null,
        site_name: ""
      },
      form_state: {
        link: null,
        logo: null,
        site_name: null
      },
      items: [],
      fields: [
        {
          key: "index",
          label: this.$t("no"),
          sortable: false,
          sortDirection: "asc",
          class: "text-center pt-2 no_width"
        },
        {
          key: "link",
          label: this.$t("link"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-2"
        },
        {
          key: "logo",
          label: this.$t("logo"),
          sortable: false,
          sortDirection: "asc",
          class: "text-center pt-2"
        },
        {
          key: "site_name",
          label: this.$t("site_name"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-2"
        },
        {
          key: "created_at",
          label: this.$t("created_at"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-2"
        },
        {
          key: "action",
          label: this.$t("action"),
          sortable: false,
          sortDirection: "desc",
          class: "text-center action_width pt-2"
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
      listSite({
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
        link: null,
        site_name: null,
        logo: null
      };
      this.isFormModalEdit = true;
      this.formModalShow = true;
    },
    del(row) {
      this.$bvModal
        .msgBoxConfirm(this.$t("are_you_sure"), {
          size: "sm",
          buttonSize: "sm",
          okVariant: "secondary",
          okTitle: "はい",
          cancelTitle: "いいえ",
          footerClass: "p-2"
        })
        .then(value => {
          if (!value) {
            return;
          }
          editSite({
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
      this.form_state.link = this.form.link !== "";
      this.form_state.logo = this.form.logo !== "";
      this.form_state.site_name = this.form.site_name !== "";
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.updateFormState();
      return valid;
    },
    resetModal() {
      this.form = {
        link: "",
        logo: "",
        site_name: ""
      };
      this.form_state = {
        link: null,
        logo: null,
        site_name: null
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
      let uploadData = new FormData();
      uploadData.append("link", this.form.link);
      uploadData.append("file", this.form.logo);
      uploadData.append("site_name", this.form.site_name);
      if (this.isFormModalEdit) {
        uploadData.append("id", this.form.id);
        editSite(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.showToast("success", "edit_site_success");
              this.reload();
            } else {
              this.showToast("danger", "edit_site_failed");
            }
            this.hideFormModal();
          })
          .catch(err => {
            console.log(err);
            this.hideFormModal();
          });
      } else {
        addSite(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.reload();
              this.showToast("success", "add_site_success");
            } else {
              this.showToast("danger", "add_site_failed");
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
.site-container {
  padding: 20px;
}
.filter-input {
  max-width: 200px;
}
</style>

<template>
  <div class="h-full v-full no-scrollbar operator-container">
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
      :empty-text="$t('no_data')"
    >
      <template v-slot:cell(index)="row">
        {{ (currentPage - 1) * perPage + row.index + 1 }}
      </template>
      <template v-slot:cell(logo)="row">
        <a target="_blank" :href="`${row.item.link}`">
          <img
            v-if="row.item.logo !== null && row.item.logo !== ''"
            :src="baseUrl + row.item.logo"
            class="sitbaseUrle-logo site-logo"
          />
        </a>
      </template>
      <template v-slot:cell(created_at)="row">
        <span>{{ row.item.created_at | formatDate }}</span>
      </template>
      <template v-slot:cell(is_online)="row">
        <div v-if="row.item.is_online == 1" class="offline online"></div>
        <div v-if="row.item.is_online == 0" class="offline"></div>
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
      :title="isFormModalEdit ? $t('edit_operator') : $t('add_operator')"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="form_state.name"
          :label="$t('operator_name')"
          label-for="operator_name-input"
          :invalid-feedback="$t('operator_name_required')"
        >
          <b-form-input
            id="operator_name-input"
            v-model="form.name"
            :state="form_state.name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.email"
          :label="$t('email')"
          label-for="email-input"
          :invalid-feedback="$t('email_required')"
        >
          <b-form-input
            id="email-input"
            v-model="form.email"
            type="email"
            :state="form_state.email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.password"
          :label="$t('password')"
          label-for="password-input"
          :invalid-feedback="$t('password_required')"
        >
          <b-form-input
            id="password-input"
            type="password"
            v-model="form.password"
            :state="form_state.password"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.phone"
          :label="$t('phone')"
          label-for="phone-input"
          :invalid-feedback="$t('phone_required')"
        >
          <b-form-input
            id="phone-input"
            v-model="form.phone"
            :state="form_state.phone"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.site_no"
          :label="$t('site_name')"
          label-for="site-input"
          :invalid-feedback="$t('site_name_required')"
        >
          <b-form-select
            id="site-input"
            v-model="form.site_no"
            :options="sites"
            :state="form_state.site_no"
            required
          ></b-form-select>
        </b-form-group>
      </form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="secondary" @click="cancel()">{{
          $t("close")
        }}</b-button>
        <b-button size="sm" variant="success">{{ $t("ok") }}</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  listOperator,
  editOperator,
  addOperator,
  listSite
} from "@/api/operator";
import { deepClone } from "@/utils/index";
import { base_domain, main_port } from "@/config";
export default {
  name: "OperatorTbl",
  components: {},
  computed: {},
  props: {},
  data() {
    return {
      baseUrl: "http://" + base_domain + ":" + main_port,
      formModalShow: false,
      isFormModalEdit: false,
      sites: [],
      form: {
        password: "",
        phone: "",
        name: "",
        site: "",
        email: ""
      },
      form_state: {
        password: null,
        phone: null,
        name: null,
        site: null,
        email: null
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
          key: "name",
          label: this.$t("name"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "email",
          label: this.$t("email"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "logo",
          label: this.$t("logo"),
          sortable: true,
          class: "text-center pt-3"
        },
        {
          key: "phone",
          label: this.$t("phone"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "is_online",
          label: this.$t("online_status"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "created_at",
          label: this.$t("created_at"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "action",
          label: this.$t("action"),
          sortable: false,
          sortDirection: "desc",
          class: "text-center pt-3 action_width"
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
      listOperator({
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
      listSite({
        is_deleted: 0
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.sites = [];
          for (var i = 0; i < data.total; i++) {
            this.sites.push({
              value: data.items[i].id,
              text: data.items[i].site_name
            });
          }
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
      this.getSite();
    },
    edit(row) {
      this.form = deepClone(row.item);
      this.form_state = {
        email: null,
        password: null,
        phone: null,
        site_no: null,
        name: null
      };
      this.isFormModalEdit = true;
      this.formModalShow = true;
      this.getSite();
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
          editOperator({
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
      this.form_state.email =
        this.form.email !== "" && this.validEmail(this.form.email);
      this.form_state.password = this.form.password !== "";
      this.form_state.name = this.form.name !== "";
      this.form_state.phone = this.form.phone !== "";
      this.form_state.site_no =
        this.form.site_no !== "" && this.form.site_no !== undefined;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.updateFormState();
      return valid;
    },
    resetModal() {
      this.form = {
        email: "",
        password: "",
        name: "",
        phone: "",
        site_no: ""
      };
      this.form_state = {
        email: null,
        password: null,
        phone: null,
        site_no: null,
        name: null
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
        editOperator(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.showToast("success", "edit_operator_success");
              this.reload();
            } else {
              this.showToast("danger", "edit_operator_failed");
            }
            this.hideFormModal();
          })
          .catch(err => {
            console.log(err);
            this.hideFormModal();
          });
      } else {
        addOperator(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.reload();
              this.showToast("success", "add_operator_success");
            } else {
              this.showToast("danger", "add_operator_failed");
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
    },
    validEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.operator-container {
  padding: 20px;
}
.filter-input {
  max-width: 200px;
}
</style>

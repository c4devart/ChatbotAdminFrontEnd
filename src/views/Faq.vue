<template>
  <div class="h-full v-full no-scrollbar faq-container">
    <div class="row searchKey">
      <multiselect
        v-model="searchKeywords"
        :multiple="true"
        track-by="id"
        label="name"
        :searchable="true"
        :clear-on-select="true"
        :close-on-select="false"
        :options="keywordList"
        :hide-selected="true"
        :taggable="true"
        @select="updateVal"
        @remove="updateVal"
        @tag="addKeyword"
        :custom-label="keyWithCount"
        :clearAllButton="true"
        :placeholder="$t('select_keyword')"
        :selectLabel="$t('enter_select')"
        :tagPlaceholder="$t('tag_placeholder')"
        :deselectLabel="$t('enter_select')"
      >
      </multiselect>
    </div>

    <div class="row">
      <div class="col-md-3 col-sm-12 category_section">
        <vue-tree-list
          @click="onClick"
          @change-name="onChangeName"
          @delete-node="onDel"
          @add-node="onAddNode"
          :model="treeData"
          :dragDisabled="true"
          :default-tree-node-name="$t('new_node')"
        >
        </vue-tree-list>
      </div>
      <div class="col-md-9 col-sm-12 category_section">
        <div class="">
          <div class="flex-space-between-vc">
            <div>
              <b-button variant="primary" size="md" @click="add">
                {{ $t("add") }}
              </b-button>
              <label style="margin-left: 20px;">
                {{ cateLabel }}
              </label>
            </div>
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
            bordered
            striped
            head-variant="dark"
            responsive
            tbody-tr-class="contacts-table-tr"
            class="mt-4"
            @sort-changed="sortingChanged"
            :items="items"
            :empty-text="$t('no_data')"
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
                <vue-fontawesome
                  icon="edit"
                  size="1"
                  color="white"
                ></vue-fontawesome>
              </b-button>
              <b-button
                size="sm"
                variant="danger"
                class="ml-2"
                @click="del(row)"
              >
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
        </div>
      </div>
    </div>

    <b-modal
      id="modal-prevent-closing"
      size="xl"
      v-model="formModalShow"
      ref="modal"
      :title="isFormModalEdit ? $t('edit_faq') : $t('add_faq')"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="form_state.question"
          :label="$t('question')"
          label-for="question-input"
          :invalid-feedback="$t('question_required')"
        >
          <b-form-input
            id="question-input"
            v-model="form.question"
            :state="form_state.question"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="form_state.answer"
          :label="$t('answer')"
          label-for="answer-input"
          :invalid-feedback="$t('answer_required')"
        >
          <b-form-textarea
            id="answer-input"
            v-model="form.answer"
            :state="form_state.question"
            placeholder=""
            rows="5"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          :state="form_state.site_no"
          :label="$t('site_name')"
          :invalid-feedback="$t('site_name_required')"
          label-for="site_name-input"
        >
          <b-form-select
            id="site_name-input"
            v-model="form.site_no"
            :options="sites"
            :state="form_state.site_no"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          :state="form_state.category_id"
          :label="$t('category_name')"
          label-for="category_name-input"
          :invalid-feedback="$t('category_required')"
        >
          <treeselect
            required
            v-model="form.category_id"
            :multiple="false"
            :options="categories"
            :state="form_state.category_id"
            :defaultExpandLevel="100"
          />
        </b-form-group>
        <b-form-group
          :state="form_state.keyword"
          :label="$t('keyword')"
          label-for="keyword-input"
          :invalid-feedback="$t('keyword_required')"
        >
          <multiselect
            v-model="preKeyword"
            :multiple="true"
            track-by="id"
            label="name"
            :searchable="true"
            :close-on-select="false"
            :options="keywordList"
            :hide-selected="true"
            :taggable="true"
            @tag="addTag"
            :placeholder="$t('select_keyword')"
            :selectLabel="$t('enter_select')"
            :tagPlaceholder="$t('tag_placeholder')"
            :deselectLabel="$t('enter_select')"
          >
          </multiselect>
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
import { listFaq, editFaq, addFaq } from "@/api/faq";
import { addKeyword } from "@/api/keyword";
import { listSite } from "@/api/operator";
import {
  getCategory,
  renameNode,
  addNode,
  getKeywordList,
  getKeywords
} from "@/api/category";
import { deepClone } from "@/utils/index";
import { Tree } from "vue-tree-list";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { base_domain, main_port } from "@/config";
import Multiselect from "vue-multiselect";
export default {
  name: "FaqTbl",
  components: { Treeselect, Multiselect },
  computed: {},
  props: {},
  data() {
    return {
      selected: null,
      cateLabel: "全てのカテゴリー",
      keywordList: [],
      baseUrl: "http://" + base_domain + ":" + main_port,
      treeData: new Tree({
        name: this.$t("category")
      }),
      tempTree: {
        id: 0,
        name: this.$t("category"),
        addLeafNodeDisabled: true,
        dragDisabled: true,
        children: []
      },
      model: new Tree({}),
      formModalShow: false,
      isFormModalEdit: false,
      sites: [],
      categories: [],
      keywordOptions: [],
      form: {
        question: "",
        answer: "",
        category_id: null,
        site_no: "",
        keyword: null
      },
      preKeyword: [],
      searchKeywords: [],
      form_state: {
        question: null,
        answer: null,
        category_id: null,
        site_no: null,
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
          key: "question",
          label: this.$t("question"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3 q_width"
        },
        {
          key: "answer",
          label: this.$t("answer"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3"
        },
        {
          key: "keyword",
          label: this.$t("keyword"),
          sortable: true,
          sortDirection: "asc",
          class: "text-center pt-3 site_width"
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
      sortDirection: "asc",
      category: ""
    };
  },
  mounted() {
    this.getKeywordList(1);
    this.reload();
  },
  methods: {
    paginationChanged() {
      this.reload();
    },
    sortingChanged() {
      this.loadList();
      // ctx.sortBy   ==> Field key for sorting by (or null for no sorting)
      // ctx.sortDesc ==> true if sorting descending, false otherwise
    },
    handleSearch() {
      this.reload();
    },
    loadList() {
      listFaq({
        search: this.filter,
        keyword: this.searchKeywords,
        sort: this.sortBy,
        dir: this.sortDirection,
        page: this.currentPage,
        limit: this.perPage,
        category: this.category
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
          let result = data;
          this.sites = [];

          for (var i = 0; i < result.total; i++) {
            this.sites.push({
              value: result.items[i].id,
              text: result.items[i].site_name
            });
          }
          getCategory({
            is_deleted: 0
          }).then(response => {
            const { code, data } = response;
            if (code === 20000) {
              this.categories = [];
              this.categories = this.buildTree(data.items);
            }
          });
        }
      });
    },
    buildTree(arr) {
      var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;
      for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        //mappedArr[arrElem.id]['children'] = [];
        mappedArr[arrElem.id]["addLeafNodeDisabled"] = true;
        mappedArr[arrElem.id]["dragDisabled"] = true;
      }
      for (var id in mappedArr) {
        if (mappedArr[id]) {
          mappedElem = mappedArr[id];
          if (mappedElem["pid"]) {
            if (
              mappedArr[mappedElem["pid"]] != undefined &&
              mappedArr[mappedElem["pid"]]["children"] == undefined
            )
              mappedArr[mappedElem["pid"]]["children"] = [];
            if (
              mappedArr[mappedElem["pid"]] != undefined &&
              mappedArr[mappedElem["pid"]]["children"] != undefined
            )
              mappedArr[mappedElem["pid"]]["children"].push(mappedElem);
          } else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    },
    buildTreeList() {
      getCategory({
        is_deleted: 0
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.tempTree["children"] = this.buildTree(data.items);
          this.treeData = new Tree([this.tempTree]);
        }
      });
    },
    reload() {
      //   this.currentPage = 1
      this.getKeywordList();
      this.buildTreeList();
      this.loadList();
    },
    add() {
      this.isFormModalEdit = false;
      this.formModalShow = true;
      this.getSite();
    },
    getKeywordList(type = 0) {
      getKeywordList({
        is_deleted: 0
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.keywordList = [];
          if (type == 1) this.searchKeywords = [];
          for (var i = 0; i < data.length; i++) {
            this.keywordList.push({
              name: data[i]["keyword"],
              id: data[i]["id"],
              cnt: data[i]["cnt"]
            });
            if (type == 1) {
              this.searchKeywords.push({
                name: data[i]["keyword"],
                id: data[i]["id"],
                cnt: data[i]["cnt"]
              });
            }
          }
        }
      });
    },
    getKeywords(id) {
      getKeywords({
        id: id
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          for (var i = 0; i < data.length; i++) {
            this.preKeyword.push({
              name: data[i]["name"],
              id: data[i]["id"]
            });
          }
        }
      });
    },
    edit(row) {
      this.form = deepClone(row.item);
      this.getKeywords(this.form.id);
      this.isFormModalEdit = true;
      this.formModalShow = true;
      this.getSite();
    },
    del(row) {
      this.$bvModal
        .msgBoxConfirm(this.$t("are_you_sure"), {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "はい",
          cancelTitle: "いいえ",
          footerClass: "p-2"
        })
        .then(value => {
          if (!value) {
            return;
          }
          editFaq({
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
      this.form_state.question = this.form.question !== "";
      this.form_state.answer = this.form.answer !== "";
      this.form_state.site_no =
        this.form.site_no !== "" && this.form.site_no !== undefined;
      this.form_state.category_id =
        this.form.category_id !== "" && this.form.category_id !== null;
      this.form_state.keyword =
        this.preKeyword !== "" && this.preKeyword.length !== 0;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.updateFormState();
      return valid;
    },
    resetModal() {
      this.form = {
        question: "",
        answer: "",
        site_no: "",
        category_id: null,
        keyword: null
      };
      this.form_state = {
        question: null,
        answer: null,
        keyword: null,
        site_no: null,
        category_id: null
      };
      this.preKeyword = [];
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

      let uploadData = this.form;
      uploadData.keyword = this.preKeyword;
      if (this.isFormModalEdit) {
        editFaq(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.showToast("success", "edit_faq_success");
              this.preKeyword = [];
              this.reload();
            } else {
              this.showToast("danger", "edit_faq_failed");
            }
            this.hideFormModal();
          })
          .catch(err => {
            console.log(err);
            this.hideFormModal();
          });
      } else {
        addFaq(uploadData)
          .then(response => {
            if (response.code === 20000) {
              this.reload();
              this.preKeyword = [];
              this.showToast("success", "add_faq_success");
            } else {
              this.showToast("danger", "add_faq_failed");
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
    onDel(node) {
      const h = this.$createElement;
      const messageVNode = h("div", { class: ["foobar"] }, [
        h("div", { class: ["red"] }, [this.$t("remove_category")]),
        h("div", { class: [] }, [this.$t("are_you_sure")])
      ]);
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          size: "md",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "はい",
          cancelTitle: "いいえ",
          footerClass: "p-2"
        })
        .then(value => {
          if (!value) {
            return;
          }
          renameNode({ id: node.id, is_deleted: 1 }).then(response => {
            const { code } = response;
            if (code === 20000) {
              this.reload();
            }
          });
        });
    },

    onChangeName(params) {
      if (params.eventType != undefined && params.eventType == "blur") {
        renameNode({
          id: params.id,
          is_deleted: 0,
          category_name: params.newName
        }).then(response => {
          const { code } = response;
          if (code === 20000) {
            this.reload();
          }
        });
      }
    },

    onAddNode(params) {
      addNode({
        name: params.name,
        parent_id: params.pid
      }).then(response => {
        const { code } = response;
        if (code === 20000) {
          this.reload();
        }
      });
    },
    getCategoryName(params) {
      if (params.parent != null) {
        if (params.name != undefined) {
          if (this.cateLabel != "")
            this.cateLabel = params.name + " ／  " + this.cateLabel;
          else this.cateLabel = params.name;
          this.getCategoryName(params.parent);
        }
      }
    },
    onClick(params) {
      if (params.id == 0) this.cateLabel = "全てのカテゴリー";
      else {
        this.cateLabel = "";
        this.getCategoryName(params);
      }

      this.category = "";
      this.form.category_id = params.id;
      if (params.children == undefined) {
        this.category = params.id;
        this.reload();
      } else {
        this.category += params.id;
        params.children.filter(elem => {
          this.category += "," + elem.id;
          if (elem["children"] != undefined) {
            this.findTreeItem(elem["children"]);
          }
        });
        this.reload();
      }
    },
    findTreeItem(items) {
      for (let item of items) {
        // Test current object
        if (item.children == undefined || item.children.length == 0) {
          this.category += "," + item.id;
        } else {
          this.findTreeItem(item.children);
        }
      }
    },
    addTag(newTag) {
      this.preKeyword.push({ name: newTag });
    },
    addKeyword(newTag) {
      addKeyword({
        keyword: newTag
      }).then(response => {
        const { code, data } = response;
        if (code === 20000) {
          this.searchKeywords.push({ id: data.id, name: data.name, cnt: 0 });
          this.keywordList.push({ id: data.id, name: data.name, cnt: 0 });
          this.loadList();
        }
      });
    },
    keyWithCount(params) {
      return `${params.name}[${params.cnt}]`;
    },
    updateVal() {
      this.loadList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.faq-container {
  padding: 20px;
}
.filter-input {
  max-width: 200px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

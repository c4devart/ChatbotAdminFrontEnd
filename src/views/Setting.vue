<template>
  <div class="h-full v-full">
    <b-container fluid>
      <b-row no-gutters>
        <b-col md="12" lg="4" class="py-5 px-4">
          <b-card class="text-center">
            <b-avatar
              :src="avatar"
              size="8rem"
              class="mb-3"
              variant="primary"
            ></b-avatar>
            <b-card-text>
              <input
                type="file"
                accept="image/*"
                @change="processImage"
                id="image_file"
                style="display:none"
              />
              <b-button
                type="button"
                variant="secondary"
                @click="uploadImage"
                >{{ $t("upload") }}</b-button
              >
              <b-button
                type="button"
                variant="primary"
                class="ml-2"
                @click="changeImage"
                >{{ $t("change") }}</b-button
              >
            </b-card-text>
            <b-card-text> {{ $t("name") }}: {{ adminData.name }} </b-card-text>
            <b-card-text>
              {{ $t("email") }}: {{ adminData.email }}
            </b-card-text>
            <b-card-text>
              {{ $t("phone") }}: {{ adminData.phone }}
            </b-card-text>
          </b-card>
        </b-col>
        <b-col md="12" lg="8" class="py-5 px-4">
          <b-card>
            <b-tabs content-class="mt-3" justified>
              <b-tab :title="$t('edit_profile')" active>
                <ValidationObserver ref="profileObserver" v-slot="{ passes }">
                  <b-form
                    @submit.prevent="passes(profileFormSubmit)"
                    @reset="resetProfileForm"
                  >
                    <b-row>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required"
                          name="name"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group :label="$t('name')" label-for="name">
                            <b-form-input
                              id="name"
                              v-model="form.name"
                              type="text"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required|email"
                          name="email"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group :label="$t('email')" label-for="email">
                            <b-form-input
                              id="email"
                              v-model="form.email"
                              type="email"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required"
                          name="phone"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group :label="$t('phone')" label-for="phone">
                            <b-form-input
                              id="phone"
                              v-model="form.phone"
                              type="text"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                    </b-row>
                    <b-row no-gutters class="mt-3">
                      <b-button type="submit" variant="primary">{{
                        $t("update")
                      }}</b-button>
                      <b-button type="reset" variant="danger" class="ml-2">{{
                        $t("reset")
                      }}</b-button>
                    </b-row>
                  </b-form>
                </ValidationObserver>
              </b-tab>
              <b-tab :title="$t('change_password')">
                <ValidationObserver ref="pwdObserver" v-slot="{ passes }">
                  <b-form
                    @submit.prevent="passes(pwdFormSubmit)"
                    @reset="resetPwdForm"
                  >
                    <b-row>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required"
                          name="current password"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group
                            :label="$t('cur_pwd')"
                            label-for="cur_pwd"
                          >
                            <b-form-input
                              id="cur_pwd"
                              v-model="password.current"
                              type="password"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required"
                          name="new password"
                          vid="password"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group
                            :label="$t('new_pwd')"
                            label-for="new_pwd"
                          >
                            <b-form-input
                              id="new_pwd"
                              v-model="password.new"
                              type="password"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                      <b-col sm="12" md="6">
                        <ValidationProvider
                          rules="required|confirmed:password"
                          name="confirm password"
                          v-slot="{ valid, errors }"
                        >
                          <b-form-group
                            :label="$t('con_pwd')"
                            label-for="con_pwd"
                          >
                            <b-form-input
                              id="con_pwd"
                              v-model="password.confirm"
                              type="password"
                              :state="errors[0] ? false : valid ? true : null"
                              placeholder=""
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{
                              errors[0]
                            }}</b-form-invalid-feedback>
                          </b-form-group>
                        </ValidationProvider>
                      </b-col>
                    </b-row>
                    <b-row no-gutters class="mt-3">
                      <b-button type="submit" variant="primary">{{
                        $t("update")
                      }}</b-button>
                      <b-button type="reset" variant="danger" class="ml-2">{{
                        $t("reset")
                      }}</b-button>
                    </b-row>
                  </b-form>
                </ValidationObserver>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import config from "@/config";
import { updateProfile, changePassword, avatarUpload } from "@/api/user";
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      adminData: {},
      form: {
        id: "",
        name: "",
        email: "",
        phone: ""
      },
      password: {
        id: "",
        current: "",
        new: "",
        confirm: ""
      },
      avatar: "",
      previewImage: "https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm",
      image: null
    };
  },
  async created() {
    this.adminData = await this.$store.dispatch("user/getInfo");
    this.form.id = this.adminData.id;
    this.form.name = this.adminData.name;
    this.form.email = this.adminData.email;
    this.form.phone = this.adminData.phone;
    this.password.id = this.adminData.id;
    this.getAvatar(this.adminData.avatar);
  },
  methods: {
    async getAvatar(avatarPath) {
      if (avatarPath) {
        this.avatar =
          "http://" +
          config.base_domain +
          ":" +
          config.main_port +
          "/" +
          avatarPath;
      } else {
        this.avatar = this.previewImage;
      }
    },
    profileFormSubmit() {
      updateProfile(this.form).then(resp => {
        if (resp.data) {
          this.makeToast("danger", this.$t("failure"), resp.data);
        } else {
          this.makeToast(
            "success",
            this.$t("success"),
            this.$t("update_profile_success")
          );
        }
      });
    },
    resetProfileForm() {
      this.form.name = "";
      this.form.email = "";
      this.form.phone = "";
      requestAnimationFrame(() => {
        this.$refs.profileObserver.reset();
      });
    },
    pwdFormSubmit() {
      changePassword(this.password).then(resp => {
        if (resp.data) {
          this.makeToast("danger", this.$t("failure"), resp.data);
        } else {
          this.makeToast(
            "success",
            this.$t("success"),
            this.$t("change_password_success")
          );
        }
      });
    },
    resetPwdForm() {
      this.password.current = "";
      this.password.new = "";
      this.password.confirm = "";
      requestAnimationFrame(() => {
        this.$refs.pwdObserver.reset();
      });
    },
    makeToast(variant = "success", title, msg) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    uploadImage() {
      this.$el.querySelector("#image_file").click();
    },
    processImage(e) {
      this.image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = e => {
        this.avatar = e.target.result;
      };
    },
    changeImage() {
      let formData = new FormData();
      formData.append("id", this.form.id);
      formData.append("avatar", this.image);
      avatarUpload(formData)
        .then(resp => {
          if (resp.data) {
            this.makeToast("danger", this.$t("failure"), resp.data);
          } else {
            this.makeToast(
              "success",
              this.$t("success"),
              this.$t("avatar_upload_success")
            );
          }
        })
        .catch(function() {
          console.log("failure!");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.card-text {
  margin-bottom: 0.5rem;
}
</style>

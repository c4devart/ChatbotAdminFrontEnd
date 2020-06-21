<template>
  <div class="login-container">
    <b-form class="login-form" :model="loginForm" :rules="loginRules">
      <div class="title-container">
        <h3 class="title">からログイン</h3>
      </div>
      <b-form-group
        id="input-group-1"
        label="メールアドレス:"
        label-for="email"
      >
        <b-form-input
          ref="email"
          id="email"
          v-model="loginForm.email"
          type="email"
          required
          tabindex="1"
          placeholder="name@company.com"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="パスワード:" label-for="password">
        <b-form-input
          ref="password"
          id="password"
          v-model="loginForm.password"
          type="password"
          required
          placeholder="********"
          @keyup.enter.native="handleLogin"
        ></b-form-input>
      </b-form-group>
      <b-button
        variant="danger"
        class="login-btn m-b-10"
        @click="handleLogin"
        >{{ $t("signin") }}</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    const validateEmail = (rule, value, callback) => {
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      callback();
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    if (this.loginForm.email === "") {
      this.$refs.email.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {},
  methods: {
    handleLogin() {
      if (this.loginForm.email === "") {
        this.$refs.email.focus();
      } else if (this.loginForm.password === "") {
        this.$refs.password.focus();
      }

      this.loginForm["token"] = "";
      this.loginForm["username_email"] = this.loginForm.email;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(async () => {
          this.$router.push({
            path: this.redirect || "/chat",
            query: this.otherQuery
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $loginBgColor;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .login-btn {
      width: 100%;
    }
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: black;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>

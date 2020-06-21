import { required, email, confirmed } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "フィールドが必要です。"
});

extend("email", {
  ...email,
  message: "フィールドは正しいメールアドレスではなりません。"
});

extend("confirmed", {
  ...confirmed,
  message: "確認フィールドが一致してません。"
});

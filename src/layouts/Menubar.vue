<template>
  <div class="menubar no-scrollbar flex-col-space-between-vc">
    <div style="width: 100%">
      <menubar-item v-for="(item, i) in menubarItems" :key="i" :data="item" />
    </div>
    <div>
      <menubar-item :data="lastItem" :logout="true" @click="logOut" />
    </div>
  </div>
</template>

<script>
import MenubarItem from "@/components/MenubarItem";
import Cookies from "js-cookie";
import { mapGetters } from "vuex";

export default {
  components: {
    MenubarItem
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    menubarItems() {
      let ret = [];
      for (let i = 0; i < this.permission_routes.length; i++) {
        if (this.permission_routes[i].path === "/") {
          for (let j = 0; j < this.permission_routes[i].children.length; j++) {
            if (this.permission_routes[i].children[j].path !== "/") {
              ret.push({
                url: this.permission_routes[i].children[j].path,
                title:
                  this.permission_routes[i].children[j].meta &&
                  this.permission_routes[i].children[j].meta.title
                    ? this.permission_routes[i].children[j].meta.title
                    : ""
              });
            }
          }
        }
      }
      return ret;
    }
  },
  mounted() {},
  data() {
    return {
      items: [
        {
          title: "Chat",
          url: "/chat"
        },
        {
          title: "Customer",
          url: "/customer"
        },
        {
          title: "Archieve",
          url: "/archieve"
        },
        {
          title: "Contact",
          url: "/contact"
        },
        {
          title: "Site",
          url: "/site"
        },
        {
          title: "Operator",
          url: "/operator"
        },
        {
          title: "Faq",
          url: "/faq"
        },
        {
          title: "Setting",
          url: "/setting"
        }
      ],
      lastItem: {
        title: "Logout",
        url: ""
      }
    };
  },
  methods: {
    async logOut() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
      //temp
      Cookies.remove("unread_count");
      Cookies.remove("selected_index");
      Cookies.remove("suggestion");
    }
  }
};
</script>

<style lang="scss" scoped></style>

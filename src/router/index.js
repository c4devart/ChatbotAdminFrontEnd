import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/auth/Login.vue"),
    hidden: true
  }
];

export const asyncRoutes = [
  {
    path: "/",
    component: () => import("@/layouts/Main.vue"),
    children: [
      { path: "/", redirect: "/chat" },
      {
        path: "/chat",
        component: () => import("@/views/Chat.vue"),
        meta: { title: "Chats", roles: ["admin", "operator"] }
      },
      {
        path: "/contact",
        component: () => import("@/views/Contact.vue"),
        meta: { title: "Customers", roles: ["admin", "operator"] }
      },
      {
        path: "/archieve",
        component: () => import("@/views/Archive.vue"),
        meta: { title: "Archives", roles: ["admin", "operator"] }
      },
      {
        path: "/faq",
        component: () => import("@/views/Faq.vue"),
        meta: { title: "Faqs", roles: ["admin"] }
      },
      {
        path: "/operator",
        component: () => import("@/views/Operator.vue"),
        meta: { title: "Operators", roles: ["admin"] }
      },
      {
        path: "/site",
        component: () => import("@/views/Site.vue"),
        meta: { title: "Site", roles: ["admin"] }
      },
      {
        path: "/setting",
        component: () => import("@/views/Setting.vue"),
        meta: { title: "Setting", roles: ["admin", "operator"] }
      }
    ]
  }
];

// const routes = [
//   {
//     path: "/",
//     component: () => import("@/layouts/Main.vue"),
//     children: [
//       {path: "/", redirect: "/chat"},
//       {
//         path: "/chat",
//         component: () => import("@/views/Chat.vue"),
//         meta: {title: "Chats"}
//       },
//       {
//         path: "/contact",
//         component: () => import("@/views/Contact.vue"),
//         meta: {title: "Contacts"}
//       },
//       {
//         path: "/archieve",
//         component: () => import("@/views/Archive.vue"),
//         meta: {title: "Archives"}
//       },
//       {
//         path: "/site",
//         component: () => import("@/views/Site.vue"),
//         meta: {title: "Site"}
//       },
//       {
//         path: "/operator",
//         component: () => import("@/views/Operator.vue"),
//         meta: {title: "Operators"}
//       },
//       {
//         path: "/category",
//         component: () => import("@/views/Category.vue"),
//         meta: {title: "Categorys"}
//       },
//       {
//         path: "/keyword",
//         component: () => import("@/views/Keyword.vue"),
//         meta: {title: "Keywords"}
//       },
//       {
//         path: "/faq",
//         component: () => import("@/views/Faq.vue"),
//         meta: {title: "Faqs"}
//       },
//     ]
//   },
//   {
//     path: "/login",
//     component: () => import("@/views/auth/Login.vue"),
//   },
// ];
const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

<template>
  <li :class="isSent">
    <img src="@/assets/imgs/avatar.png" class="avatar" />
    <div class="message">
      <span class="arrow"></span>
      <a href="javascript:;" class="name">{{ data.userData.userId }}</a>
      <span class="datetime"> at {{ data.time }}</span>
      <span class="body">{{ data.content }}</span>
    </div>
  </li>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default() {
        return {
          avatar: "@/assets/imgs/avatar.png",
          content: "adsfasdf"
        };
      }
    }
  },
  computed: {
    isSent: {
      get() {
        let isSent = false;
        if (this.data.isSent == 1) isSent = true;
        else isSent = false;
        return {
          in: !isSent,
          out: isSent
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.chats li {
  list-style: none;
  padding: 5px 0;
  margin: 10px auto;
  font-size: 12px;
}
.chats li .avatar {
  height: 45px;
  width: 45px;
  border-radius: 50% !important;
}
.chats li.in .avatar {
  float: left;
  margin-right: 10px;
}
.chats li.out .avatar {
  float: right;
  margin-left: 10px;
}
.chats li .message {
  display: block;
  padding: 5px;
  position: relative;
}
.chats li.in .message {
  text-align: left;
  border-left: 2px solid #1bbc9b;
  margin-left: 65px;
  background: #fafafa;
}
.chats li.out .message {
  border-right: 2px solid #f3565d;
  margin-right: 65px;
  background: #fafafa;
  text-align: right;
}
.chats li .message .arrow {
  display: block;
  position: absolute;
  top: 5px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
.chats li.in .message .arrow {
  left: -8px;
  width: 0;
  height: 0;
  border-right: 8px solid #1bbc9b;
}
.chats li.out .message .arrow {
  right: -8px;
  border-left: 8px solid #f3565d;
}
.chats li .name {
  color: #3590c1;
  font-size: 13px;
  font-weight: 400;
}
.chats li .datetime {
  color: #333;
  font-size: 13px;
  font-weight: 400;
}
.chats li .body {
  display: block;
}
</style>

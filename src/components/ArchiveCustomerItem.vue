<template>
  <div>
    <div :class="classObj" @click="click">
      <div class="customer-time-container">
        <div class="customer-info">
          <p class="name">
            {{ data.name ? data.name : $t("unnamed_visitor") }}
          </p>
          <p class="email">{{ data.email }}</p>
        </div>
        <div class="time-rate-info">
          <span>{{ getDate }}</span
          ><br />
          <star-rating
            :rating="parseInt(data.mark)"
            :star-size="15"
            :read-only="true"
            :show-rating="false"
            :rounded-corners="true"
            active-color="#fd7e14"
            inactive-color="#b3b7bb"
          ></star-rating>
        </div>
      </div>
      <div class="last-message">{{ data.message }}</div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
export default {
  components: {
    StarRating
  },
  props: {
    isactive: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {
          name: this.$("no_answer"),
          email: this.$("no_answer"),
          message: "", // last_message
          active: false, //selected or unselected
          started_at: "",
          mark: 0,
          note: "",
          session_id: ""
        };
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    classObj() {
      return {
        "archive-item pointer": true,
        active: this.isactive
      };
    },
    getDate() {
      var date = new Date(this.data.started_at);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      // if (month < 10) {
      //   month = "0" + month;
      // }
      // if (day < 10) {
      //   day = "0" + day;
      // }
      // if (hour < 10) {
      //   hour = "0" + hour;
      // }
      // if (minute < 10) {
      //   minute = "0" + minute;
      // }

      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime =
        month + "/" + day + " " + hours + ":" + minutes + " " + ampm;
      return strTime;
    }
  },
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit("clicked", {
        sessionId: this.data.session_id,
        index: this.index
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~bootstrap/scss/bootstrap";
@import "~bootstrap-vue/src/index";
.archive-item {
  padding: 10px 13px;
  height: 90px;
  color: $fontColor;
  border-bottom: 1px solid $archiveItemBorderBottomColor;
  &:hover {
    background-color: $archiveItemHoverColor;
  }
  &.active {
    background-color: $archiveItemActiveColor;
    border-left: 5px solid $archiveItemActiveBorderLeftColor;
    padding-left: 8px;
  }
  .customer-time-container {
    display: flex;
    justify-content: space-between;
    .customer-info {
      font-size: 15px;
      p.name {
        color: black;
        margin-bottom: 0px;
      }
      p.email {
        margin-bottom: 10px;
      }
    }
    .time-rate-info {
      font-size: 12px;
    }
  }

  .last-message {
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
  }
}
</style>

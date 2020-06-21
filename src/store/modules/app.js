import Cookies from "js-cookie";

const state = {
  new_customers: Cookies.get("new_customers")
    ? JSON.parse(Cookies.get("new_customers"))
    : [],
  selected_index: Cookies.get("selected_index")
    ? Cookies.get("selected_index")
    : 0,
  unread_count: Cookies.get("unread_count") ? Cookies.get("unread_count") : 0,
  incoming_alarm: Cookies.get("incoming_alarm")
    ? Cookies.get("incoming_alarm")
    : false,
  suggestion: Cookies.get("suggestion") ? Cookies.get("suggestion") : ""
};

const mutations = {
  SET_NEWCUSTOMER: (state, new_customer) => {
    new_customer.index = state.new_customers.length;
    state.new_customers.push(new_customer);
  },
  INIT_NEWCUSTOMERS: state => {
    state.new_customers = [];
  },
  UPDATE_ACTIVESTATUS: (state, index) => {
    for (var i = 0; i < state.new_customers.length; i++) {
      state.new_customers[i].active = false;
    }
    state.new_customers[index].active = true;
  },
  UPDATE_SELECTEDIDX: (state, index) => {
    state.selected_index = index;
    state.new_customers[index].isNew = false;
    state.new_customers[index].unread_cnt = 0;
    Cookies.set("selected_index", index);
  },
  HIDE_ALERT: (state, index) => {
    state.new_customers[index].show_alert = false;
  },
  WATCH_CHAT: (state, index) => {
    state.new_customers[index].is_supervised = true;
  },
  INCREASE_UNREADCNT: state => {
    state.unread_count++;
    Cookies.set("unread_count", state.unread_count);
  },
  DECREASE_UNREADCNT: state => {
    state.unread_count--;
    if (state.unread_count < 0) state.unread_count = 0;
    Cookies.set("unread_count", state.unread_count);
  },
  INIT_UNREADCNT: state => {
    state.unread_count = 0;
    Cookies.set("unread_count", 0);
  },
  SET_INCOMING_ALARM: (state, incoming_alarm) => {
    state.incoming_alarm = incoming_alarm;
    Cookies.set("incoming_alarm", state.incoming_alarm);
  },
  ACCEPT_CHAT: (state, index) => {
    state.new_customers[index].is_accepted = true;
  },
  REMOVE_CHAT_SESSION: (state, sessionId) => {
    for (let i = 0; i < state.new_customers.length; i++) {
      if (state.new_customers[i].session_id == sessionId) {
        state.new_customers.splice(i, 1);
        if (state.new_customers.length == 0) {
          state.selected_index = 0;
          state.new_customers = [];
          Cookies.set("selected_index", 0);
        } else if (state.new_customers.length == 1) {
          state.selected_index = 0;
          state.new_customers[0].isNew = false;
          state.new_customers[0].unread_cnt = 0;
          state.new_customers[0].active = true;
          state.new_customers[0].index = 0;
          Cookies.set("selected_index", 0);
        } else {
          if (i == 0) {
            state.selected_index = 0;
            state.new_customers[i].isNew = false;
            state.new_customers[i].unread_cnt = 0;
            state.new_customers[i].active = true;
            Cookies.set("selected_index", 0);
          } else {
            state.selected_index = i - 1;
            state.new_customers[i - 1].isNew = false;
            state.new_customers[i - 1].unread_cnt = 0;
            state.new_customers[i - 1].active = true;
            Cookies.set("selected_index", i - 1);
          }
        }
        break;
      }
    }
    for (let i = 0; i < state.new_customers.length; i++) {
      state.new_customers[i].index = i;
    }
  },
  PERSIST_SAVE: state => {
    Cookies.set("new_customers", JSON.stringify(state.new_customers));
  },
  SESSION_UNREADCNT: (state, { sessionId, type }) => {
    for (var i = 0; i < state.new_customers.length; i++) {
      if (
        state.new_customers[i].session_id == sessionId &&
        (!state.new_customers[i].show_alert || type == 7)
      ) {
        let customer = state.new_customers[i];
        customer.unread_cnt++;
        state.new_customers.splice(i, 1, customer);
        break;
      }
    }
  },
  SEL_SUGGESTION: (state, suggestion) => {
    state.suggestion = suggestion;
    Cookies.set("suggestion", suggestion);
  },
  SHOW_CHATCLOSE: (state, { closed, sessionId }) => {
    let index = state.new_customers.findIndex(
      customer => customer.session_id == sessionId
    );
    state.new_customers[index].chat_closed = true;
    if (!closed) {
      state.new_customers[index].is_accepted = false;
    }
  },
  UPDATE_LASTMSG: (state, { sessionId, lastMsg }) => {
    let index = state.new_customers.findIndex(
      customer => customer.session_id == sessionId
    );
    state.new_customers[index].last_message = lastMsg;
  },
  SET_TAGS: (state, { index, tags }) => {
    let customer = state.new_customers[index];
    customer.tags = tags;
    state.new_customers.splice(index, 1, customer);
  }
};

const actions = {
  setNewCustomer({ commit }, customer) {
    commit("SET_NEWCUSTOMER", customer);
    commit("PERSIST_SAVE");
  },
  initNewCustomers({ commit }) {
    commit("INIT_NEWCUSTOMERS");
    commit("PERSIST_SAVE");
  },
  updateActiveStatus({ commit }, index) {
    commit("UPDATE_ACTIVESTATUS", index);
    commit("PERSIST_SAVE");
  },
  setSelectIndex({ commit }, index) {
    commit("UPDATE_SELECTEDIDX", index);
    commit("PERSIST_SAVE");
  },
  hideAlert({ commit }, index) {
    commit("HIDE_ALERT", index);
    commit("PERSIST_SAVE");
  },
  watchChat({ commit }, index) {
    commit("WATCH_CHAT", index);
    commit("PERSIST_SAVE");
  },
  increaseUnreadCount({ commit }) {
    commit("INCREASE_UNREADCNT");
  },
  decreaseUnreadCount({ commit }) {
    commit("DECREASE_UNREADCNT");
  },
  initUnreadCount({ commit }) {
    commit("INIT_UNREADCNT");
  },
  setIncomingAlarm({ commit }, incomingAlarm) {
    commit("SET_INCOMING_ALARM", incomingAlarm);
  },
  acceptChat({ commit }, index) {
    commit("ACCEPT_CHAT", index);
    commit("PERSIST_SAVE");
  },
  removeChatSession({ commit }, sessionId) {
    commit("REMOVE_CHAT_SESSION", sessionId);
    commit("PERSIST_SAVE");
  },
  setUnreadCnt({ commit }, { sessionId, type }) {
    commit("SESSION_UNREADCNT", { sessionId, type });
    commit("PERSIST_SAVE");
  },
  selSuggestion({ commit }, suggestion) {
    commit("SEL_SUGGESTION", suggestion);
  },
  showChatClose({ commit }, { closed, sessionId }) {
    commit("SHOW_CHATCLOSE", { closed, sessionId });
    commit("PERSIST_SAVE");
  },
  updateLastMessage({ commit }, { sessionId, lastMsg }) {
    commit("UPDATE_LASTMSG", { sessionId, lastMsg });
    commit("PERSIST_SAVE");
  },
  setTags({commit}, {index, tags}) {
    commit("SET_TAGS", {index, tags});
    commit("PERSIST_SAVE");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

const getters = {
  // sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  is_logged_in: state =>
    state.user.token !== undefined && state.user.token !== "",
  user_id: state => state.user.user_id,
  permission_routes: state => state.permission.routes,
  site_no: state => state.user.site_no,
  site_link: state => state.user.site_link,
  new_customers: state => state.app.new_customers,
  selected_customer: state =>
    state.app.new_customers.filter(customer => customer.active == true)[0],
  selected_index: state => state.app.selected_index,
  unread_count: state => state.app.unread_count,
  incoming_alarm: state => state.app.incoming_alarm,
  suggestion: state => state.app.suggestion
};
export default getters;

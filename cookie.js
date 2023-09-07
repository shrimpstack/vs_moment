class Cookie {
  static data = {};
  static read() {
    Cookie.data = {};
    document.cookie.split(";").forEach(str => {
      let [cookie_name, cookie_val] = str.split("=").map(sub_str => {
        return unescape(sub_str).trim();
      });
      if(cookie_name) Cookie.data[cookie_name] = cookie_val;
    });
  }
  static del(cookie_name) {
    let nd = new Date(Date.now() - 1);
    document.cookie = escape(cookie_name) + "=null; expires=" + nd.toGMTString();
    delete Cookie.data[cookie_name];
  }
  static del_all() {
    let nd = new Date(Date.now() - 1);
    Cookie.read();
    Object.keys(Cookie.data).forEach(cookie_name => {
      document.cookie = escape(cookie_name) + "=null; expires=" + nd.toGMTString();
    });
    Cookie.data = {};
  }
  static set(cookie_name, cookie_val) {
    let nd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = escape(cookie_name) + "=" + escape(cookie_val) + ";expires=" + nd.toGMTString();
    Cookie.data[cookie_name] = cookie_val;
  }
  static get(cookie_name) {
    return Cookie.data[cookie_name] || null;
  }
}
Cookie.read();
/* ================================ */
/*   攻擊管理                       */
/* ================================ */
class ATK_Manager {
  static cur_atk = null;
  static async start_atk(target_class) {
    if(game_state != "run") return;
    ATK_Manager.cur_atk = target_class;
    return await ATK_Manager.cur_atk.start();
  }
  static hit_stop_atk() {
    if(ATK_Manager.cur_atk) ATK_Manager.cur_atk.hit_stop();
  }
  static hit_end_atk() {
    if(ATK_Manager.cur_atk) ATK_Manager.cur_atk.hit_end();
  }
  static game_stop_atk() {
    if(ATK_Manager.cur_atk) ATK_Manager.cur_atk.game_stop();
  }
  static hit() {
    move_lock = true;
    hp--;
    hit_stop_items();
    ATK_Manager.hit_stop_atk();
    find('#root').classList.add('hit');
    se("hit");
    setTimeout(() => {
      find('#root').classList.remove('hit');
      reset_items();
      move_lock = false;
      if(hp == 0) gameover();
      else setTimeout(ATK_Manager.hit_end_atk, 600);
    }, 600);
  }
}

/* ================================ */
/*   等待                           */
/* ================================ */
class ATK_Wait {
  static timeout = null;
  static wait_time = 460;
  static start() {
    tip("");
    return new Promise((res, rej) => {
      ATK_Wait.res = res;
      ATK_Wait.timeout = setTimeout(() => res("done"), ATK_Wait.wait_time);
    });
  }
  static game_stop() {
    clearTimeout(ATK_Wait.timeout);
    ATK_Wait.res('stop');
  }
}

/* ================================ */
/*   左到右                         */
/* ================================ */
class ATK_L2R {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("LEFT => RIGHT");
    clearInterval(ATK_L2R.interval);
    ATK_L2R.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_L2R.res = res;
      ATK_L2R.interval = setInterval(ATK_L2R.tick, 450 * main_speed);
    });
  }
  static tick() {
    item_fall(ATK_L2R.cur_index);
    ATK_L2R.cur_index++;
    if(ATK_L2R.cur_index == 7) ATK_L2R.done();
  }
  static done() {
    clearInterval(ATK_L2R.interval);
    ATK_L2R.done_wait = setTimeout(() => ATK_L2R.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_L2R.interval);
    clearTimeout(ATK_L2R.done_wait);
  }
  static hit_end() {
    ATK_L2R.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_L2R.interval);
    clearTimeout(ATK_L2R.done_wait);
    ATK_L2R.res('stop');
  }
}
atk_get.ATK_L2R = ATK_L2R;

/* ================================ */
/*   右到左                         */
/* ================================ */
class ATK_R2L {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("RIGHT => LEFT");
    clearInterval(ATK_R2L.interval);
    ATK_R2L.cur_index = 7;
    return new Promise((res, rej) => {
      ATK_R2L.res = res;
      ATK_R2L.interval = setInterval(ATK_R2L.tick, 450 * main_speed);
    });
  }
  static tick() {
    item_fall(ATK_R2L.cur_index);
    ATK_R2L.cur_index--;
    if(ATK_R2L.cur_index == 0) ATK_R2L.done();
  }
  static done() {
    clearInterval(ATK_R2L.interval);
    ATK_R2L.done_wait = setTimeout(() => ATK_R2L.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_R2L.interval);
    clearTimeout(ATK_R2L.done_wait);
  }
  static hit_end() {
    ATK_R2L.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_R2L.interval);
    clearTimeout(ATK_R2L.done_wait);
    ATK_R2L.res('stop');
  }
}
atk_get.ATK_R2L = ATK_R2L;

/* ================================ */
/*   雙重左到右                     */
/* ================================ */
class ATK_double_L2R {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("double LEFT => RIGHT");
    clearInterval(ATK_double_L2R.interval);
    ATK_double_L2R.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_double_L2R.res = res;
      ATK_double_L2R.interval = setInterval(ATK_double_L2R.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_double_L2R.cur_index) {
      case 0: item_fall_p([0, 4]); break;
      case 1: item_fall_p([1, 5]); break;
      case 2: item_fall_p([2, 6]); break;
      case 3: item_fall_p([3, 7]); break;
      case 4: item_fall_p([4, 0]); break;
      case 5: item_fall_p([5, 1]); break;
      case 6: item_fall_p([6, 2]); break;
    }
    ATK_double_L2R.cur_index++;
    if(ATK_double_L2R.cur_index == 7) ATK_double_L2R.done();
  }
  static done() {
    clearInterval(ATK_double_L2R.interval);
    ATK_double_L2R.done_wait = setTimeout(() => ATK_double_L2R.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_double_L2R.interval);
    clearTimeout(ATK_double_L2R.done_wait);
  }
  static hit_end() {
    ATK_double_L2R.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_double_L2R.interval);
    clearTimeout(ATK_double_L2R.done_wait);
    ATK_double_L2R.res('stop');
  }
}
atk_get.ATK_double_L2R = ATK_double_L2R;

/* ================================ */
/*   雙重右到左                     */
/* ================================ */
class ATK_double_R2L {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("double RIGHT => LEFT");
    clearInterval(ATK_double_R2L.interval);
    ATK_double_R2L.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_double_R2L.res = res;
      ATK_double_R2L.interval = setInterval(ATK_double_R2L.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_double_R2L.cur_index) {
      case 0: item_fall_p([7, 3]); break;
      case 1: item_fall_p([6, 2]); break;
      case 2: item_fall_p([5, 1]); break;
      case 3: item_fall_p([4, 0]); break;
      case 4: item_fall_p([3, 7]); break;
      case 5: item_fall_p([2, 6]); break;
      case 6: item_fall_p([1, 5]); break;
    }
    ATK_double_R2L.cur_index++;
    if(ATK_double_R2L.cur_index == 7) ATK_double_R2L.done();
  }
  static done() {
    clearInterval(ATK_double_R2L.interval);
    ATK_double_R2L.done_wait = setTimeout(() => ATK_double_R2L.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_double_R2L.interval);
    clearTimeout(ATK_double_R2L.done_wait);
  }
  static hit_end() {
    ATK_double_R2L.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_double_R2L.interval);
    clearTimeout(ATK_double_R2L.done_wait);
    ATK_double_R2L.res('stop');
  }
}
atk_get.ATK_double_R2L = ATK_double_R2L;

/* ================================ */
/*   奇數偶數                       */
/* ================================ */
class ATK_OddEven {
  static timeout = null;
  static cur_index = 0;
  static res = () => {};
  static time = 300;
  static done_wait = null;
  static start() {
    tip("1 => 3 => 5 => 7");
    clearTimeout(ATK_OddEven.timeout);
    ATK_OddEven.cur_index = 0;
    ATK_OddEven.time = 450 * main_speed;
    return new Promise((res, rej) => {
      ATK_OddEven.res = res;
      ATK_OddEven.tick();
    });
  }
  static tick() {
    ATK_OddEven.timeout = setTimeout(() => {
      switch(ATK_OddEven.cur_index) {
        case 0: item_fall(0); break;
        case 1: item_fall(2); break;
        case 2: item_fall(4); break;
        case 3: item_fall(6); break;
        case 4: item_fall(2); ATK_OddEven.time = 690 * main_speed; break;
        case 5: tip("2 4 6 8"); item_fall_p([1, 3, 5, 7]); break;
        case 6: tip("1 3 5 7"); item_fall_p([0, 2, 4, 6]); break;
      }
      ATK_OddEven.cur_index++;
      if(ATK_OddEven.cur_index == 7) ATK_OddEven.done();
      else ATK_OddEven.tick();
    }, ATK_OddEven.time);
  }
  static done() {
    clearTimeout(ATK_OddEven.timeout);
    ATK_OddEven.done_wait = setTimeout(() => ATK_OddEven.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearTimeout(ATK_OddEven.timeout);
    clearTimeout(ATK_OddEven.done_wait);
  }
  static hit_end() {
    ATK_OddEven.res('hit');
  }
  static game_stop() {
    clearTimeout(ATK_OddEven.timeout);
    clearTimeout(ATK_OddEven.done_wait);
    ATK_OddEven.res('stop');
  }
}
atk_get.ATK_OddEven = ATK_OddEven;

/* ================================ */
/*   奇數偶數 整排                  */
/* ================================ */
class ATK_OddEven_2 {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("ODD & EVEN");
    clearInterval(ATK_OddEven_2.interval);
    ATK_OddEven_2.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_OddEven_2.res = res;
      ATK_OddEven_2.interval = setInterval(ATK_OddEven_2.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_OddEven_2.cur_index) {
      case 0: item_fall_p([0, 2, 4, 6]); break;
      case 1: item_fall_p([1, 3, 5, 7]); break;
      case 2: item_fall_p([0, 2, 4, 6]); break;
      case 3: item_fall_p([1, 3, 5, 7]); break;
    }
    ATK_OddEven_2.cur_index++;
    if(ATK_OddEven_2.cur_index == 4) ATK_OddEven_2.done();
  }
  static done() {
    clearInterval(ATK_OddEven_2.interval);
    ATK_OddEven_2.done_wait = setTimeout(() => ATK_OddEven_2.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_OddEven_2.interval);
    clearTimeout(ATK_OddEven_2.done_wait);
  }
  static hit_end() {
    ATK_OddEven_2.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_OddEven_2.interval);
    clearTimeout(ATK_OddEven_2.done_wait);
    ATK_OddEven_2.res('stop');
  }
}
atk_get.ATK_OddEven_2 = ATK_OddEven_2;

/* ================================ */
/*   位置追蹤                       */
/* ================================ */
class ATK_YouPosition {
  static interval = null;
  static count = 10;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("your position");
    clearInterval(ATK_YouPosition.interval);
    ATK_YouPosition.count = 10;
    return new Promise((res, rej) => {
      ATK_YouPosition.res = res;
      ATK_YouPosition.interval = setInterval(ATK_YouPosition.tick, 750 * main_speed);
    });
  }
  static tick() {
    item_fall(cur_pos);
    ATK_YouPosition.count--;
    if(!ATK_YouPosition.count) ATK_YouPosition.done();
  }
  static done() {
    clearInterval(ATK_YouPosition.interval);
    ATK_YouPosition.done_wait = setTimeout(() => ATK_YouPosition.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_YouPosition.interval);
    clearTimeout(ATK_YouPosition.done_wait);
  }
  static hit_end() {
    ATK_YouPosition.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_YouPosition.interval);
    clearTimeout(ATK_YouPosition.done_wait);
    ATK_YouPosition.res('stop');
  }
}
atk_get.ATK_YouPosition = ATK_YouPosition;

/* ================================ */
/*   雙重位置追蹤                   */
/* ================================ */
class ATK_double_YouPosition {
  static interval = null;
  static count = 5;
  static res = () => {};
  static done_wait = null;
  static prev_pos = null;
  static start() {
    tip("your position");
    clearInterval(ATK_double_YouPosition.interval);
    ATK_double_YouPosition.count = 5;
    ATK_double_YouPosition.prev_pos = null;
    return new Promise((res, rej) => {
      ATK_double_YouPosition.res = res;
      ATK_double_YouPosition.interval = setInterval(ATK_double_YouPosition.tick, 750 * main_speed);
    });
  }
  static tick() {
    if(ATK_double_YouPosition.prev_pos != null && ATK_double_YouPosition.prev_pos != cur_pos) {
      item_fall_p([ATK_double_YouPosition.prev_pos, cur_pos]);
    }
    else item_fall(cur_pos);
    ATK_double_YouPosition.prev_pos = cur_pos;
    ATK_double_YouPosition.count--;
    if(!ATK_double_YouPosition.count) ATK_double_YouPosition.done();
  }
  static done() {
    clearInterval(ATK_double_YouPosition.interval);
    ATK_double_YouPosition.done_wait = setTimeout(() => ATK_double_YouPosition.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_double_YouPosition.interval);
    clearTimeout(ATK_double_YouPosition.done_wait);
  }
  static hit_end() {
    ATK_double_YouPosition.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_double_YouPosition.interval);
    clearTimeout(ATK_double_YouPosition.done_wait);
    ATK_double_YouPosition.res('stop');
  }
}
atk_get.ATK_double_YouPosition = ATK_double_YouPosition;

/* ================================ */
/*   4個並排                        */
/* ================================ */
class ATK_4 {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("1 2 3 4");
    clearInterval(ATK_4.interval);
    ATK_4.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_4.res = res;
      ATK_4.interval = setInterval(ATK_4.tick, 600 * main_speed);
    });
  }
  static tick() {
    switch(ATK_4.cur_index) {
      case 0: item_fall_p([0, 1, 2, 3]); break;
      case 1: tip("5 6 7 8"); item_fall_p([4, 5, 6, 7]); break;
    }
    ATK_4.cur_index++;
    if(ATK_4.cur_index == 2) ATK_4.done();
  }
  static done() {
    clearInterval(ATK_4.interval);
    ATK_4.done_wait = setTimeout(() => ATK_4.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_4.interval);
    clearTimeout(ATK_4.done_wait);
  }
  static hit_end() {
    ATK_4.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_4.interval);
    clearTimeout(ATK_4.done_wait);
    ATK_4.res('stop');
  }
}
atk_get.ATK_4 = ATK_4;

/* ================================ */
/*   裡到外                         */
/* ================================ */
class ATK_I2O {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("IN => OUT");
    clearInterval(ATK_I2O.interval);
    ATK_I2O.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_I2O.res = res;
      ATK_I2O.interval = setInterval(ATK_I2O.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_I2O.cur_index) {
      case 0: item_fall(3); break;
      case 1: item_fall(4); break;
      case 2: item_fall(2); break;
      case 3: item_fall(5); break;
      case 4: item_fall(1); break;
      case 5: item_fall(6); break;
      case 6: item_fall(0); break;
      case 7: item_fall(7); break;
    }
    ATK_I2O.cur_index++;
    if(ATK_I2O.cur_index == 8) ATK_I2O.done();
  }
  static done() {
    clearInterval(ATK_I2O.interval);
    ATK_I2O.done_wait = setTimeout(() => ATK_I2O.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_I2O.interval);
    clearTimeout(ATK_I2O.done_wait);
  }
  static hit_end() {
    ATK_I2O.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_I2O.interval);
    clearTimeout(ATK_I2O.done_wait);
    ATK_I2O.res('stop');
  }
}
atk_get.ATK_I2O = ATK_I2O;

/* ================================ */
/*   外到裡                         */
/* ================================ */
class ATK_O2I {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("OUT => IN");
    clearInterval(ATK_O2I.interval);
    ATK_O2I.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_O2I.res = res;
      ATK_O2I.interval = setInterval(ATK_O2I.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_O2I.cur_index) {
      case 0: item_fall(7); break;
      case 1: item_fall(0); break;
      case 2: item_fall(6); break;
      case 3: item_fall(1); break;
      case 4: item_fall(5); break;
      case 5: item_fall(2); break;
      case 6: item_fall(4); break;
      case 7: item_fall(3); break;
    }
    ATK_O2I.cur_index++;
    if(ATK_O2I.cur_index == 8) ATK_O2I.done();
  }
  static done() {
    clearInterval(ATK_O2I.interval);
    ATK_O2I.done_wait = setTimeout(() => ATK_O2I.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_O2I.interval);
    clearTimeout(ATK_O2I.done_wait);
  }
  static hit_end() {
    ATK_O2I.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_O2I.interval);
    clearTimeout(ATK_O2I.done_wait);
    ATK_O2I.res('stop');
  }
}
atk_get.ATK_O2I = ATK_O2I;

/* ================================ */
/*   雙重裡到外                     */
/* ================================ */
class ATK_double_I2O {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("double IN => OUT");
    clearInterval(ATK_double_I2O.interval);
    ATK_double_I2O.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_double_I2O.res = res;
      ATK_double_I2O.interval = setInterval(ATK_double_I2O.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_double_I2O.cur_index) {
      case 0: item_fall_p([3, 4]); break;
      case 1: item_fall_p([2, 5]); break;
      case 2: item_fall_p([1, 6]); break;
      case 3: item_fall_p([0, 7]); break;
      case 4: item_fall_p([3, 4]); break;
      case 5: item_fall_p([2, 5]); break;
      case 6: item_fall_p([1, 6]); break;
      case 7: item_fall_p([0, 7]); break;
    }
    ATK_double_I2O.cur_index++;
    if(ATK_double_I2O.cur_index == 8) ATK_double_I2O.done();
  }
  static done() {
    clearInterval(ATK_double_I2O.interval);
    ATK_double_I2O.done_wait = setTimeout(() => ATK_double_I2O.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_double_I2O.interval);
    clearTimeout(ATK_double_I2O.done_wait);
  }
  static hit_end() {
    ATK_double_I2O.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_double_I2O.interval);
    clearTimeout(ATK_double_I2O.done_wait);
    ATK_double_I2O.res('stop');
  }
}
atk_get.ATK_double_I2O = ATK_double_I2O;

/* ================================ */
/*   雙重外到裡                     */
/* ================================ */
class ATK_double_O2I {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("double OUT => IN");
    clearInterval(ATK_double_O2I.interval);
    ATK_double_O2I.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_double_O2I.res = res;
      ATK_double_O2I.interval = setInterval(ATK_double_O2I.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_double_O2I.cur_index) {
      case 0: item_fall_p([0, 7]); break;
      case 1: item_fall_p([1, 6]); break;
      case 2: item_fall_p([2, 5]); break;
      case 3: item_fall_p([3, 4]); break;
      case 4: item_fall_p([0, 7]); break;
      case 5: item_fall_p([1, 6]); break;
      case 6: item_fall_p([2, 5]); break;
      case 7: item_fall_p([3, 4]); break;
    }
    ATK_double_O2I.cur_index++;
    if(ATK_double_O2I.cur_index == 8) ATK_double_O2I.done();
  }
  static done() {
    clearInterval(ATK_double_O2I.interval);
    ATK_double_O2I.done_wait = setTimeout(() => ATK_double_O2I.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_double_O2I.interval);
    clearTimeout(ATK_double_O2I.done_wait);
  }
  static hit_end() {
    ATK_double_O2I.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_double_O2I.interval);
    clearTimeout(ATK_double_O2I.done_wait);
    ATK_double_O2I.res('stop');
  }
}
atk_get.ATK_double_O2I = ATK_double_O2I;

/* ================================ */
/*   左到右追蹤                     */
/* ================================ */
class ATK_L2R_YouPosition {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("LEFT => RIGHT & you position");
    clearInterval(ATK_L2R_YouPosition.interval);
    ATK_L2R_YouPosition.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_L2R_YouPosition.res = res;
      ATK_L2R_YouPosition.interval = setInterval(ATK_L2R_YouPosition.tick, 450 * main_speed);
    });
  }
  static tick() {
    if(ATK_L2R_YouPosition.cur_index % 2) {
      item_fall_p([ATK_L2R_YouPosition.cur_index, cur_pos]);
    }
    else item_fall(ATK_L2R_YouPosition.cur_index);
    ATK_L2R_YouPosition.cur_index++;
    if(ATK_L2R_YouPosition.cur_index == 8) ATK_L2R_YouPosition.done();
  }
  static done() {
    clearInterval(ATK_L2R_YouPosition.interval);
    ATK_L2R_YouPosition.done_wait = setTimeout(() => ATK_L2R_YouPosition.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_L2R_YouPosition.interval);
    clearTimeout(ATK_L2R_YouPosition.done_wait);
  }
  static hit_end() {
    ATK_L2R_YouPosition.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_L2R_YouPosition.interval);
    clearTimeout(ATK_L2R_YouPosition.done_wait);
    ATK_L2R_YouPosition.res('stop');
  }
}
atk_get.ATK_L2R_YouPosition = ATK_L2R_YouPosition;

/* ================================ */
/*   奇數 + 追蹤                    */
/* ================================ */
class ATK_Odd_YouPosition {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("ODD & your position");
    clearInterval(ATK_Odd_YouPosition.interval);
    ATK_Odd_YouPosition.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_Odd_YouPosition.res = res;
      ATK_Odd_YouPosition.interval = setInterval(ATK_Odd_YouPosition.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_Odd_YouPosition.cur_index) {
      case 0: item_fall_p([0, 2]); break;
      case 1: item_fall_p([2, 4, cur_pos]); break;
      case 2: item_fall_p([4, 6]); break;
      case 3: item_fall(cur_pos); break;
    }
    ATK_Odd_YouPosition.cur_index++;
    if(ATK_Odd_YouPosition.cur_index == 4) ATK_Odd_YouPosition.done();
  }
  static done() {
    clearInterval(ATK_Odd_YouPosition.interval);
    ATK_Odd_YouPosition.done_wait = setTimeout(() => ATK_Odd_YouPosition.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_Odd_YouPosition.interval);
    clearTimeout(ATK_Odd_YouPosition.done_wait);
  }
  static hit_end() {
    ATK_Odd_YouPosition.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_Odd_YouPosition.interval);
    clearTimeout(ATK_Odd_YouPosition.done_wait);
    ATK_Odd_YouPosition.res('stop');
  }
}
atk_get.ATK_Odd_YouPosition = ATK_Odd_YouPosition;

/* ================================ */
/*   偶數 + 追蹤                    */
/* ================================ */
class ATK_Even_YouPosition {
  static interval = null;
  static cur_index = 0;
  static res = () => {};
  static done_wait = null;
  static start() {
    tip("EVEN & your position");
    clearInterval(ATK_Even_YouPosition.interval);
    ATK_Even_YouPosition.cur_index = 0;
    return new Promise((res, rej) => {
      ATK_Even_YouPosition.res = res;
      ATK_Even_YouPosition.interval = setInterval(ATK_Even_YouPosition.tick, 450 * main_speed);
    });
  }
  static tick() {
    switch(ATK_Even_YouPosition.cur_index) {
      case 0: item_fall_p([1, 3]); break;
      case 1: item_fall_p([3, 5, cur_pos]); break;
      case 2: item_fall_p([5, 7]); break;
      case 3: item_fall(cur_pos); break;
    }
    ATK_Even_YouPosition.cur_index++;
    if(ATK_Even_YouPosition.cur_index == 4) ATK_Even_YouPosition.done();
  }
  static done() {
    clearInterval(ATK_Even_YouPosition.interval);
    ATK_Even_YouPosition.done_wait = setTimeout(() => ATK_Even_YouPosition.res('done'), one_atk_time);
  }
  static hit_stop() {
    clearInterval(ATK_Even_YouPosition.interval);
    clearTimeout(ATK_Even_YouPosition.done_wait);
  }
  static hit_end() {
    ATK_Even_YouPosition.res('hit');
  }
  static game_stop() {
    clearInterval(ATK_Even_YouPosition.interval);
    clearTimeout(ATK_Even_YouPosition.done_wait);
    ATK_Even_YouPosition.res('stop');
  }
}
atk_get.ATK_Even_YouPosition = ATK_Even_YouPosition;

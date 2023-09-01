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
    if(ATK_Manager.cur_atk && ATK_Manager.cur_atk.hit_stop) {
      ATK_Manager.cur_atk.hit_stop();
    }
  }
  static hit_end_atk() {
    if(ATK_Manager.cur_atk && ATK_Manager.cur_atk.hit_end) {
      ATK_Manager.cur_atk.hit_end();
    }
  }
  static game_stop_atk() {
    if(ATK_Manager.cur_atk && ATK_Manager.cur_atk.game_stop) {
      ATK_Manager.cur_atk.game_stop();
    }
  }
  static hit() {
    move_lock = true;
    hp--;
    ItemObj.hit_stop_all_item();
    ATK_Manager.hit_stop_atk();
    find('#root').classList.add('hit');
    se("hit");
    setTimeout(() => {
      find('#root').classList.remove('hit');
      ItemObj.remove_all_item();
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
/*   基礎                           */
/* ================================ */
class ATK_base {
  static timeout = null;
  static cur_index = 0;
  static res = () => {};
  static time = 450;
  static done_wait = null;
  static atk_count = 7;
  static main_speed = 1;
  static one_atk_time = 600;
  static start() {
    this.cur_index = 0;
    this.init();
    clearTimeout(this.timeout);
    return new Promise((res, rej) => {
      this.res = res;
      this.set_tick();
    });
  }
  static set_time(time) {
    this.time = time * ATK_base.main_speed;
  }
  static init() {
    tip("test");
    this.set_time(450);
  }
  static set_tick() {
    this.timeout = setTimeout(() => {
      this.tick(this.cur_index);
      this.cur_index++;
      if(this.cur_index == this.atk_count) this.done();
      else this.set_tick();
    }, this.time);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall(0); break;
      case 1: item_fall(2); break;
      case 2: item_fall(4); break;
      case 3: item_fall(6); break;
      case 4: item_fall(2); this.set_time(690); break;
      case 5: tip("2 4 6 8"); item_fall_p([1, 3, 5, 7]); break;
      case 6: tip("1 3 5 7"); item_fall_p([0, 2, 4, 6]); break;
    }
  }
  static done() {
    clearTimeout(this.timeout);
    this.done_wait = setTimeout(() => {
      this.end_init();
      this.res('done');
    }, ATK_base.one_atk_time);
  }
  static hit_stop() {
    clearTimeout(this.timeout);
    clearTimeout(this.done_wait);
  }
  static hit_end() {
    this.end_init();
    this.res('hit');
  }
  static game_stop() {
    clearTimeout(this.timeout);
    clearTimeout(this.done_wait);
    this.end_init();
    this.res('stop');
  }
  static end_init() {}
}
atk_get.ATK_base = ATK_base;

// 測試
class ATK_test extends ATK_base {
  static atk_count = 10;
  static init() {
    tip("KASKASK");
    this.set_time(240);
  }
  static tick(i) {
    item_fall(0);
    // switch(i) {
      // case 0: item_fall_p([1, 2, 3]); break;
      // case 1: item_fall_p([4, 5, 6, 7]); break;
    // }
  }
}
atk_get.ATK_test = ATK_test;

/* ================================ */
/*   左右系列                       */
/* ================================ */

// 左到右
atk_get.ATK_L2R = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("LEFT => RIGHT");
    this.set_time(450);
  }
  static tick(i) {
    item_fall(i);
  }
}

// 右到左
atk_get.ATK_R2L = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("RIGHT => LEFT");
    this.set_time(450);
  }
  static tick(i) {
    item_fall(7 - i);
  }
}

// 雙重左到右
atk_get.ATK_double_L2R = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("double LEFT => RIGHT");
    this.set_time(450);
  }
  static tick(i) {
    item_fall_p([i, (i + 4) % 8]);
  }
}

// 雙重右到左
atk_get.ATK_double_R2L = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("double RIGHT => LEFT");
    this.set_time(450);
  }
  static tick(i) {
    item_fall_p([7 - i, (7 - i + 4) % 8]);
  }
}

// 左到右追蹤
atk_get.ATK_L2R_YouPosition = class extends ATK_base {
  static atk_count = 8;
  static init() {
    tip("LEFT => RIGHT & you position");
    this.set_time(450);
  }
  static tick(i) {
    if(i % 2) {
      item_fall_p([i, cur_pos]);
    }
    else item_fall(i);
  }
}

/* ================================ */
/*   奇偶系列                       */
/* ================================ */

// 13573
atk_get.ATK_OddEven = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("1 => 3 => 5 => 7");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall(0); break;
      case 1: item_fall(2); break;
      case 2: item_fall(4); break;
      case 3: item_fall(6); break;
      case 4: item_fall(2); this.set_time(690); break;
      case 5: tip("2 4 6 8"); item_fall_p([1, 3, 5, 7]); break;
      case 6: tip("1 3 5 7"); item_fall_p([0, 2, 4, 6]); break;
    }
  }
}

// 1357 2468
atk_get.ATK_OddEven_2 = class extends ATK_base {
  static atk_count = 4;
  static init() {
    tip("ODD & EVEN");
    this.set_time(450);
  }
  static tick(i) {
    let target = [
      [0, 2, 4, 6],
      [1, 3, 5, 7],
    ][i % 2];
    item_fall_p(target);
  }
}

// 奇數追蹤
atk_get.ATK_Odd_YouPosition = class extends ATK_base {
  static atk_count = 4;
  static init() {
    tip("ODD & your position");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall_p([0, 2]); break;
      case 1: item_fall_p([2, 4, cur_pos]); break;
      case 2: item_fall_p([4, 6]); break;
      case 3: item_fall(cur_pos); break;
    }
  }
}

// 偶數追蹤
atk_get.ATK_Even_YouPosition = class extends ATK_base {
  static atk_count = 4;
  static init() {
    tip("EVEN & your position");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall_p([1, 3]); break;
      case 1: item_fall_p([3, 5, cur_pos]); break;
      case 2: item_fall_p([5, 7]); break;
      case 3: item_fall(cur_pos); break;
    }
  }
}

// 奇偶與右到左
atk_get.ATK_OddEven_R2L = class extends ATK_base {
  static atk_count = 13;
  static init() {
    tip("ODD & EVEN & RIGHT => LEFT");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case  0: item_fall_p([0, 2, 4, 6, 7]); break;
      case  1: item_fall_p([1, 3, 5, 7, 6]); break;
      case  3: item_fall_p([0, 2, 4, 6, 5]); break;
      case  4: item_fall_p([1, 3, 5, 7, 4]); break;
      case  6: item_fall_p([0, 2, 4, 6, 3]); break;
      case  7: item_fall_p([1, 3, 5, 7, 2]); break;
      case  9: item_fall_p([0, 2, 4, 6, 1]); break;
      case 10: item_fall_p([1, 3, 5, 7, 0]); break;
    }
    if(i == 12) {
      ItemObj.skin('amen');
      item_fall(cur_pos);
    }
  }
}

// 奇偶與左到右
atk_get.ATK_OddEven_L2R = class extends ATK_base {
  static atk_count = 9;
  static init() {
    tip("EVEN & ODD & LEFT => RIGHT");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case  0: item_fall_p([1, 3, 5, 7, 0]); break;
      case  1: item_fall_p([0, 2, 4, 6, 1]); this.set_time(1500); break;
      case  2: item_fall_p([1, 3, 5, 7, 2]); this.set_time(450); break;
      case  3: item_fall_p([0, 2, 4, 6, 3]); this.set_time(1500); break;
      case  4: item_fall_p([1, 3, 5, 7, 4]); this.set_time(450); break;
      case  5: item_fall_p([0, 2, 4, 6, 5]); this.set_time(1500); break;
      case  6: item_fall_p([1, 3, 5, 7, 6]); this.set_time(450); break;
      case  7: item_fall_p([0, 2, 4, 6, 7]); this.set_time(1500); break;
    }
    if(i == 8) {
      tip('AMEN');
      ItemObj.skin('amen');
      item_fall(cur_pos);
    }
  }
}

/* ================================ */
/*   追蹤系列                       */
/* ================================ */

// 位置追蹤
atk_get.ATK_YouPosition = class extends ATK_base {
  static atk_count = 10;
  static init() {
    tip("your position");
    this.set_time(750);
  }
  static tick(i) {
    item_fall(cur_pos);
  }
}

// 雙重位置追蹤
atk_get.ATK_double_YouPosition = class extends ATK_base {
  static atk_count = 5;
  static prev_pos = null;
  static init() {
    tip("double your position");
    this.set_time(750);
    this.prev_pos = null;
  }
  static tick(i) {
    if(this.prev_pos != null && this.prev_pos != cur_pos) {
      item_fall_p([this.prev_pos, cur_pos]);
    }
    else item_fall(cur_pos);
    this.prev_pos = cur_pos;
  }
}

// 雙重位置追蹤 10次
atk_get.ATK_Reiji = class extends ATK_base {
  static atk_count = 10;
  static prev_pos = null;
  static init() {
    tip("double your position");
    this.set_time(820);
    this.prev_pos = null;
  }
  static tick(i) {
    ItemObj.skin('amen');
    if(this.prev_pos != null && this.prev_pos != cur_pos) {
      item_fall_p([cur_pos, this.prev_pos]);
    }
    else item_fall(cur_pos);
    this.prev_pos = cur_pos;
  }
}

// 三倍位置追蹤
class ATK_triple_YouPosition extends ATK_base {
  static atk_count = 5;
  static init() {
    tip("triple your position");
    this.set_time(750);
  }
  static tick(i) {
    item_fall_p([cur_pos - 2, cur_pos, cur_pos + 2]);
  }
}
atk_get.ATK_triple_YouPosition = ATK_triple_YouPosition;

/* ================================ */
/*   裡外系列                       */
/* ================================ */

// 裡到外
atk_get.ATK_I2O = class extends ATK_base {
  static atk_count = 8;
  static init() {
    tip("IN => OUT");
    this.set_time(450);
  }
  static tick(i) {
    item_fall(+("34251607"[i]));
  }
}

// 外到裡
atk_get.ATK_O2I = class extends ATK_base {
  static atk_count = 8;
  static init() {
    tip("OUT => IN");
    this.set_time(450);
  }
  static tick(i) {
    item_fall(+("70615243"[i]));
  }
}

// 雙重裡到外
atk_get.ATK_double_I2O = class extends ATK_base {
  static atk_count = 8;
  static init() {
    tip("double IN => OUT");
    this.set_time(450);
  }
  static tick(i) {
    let offset = i % 4;
    item_fall_p([3 - offset, 4 + offset]);
  }
}

// 雙重外到裡
atk_get.ATK_double_O2I = class extends ATK_base {
  static atk_count = 8;
  static init() {
    tip("double OUT => IN");
    this.set_time(450);
  }
  static tick(i) {
    let offset = i % 4;
    item_fall_p([0 + offset, 7 - offset]);
  }
}

// 外到內到外
atk_get.ATK_O2I2O = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("OUT => IN => OUT");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall_p([0, 7]); break;
      case 1: item_fall_p([1, 6]); break;
      case 2: item_fall_p([2, 5]); break;
      case 3: item_fall_p([3, 4]); break;
      case 4: item_fall_p([2, 5]); break;
      case 5: item_fall_p([1, 6]); break;
      case 6: item_fall_p([0, 7]); break;
    }
  }
}

// 內到外到內
atk_get.ATK_I2O2I = class extends ATK_base {
  static atk_count = 7;
  static init() {
    tip("IN => OUT => IN");
    this.set_time(450);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall_p([3, 4]); break;
      case 1: item_fall_p([2, 5]); break;
      case 2: item_fall_p([1, 6]); break;
      case 3: item_fall_p([0, 7]); break;
      case 4: item_fall_p([1, 6]); break;
      case 5: item_fall_p([2, 5]); break;
      case 6: item_fall_p([3, 4]); break;
    }
  }
}

/* ================================ */
/*   無系列                         */
/* ================================ */

// 4個並排
atk_get.ATK_4 = class extends ATK_base {
  static atk_count = 2;
  static init() {
    tip("1 2 3 4");
    this.set_time(600);
  }
  static tick(i) {
    switch(i) {
      case 0: item_fall_p([0, 1, 2, 3]); break;
      case 1: tip("5 6 7 8"); item_fall_p([4, 5, 6, 7]); break;
    }
  }
}

window.onload = () => {
  document.addEventListener('keydown', e => {
    if(e.code == "ArrowLeft" || e.code == "KeyA") { move(-1); select_character(-1); return; }
    if(e.code == "ArrowRight" || e.code == "KeyD") { move(1); select_character(1); return; }
    if(e.code == "Space" || e.code == "KeyZ" || e.code == "Enter") {
      if(view_text_ing) text_hide();
      else if(in_title) check_select_character();
      else if(game_end) back_title();
    }
  });
  find('#character').style.setProperty('--pos', cur_pos = 4);
  view_character(cur_character_index = 0);
};

/* ================================ */
/*   流程                           */
/* ================================ */
var game_state = "wait", hp = 3, game_end = false;
function start() {
  game_end = false;
  game_state = "wait";
  bgm.volume = 0.4;
  bgm.play();
  find('#gameclear').classList.remove('go');
  find('#gameover').style.display = "none";
  find('#vs_moment').removeAttribute('style');
  tip("");
  setTimeout(() => {
    game_state = "run";
    time_go();
    find('#vs_moment').style.display = "none";
    move_lock = false;
    game_run();
  }, 8000);
}
function clearance_game() {
  clearInterval(main_interval);
  move_lock = true;
  ATK_Manager.game_stop_atk();
  game_state = "clear";
  setTimeout(() => {
    bgm.volume = 0.3;
    find('#gameclear').classList.add('go');
  }, 600);
  setTimeout(() => bgm.volume = 0.2, 1200);
  setTimeout(() => {
    bgm.volume = 0.1;
    se("yeah");
  }, 1800);
  setTimeout(bgm_stop, 2400);
  setTimeout(() => {
    let unlock_list = character_list[cur_character_index].unlock;
    if(unlock_list) unlock_character(unlock_list);
    game_state = "clear_ed";
    game_end = true;
  }, 3000);
}
function gameover() {
  bgm_stop();
  se("gameover");
  find('#gameover').removeAttribute('style');
  clearInterval(main_interval);
  move_lock = true;
  ATK_Manager.game_stop_atk();
  game_state = "fail";
  game_end = true;
}
var has_tip = true;
function tip(str) {
  find('#tip').innerText = has_tip ? str : "";
}
function back_title() {
  if(game_state != "clear_ed" && game_state != "fail") return;
  game_state = "wait";
  game_end = false;
  in_title = true;
  find('#title').removeAttribute('style');
}

/* ================================ */
/*   顯示文字                       */
/* ================================ */
var view_text_ing = false;
function text_show(str) {
  find('#text').innerHTML = "";
  str.split('\n').map(string => {
    new_el_to_el('#text', 'span', string);
  });
  find('#text').classList.remove('hidden');
  view_text_ing = true;
}
function text_hide() {
  if(!view_text_ing) return;
  find('#text').classList.add('hidden');
  view_text_ing = false;
}

/* ================================ */
/*   選角                           */
/* ================================ */
var in_title = true, selecting = false;
var cur_character_index = 0;
function unlock_character(target_names) {
  if(!Array.isArray(target_names)) target_names = [target_names];
  let unlock_count = target_names.map(name => {
    let character = character_list.find(c => c.name == name);
    if(!character || !character.lock) return false;
    character.lock = false;
    return true;
  }).filter(c => c).length;
  if(unlock_count) {
    se('get');
    text_show(target_names.map(n => "已解鎖 " + n).join('\n'));
  }
}
function select_character(direction) {
  if(!in_title || selecting) return;
  selecting = true;
  se("key_move");
  find_all('.move_ani').forEach(el => el.classList.add(direction == 1 ? 'left_hide' : 'right_hide'));
  setTimeout(() => {
    find_all('.move_ani').forEach(el => {
      el.classList.remove('left_hide');
      el.classList.remove('right_hide');
      el.classList.add(direction == 1 ? 'left_show' : 'right_show');
    });
    cur_character_index = (character_list.length + cur_character_index + direction) % character_list.length;
    view_character();
    setTimeout(() => {
      find_all('.move_ani').forEach(el => {
        el.classList.remove('left_show');
        el.classList.remove('right_show');
      });
      selecting = false;
    }, 400);
  }, 400);
}
function view_character() {
  let character = character_list[cur_character_index];
  find('#character_name span').innerText = character.name;
  find('#character_image').src = `./img/character/${character.title_img || character.skin}.png`;
  find('#character_image').classList.toggle('lock', character.lock);
  find('#character_name').classList.toggle('lock', character.lock);
}
function check_select_character() {
  if(!in_title || selecting) return;
  let character = character_list[cur_character_index];
  if(character.lock) return se("key_cancel");
  se("key_check");
  character_data_read(character);
  find('#title').style.display = "none";
  in_title = false;
  start();
}
function character_data_read(character) {
  find('#root').setAttribute('name', character.skin);
  has_tip = character.tip;
  hp = character.hp;
  time = character.time;
  find('#character').style.setProperty('--pos', cur_pos = character.start_pos);
  ATK_base.main_speed = character.main_speed;
  ItemObj.set_before_time(character.fall_before_time);
  ItemObj.set_fall_speed(character.fall_speed);
  find('#se_fall').src = `./audio/${character.se_fall}.mp3`;
  find('#se_move').src = `./audio/${character.se_move}.mp3`;
  ATK_Wait.wait_time = character.wait_time;
  atk_list = character.atk_list;
}

/* ================================ */
/*   攻擊執行                       */
/* ================================ */
var time = 120, main_interval = null;
function time_go() {
  clearInterval(main_interval);
  time_view();
  main_interval = setInterval(() => {
    if(time <= 0) return clearance_game();
    time--;
    time_view();
  }, 1000);
}
function time_view() {
  let h = ("0" + Math.floor(time / 60)).substr(-2);
  let m = ("0" + (time % 60)).substr(-2);
  find('#time').innerText = h + ":" + m;
}
var atk_list = [];
var atk_get = {};
async function game_run() {
  for(let f=0; f<atk_list.length; f++) {
    await ATK_Manager.start_atk(ATK_Wait);
    let target_atk = atk_get[atk_list[f]];
    await ATK_Manager.start_atk(target_atk);
  }
  if(game_state == "run") game_run();
}

/* ================================ */
/*   攻擊物件                       */
/* ================================ */
function item_fall_p(indexs) {
  let check_indexs = [];
  indexs.forEach(index => {
    if(index < 0 || index > 7) return;
    if(!check_indexs.includes(index)) check_indexs.push(index);
  });
  check_indexs.forEach(index => new ItemObj(index));
}
function item_fall(index) {
  new ItemObj(index);
}
class ItemObj {
  static fall_speed = 28;
  static before_wait_time = 300;
  static set_before_time(target_time) {
    ItemObj.before_wait_time = target_time;
    ATK_base.one_atk_time = ItemObj.before_wait_time + ItemObj.fall_speed * ItemObj.max_pos;
  }
  static set_fall_speed(target_time) {
    ItemObj.fall_speed = target_time;
    ATK_base.one_atk_time = ItemObj.before_wait_time + ItemObj.fall_speed * ItemObj.max_pos;
  }
  static max_pos = 23;
  static atk_pos = 9;
  static all = [];
  static skin_class_list = [];
  static hit_stop_all_item() {
    ItemObj.all.forEach(item => {
      item.el.style.setProperty('--fall_speed', "0s");
      if(Math.abs(ItemObj.atk_pos - item.fall_pos) <= 1) {
        item.el.style.setProperty('--fall_pos', ItemObj.atk_pos);
      }
      clearTimeout(item.before_wait);
      clearTimeout(item.falling_timeout);
    });
  }
  static remove_all_item() {
    ItemObj.all.forEach(item => item.el.remove());
    ItemObj.all = [];
  }
  static remove_item(target_item) {
    let index = ItemObj.all.indexOf(target_item);
    ItemObj.all.splice(index, 1);
  }
  static skin(class_names) {
    if(!Array.isArray(class_names)) class_names = [class_names];
    ItemObj.skin_class_list.push(class_names);
  }
  constructor(grid_pos) {
    this.grid_pos = grid_pos;
    this.el = new_el_to_el('#items', 'div.item');
    this.el.style.setProperty('--grid_pos', grid_pos);
    this.el.style.setProperty('--fall_pos', this.fall_pos = 0);
    this.el.style.setProperty('--fall_speed', (ItemObj.fall_speed / 1000) + "s");
    this.set_skin();
    this.before_wait = setTimeout(() => {
      se("fall");
      this.fall_tick();
    }, ItemObj.before_wait_time);
    ItemObj.all.push(this);
  }
  set_skin() {
    let class_names = ItemObj.skin_class_list.shift();
    if(class_names) class_names.forEach(class_name => this.el.classList.add(class_name));
  }
  fall_tick() {
    this.fall_pos++;
    this.el.style.setProperty('--fall_pos', this.fall_pos);
    this.falling_timeout = setTimeout(() => this.fall_check(), ItemObj.fall_speed);
  }
  fall_check() {
    if(this.fall_pos == ItemObj.max_pos) this.fall_end_remove();
    else if(this.fall_pos == ItemObj.atk_pos && cur_pos == this.grid_pos) ATK_Manager.hit();
    else this.fall_tick();
  }
  fall_end_remove() {
    clearTimeout(this.falling_timeout);
    this.el.remove();
    ItemObj.remove_item(this);
  }
}

/* ================================ */
/*   移動                           */
/* ================================ */
var cur_pos = 4, move_lock = true, moving = false;
function move(direction) {
  if(game_state != "run" || move_lock || moving) return;
  find('#character').classList.toggle('r', direction > 0);
  if(cur_pos + direction >= 0 && cur_pos + direction <= 7) {
    cur_pos += direction;
    moving = true;
    find('#character').classList.add('move');
    find('#character').style.setProperty('--pos', cur_pos);
    se("move");
    setTimeout(() => {
      find('#character').classList.remove('move');
      moving = false;
    }, 300);
  }
}

/* ================================ */
/*   音效                           */
/* ================================ */
var fall_se_space = false;
function se(se_name) {
  if(se_name == "fall") {
    if(fall_se_space) return;
    fall_se_space = true;
    setTimeout(() => fall_se_space = false, 100);
  }
  let audio;
  switch(se_name) {
    case "gameover": audio = find("#se_gameover"); break;
    case "move": audio = find("#se_move"); break;
    case "fall": audio = find("#se_fall"); break;
    case "hit": audio = find("#se_hit"); break;
    case "key_move": audio = find("#se_key_move"); break;
    case "key_check": audio = find("#se_key_check"); break;
    case "key_cancel": audio = find("#se_key_cancel"); break;
    case "get": audio = find("#se_get"); break;
    case "yeah": audio = find("#se_yeah"); break;
    default: return;
  }
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}
function bgm_stop() {
  bgm.pause();
  bgm.currentTime = 0;
}

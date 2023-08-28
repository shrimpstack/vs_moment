window.onload = () => {
  document.addEventListener('keydown', e => {
    if(e.code == "ArrowLeft") { move(-1); select_character(-1); return; }
    if(e.code == "ArrowRight") { move(1); select_character(1); return; }
    if(e.code == "Space" || e.code == "KeyZ" || e.code == "Enter") {
      if(view_text_ing) text_hide();
      else if(in_title) check_select_character();
      else if(game_end) back_title();
    }
  });
  find('#character').style.setProperty('--pos', cur_pos = 4);
  item_init();
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
    (character_list[cur_character_index].unlock || [])
    .forEach(target_name => unlock_character(target_name));
    game_state = "clear_ed";
    game_end = true;
  }, 5000);
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
  find('#text span').innerText = str;
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
const character_list = [
  {
    name: "阿藤春樹",
    skin: "阿藤春樹",
    lock: false,
    unlock: ["磯井麗慈"],
    tip: true,
    hp: 3,
    time: 60,
    fall_before_time: 300,
    fall_speed: 28,
    main_speed: 1,
    wait_time: 800,
    se_fall: "冰",
    se_move: "風",
    atk_list: [
      "ATK_L2R", "ATK_R2L", "ATK_OddEven", "ATK_YouPosition",
      "ATK_4", "ATK_I2O",
    ],
  },
  {
    name: "阿藤春樹 (困難版)",
    skin: "阿藤春樹",
    lock: false,
    tip: false,
    hp: 3,
    time: 100,
    fall_before_time: 100,
    fall_speed: 18,
    main_speed: 0.7,
    wait_time: 460,
    se_fall: "冰",
    se_move: "風",
    atk_list: [
      "ATK_L2R", "ATK_R2L", "ATK_OddEven", "ATK_YouPosition",
      "ATK_4", "ATK_I2O",
    ],
  },
  {
    name: "磯井麗慈",
    skin: "磯井麗慈",
    lock: true,
    tip: true,
    hp: 3,
    time: 100,
    fall_before_time: 300,
    fall_speed: 28,
    main_speed: 1,
    wait_time: 800,
    se_fall: "岩石",
    se_move: "鐵鍊",
    atk_list: [
      "ATK_O2I", "ATK_I2O", "ATK_double_O2I", "ATK_double_I2O",
      "ATK_L2R_YouPosition",
    ],
  },
];
function unlock_character(target_name) {
  let character = character_list.find(c => c.name == target_name);
  if(!character.lock) return;
  character.lock = false;
  se('get');
  text_show("解鎖了 " + target_name);
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
  find('#character_image img').src = `./img/character/${character.skin}.png`;
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
  fall_before_time = character.fall_before_time;
  fall_speed = character.fall_speed;
  main_speed = character.main_speed;
  find('#se_fall').src = `./audio/${character.se_fall}.mp3`;
  find('#se_move').src = `./audio/${character.se_move}.mp3`;
  ATK_Wait.wait_time = character.wait_time;
  atk_list = character.atk_list;
  one_atk_time = fall_before_time + fall_speed * item_max_pos;
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
const item_atk_pos = 9;
const item_max_pos = 23;
const items_state = [];
var main_speed = 1;
var fall_before_time = 100;
var fall_speed = 18;
var one_atk_time = fall_before_time + fall_speed * item_max_pos;
function item_init() {
  let els = find_all('.item');
  for(let f=0; f<8; f++) {
    let item = {
      pos: 0,
      el: els[f],
      falling: false,
      wait: null,
    };
    item.interval = setInterval(() => {
      if(!item.falling) return;
      item.pos++;
      item.el.style.setProperty('--pos', item.pos);
      if(item.pos == item_max_pos) item_fall_stop(item);
      else if(item.pos == item_atk_pos && cur_pos == f) ATK_Manager.hit();
    }, fall_speed);
    items_state[f] = item;
  }
}
function hit_stop_items() {
  items_state.forEach(item => {
    clearTimeout(item.wait);
    item_fall_stop(item);
  });
}
function reset_items() {
  items_state.forEach(item => {
    item_fall_stop(item);
  });
}
function item_fall_stop(item) {
  item.el.style.removeProperty('--fall_speed');
  item.pos = 0;
  item.el.style.setProperty('--pos', 0);
  item.falling = false;
}
function item_fall_p(indexs) {
  indexs.forEach(index => item_fall(index));
}
function item_fall(index) {
  let item = items_state[index];
  item_fall_stop(item);
  item.wait = setTimeout(() => {
    se("fall");
    item.el.style.setProperty('--fall_speed', (fall_speed / 1000) + "s");
    item.falling = true;
  }, fall_before_time);
}

/* ================================ */
/*   移動                           */
/* ================================ */
var cur_pos = 4, move_lock = true, moving = false;
function move(direction) {
  if(move_lock || moving) return;
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

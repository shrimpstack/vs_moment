const character_list = [
  {
    name: "阿藤春樹",
    skin: "阿藤春樹",
    lock: false,
    unlock: ["磯井麗慈", "磯井麗慈 (困難版)"],
    tip: true,
    hp: 3,
    time: 60,
    start_pos: 4,
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
    unlock: ["磯井麗慈", "磯井麗慈 (困難版)"],
    tip: false,
    hp: 3,
    time: 100,
    start_pos: 4,
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
    unlock: ["磯井實光", "磯井實光 (困難版)"],
    tip: true,
    hp: 5,
    time: 100,
    start_pos: 4,
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
  {
    name: "磯井麗慈 (困難版)",
    skin: "磯井麗慈",
    lock: true,
    unlock: ["磯井實光", "磯井實光 (困難版)"],
    tip: false,
    hp: 3,
    time: 120,
    start_pos: 4,
    fall_before_time: 300,
    fall_speed: 18,
    main_speed: 0.7,
    wait_time: 460,
    se_fall: "岩石",
    se_move: "鐵鍊",
    atk_list: [
      "ATK_O2I", "ATK_I2O", "ATK_double_O2I", "ATK_double_I2O",
      "ATK_L2R_YouPosition",
    ],
  },
  {
    name: "磯井實光",
    skin: "磯井實光",
    lock: true,
    unlock: ["宇津木德幸", "宇津木德幸 (困難版)"],
    tip: true,
    hp: 5,
    time: 60,
    start_pos: 3,
    fall_before_time: 300,
    fall_speed: 28,
    main_speed: 1,
    wait_time: 800,
    se_fall: "翻頁",
    se_move: "咻",
    atk_list: [
      "ATK_double_L2R", "ATK_Odd_YouPosition",
      "ATK_double_R2L", "ATK_Even_YouPosition",
      "ATK_OddEven_2", "ATK_double_YouPosition",
    ],
  },
  {
    name: "磯井實光 (困難版)",
    skin: "磯井實光",
    lock: true,
    unlock: ["宇津木德幸", "宇津木德幸 (困難版)"],
    tip: true,
    hp: 3,
    time: 100,
    start_pos: 3,
    fall_before_time: 300,
    fall_speed: 18,
    main_speed: 0.7,
    wait_time: 460,
    se_fall: "翻頁",
    se_move: "咻",
    atk_list: [
      "ATK_double_L2R", "ATK_Odd_YouPosition",
      "ATK_double_R2L", "ATK_Even_YouPosition",
      "ATK_OddEven_2", "ATK_double_YouPosition",
    ],
  },
  {
    name: "宇津木德幸",
    skin: "宇津木德幸",
    lock: true,
    tip: true,
    hp: 5,
    time: 60,
    start_pos: 4,
    fall_before_time: 300,
    fall_speed: 28,
    main_speed: 1,
    wait_time: 800,
    se_fall: "十字架",
    se_move: "刺",
    atk_list: [
      "ATK_OddEven_L2R", "ATK_triple_And_YouPosition", "ATK_Reiji", 
      "ATK_OddEven_R2L", "ATK_triple_And_YouPosition", "ATK_Reiji",
    ],
  },
  {
    name: "宇津木德幸 (困難版)",
    skin: "宇津木德幸",
    lock: true,
    tip: true,
    hp: 3,
    time: 100,
    start_pos: 4,
    fall_before_time: 300,
    fall_speed: 18,
    main_speed: 0.7,
    wait_time: 460,
    se_fall: "十字架",
    se_move: "刺",
    atk_list: [
      "ATK_OddEven_L2R", "ATK_triple_And_YouPosition", "ATK_Reiji", 
      "ATK_OddEven_R2L", "ATK_triple_And_YouPosition", "ATK_Reiji",
    ],
  },
];
const hidden_character_list = [
  {
    name: "嘉納扇",
    skin: "嘉納扇",
    lock: true,
    tip: true,
    hp: 5,
    time: 60,
    start_pos: 4,
    fall_before_time: 300,
    fall_speed: 28,
    main_speed: 1,
    wait_time: 800,
    se_fall: "小刀",
    se_move: "風",
    atk_list: [
      "ATK_L2R",
    ],
  },
];
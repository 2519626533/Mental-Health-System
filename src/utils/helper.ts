import type { UserInfo } from '@/store'
import CryptoJS from 'crypto-js'

// 加密
export const encrypt = (data: string, key: string) => {
  return CryptoJS.AES.encrypt(data, key).toString()
}
// 解密
export const decrypt = (encrypted: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
// Mock数据
// mockData.ts
export const generateMockData = () => {
  // 生成符合正态分布的随机分数
  const generateNormalScore = () => {
    let score = Math.random() * 2 + 1 // 1-3区间
    if (Math.random() > 0.7)
      score += Math.random() * 2 // 70%概率增加0-2分
    return Number.parseFloat(Math.min(5, score).toFixed(1)) // 确保不超过5分
  }

  // 生成20条测试记录
  const testRecords = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: '张三',
    studentId: `2023010${i + 10}`,
    gender: i % 2 === 0 ? '男' : '女',
    age: 18 + Math.floor(Math.random() * 5),
    testDate: `2023-11-${i < 9 ? `0${i + 1}` : i + 1}`,
    factors: {
      躯体化: generateNormalScore(),
      强迫症状: generateNormalScore(),
      人际关系敏感: generateNormalScore(),
      抑郁: generateNormalScore(),
      焦虑: generateNormalScore(),
      敌对: generateNormalScore(),
      恐怖: generateNormalScore(),
      偏执: generateNormalScore(),
      精神病性: generateNormalScore(),
      其他: generateNormalScore(),
    },
    totalScore: Number.parseFloat((Math.random() * 20 + 30).toFixed(1)), // 30-50总分
  }))

  // 统计卡片数据
  const statsCards = [
    { title: '总测试人数', value: 200, icon: 'User' },
    { title: '今日新增', value: 15, icon: 'Document' },
    { title: '平均分数', value: 3.2, icon: 'Trend' },
    { title: '最高分', value: 4.8, icon: 'Medal' },
  ]

  // 性别分布数据
  const genderData = [
    { gender: '男', count: 120 },
    { gender: '女', count: 80 },
  ]

  // 年龄分布数据
  const ageDistribution = {
    '18-20': 50,
    '21-23': 120,
    '24-26': 70,
    '27-30': 30,
  }

  // SCL-90因子平均分
  const scl90Factors = {
    躯体化: 3.2,
    强迫症状: 4.1,
    人际关系敏感: 3.8,
    抑郁: 4.0,
    焦虑: 3.5,
    敌对: 2.8,
    恐怖: 3.1,
    偏执: 2.9,
    精神病性: 2.6,
    其他: 3.3,
  }

  // 测试趋势数据
  const testTrends = [
    { date: '周一', averageScore: 3.2 },
    { date: '周二', averageScore: 3.5 },
    { date: '周三', averageScore: 3.7 },
    { date: '周四', averageScore: 3.4 },
    { date: '周五', averageScore: 3.6 },
  ]

  return {
    testRecords,
    statsCards,
    genderData,
    ageDistribution,
    scl90Factors,
    testTrends,
  }
}

// 模拟头像上传
export const uploadAvatar = (file: File) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file))
    }, 500)
  })
}

// 模拟更新资料
export const updateProfile = (profile: UserInfo) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 500)
  })
}

// 模拟修改密码
export const changePassword = (data: { oldPassword: string, newPassword: string }) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (data.newPassword === data.oldPassword) {
        reject(new Error('新密码不能与原密码相同'))
      }
      resolve()
    }, 500)
  })
}

// utils/helper.ts
// 示例真实资源（2025年5月更新）
export const generateLink = () => {
  return {
    carouselItems: [
      {
        title: '中国心理学会官方指南',
        imageUrl: 'https://example.com/mental-health-1.jpg ', // 替换为实际CDN地址
        link: 'https://www.cpsbeijing.org.cn ',
      },
      {
        title: '国家心理健康网',
        imageUrl: 'https://example.com/mental-health-2.jpg ', // 替换为实际CDN地址
        link: 'https://www.nmpf.org.cn ',
      },
      {
        title: '心理学空间',
        imageUrl: 'https://example.com/mental-health-3.jpg ', // 替换为实际CDN地址
        link: 'http://www.psychspace.com',
      },
    ],
    additionalResources: [
      {
        title: '高校心理援助平台',
        description: '提供免费在线心理咨询',
        link: 'https://www.psyhelp.cn ',
      },
      {
        title: '简单心理',
        description: '专业心理测评与咨询服务',
        link: 'https://www.jdxinli.cn ',
      },
      {
        title: '壹心理',
        description: '心理学书籍与课程',
        link: 'https://www.xinli001.com ',
      },
    ],
  }
}

// utils/helper.ts
export const generateScl90Questions = () => {
  return [
    {
      id: 1,
      text: '头痛',
      factor: '躯体化',
    },
    {
      id: 2,
      text: '神经过敏，心中不踏实',
      factor: '强迫症状',
    },
    {
      id: 3,
      text: '头脑中有不必要的想法或字句盘旋',
      factor: '强迫症状',
    },
    {
      id: 4,
      text: '头晕或晕倒',
      factor: '躯体化',
    },
    {
      id: 5,
      text: '对异性的兴趣减退',
      factor: '人际关系敏感',
    },
    {
      id: 6,
      text: '对旁人责备求全',
      factor: '人际关系敏感',
    },
    {
      id: 7,
      text: '感到别人能控制您的思想',
      factor: '偏执',
    },
    {
      id: 8,
      text: '责怪别人制造麻烦',
      factor: '敌对',
    },
    {
      id: 9,
      text: '忘性大',
      factor: '强迫症状',
    },
    {
      id: 10,
      text: '担心自己的衣饰整齐及仪态的端正',
      factor: '焦虑',
    },
    {
      id: 11,
      text: '容易烦恼和激动',
      factor: '焦虑',
    },
    {
      id: 12,
      text: '胸痛',
      factor: '躯体化',
    },
    {
      id: 13,
      text: '害怕空旷的场所或街道',
      factor: '恐怖',
    },
    {
      id: 14,
      text: '感到自己的精力下降，活动减慢',
      factor: '抑郁',
    },
    {
      id: 15,
      text: '想结束自己的生命',
      factor: '抑郁',
    },
    {
      id: 16,
      text: '听到旁人听不到的声音',
      factor: '精神病性',
    },
    {
      id: 17,
      text: '发抖',
      factor: '焦虑',
    },
    {
      id: 18,
      text: '感到大多数人都不可信任',
      factor: '敌对',
    },
    {
      id: 19,
      text: '胃口不好',
      factor: '躯体化',
    },
    {
      id: 20,
      text: '容易哭泣',
      factor: '抑郁',
    },
    {
      id: 21,
      text: '同异性相处时感到害羞不自在',
      factor: '人际关系敏感',
    },
    {
      id: 22,
      text: '感到受骗，中了圈套或有人想抓住您',
      factor: '偏执',
    },
    {
      id: 23,
      text: '无缘无故地突然感到害怕',
      factor: '恐怖',
    },
    {
      id: 24,
      text: '自己不能控制地大发脾气',
      factor: '敌对',
    },
    {
      id: 25,
      text: '怕单独出门',
      factor: '恐怖',
    },
    {
      id: 26,
      text: '经常责怪自己',
      factor: '抑郁',
    },
    {
      id: 27,
      text: '腰痛',
      factor: '躯体化',
    },
    {
      id: 28,
      text: '感到难以完成任务',
      factor: '抑郁',
    },
    {
      id: 29,
      text: '感到孤独',
      factor: '抑郁',
    },
    {
      id: 30,
      text: '感到苦闷',
      factor: '抑郁',
    },
    {
      id: 31,
      text: '过分担忧',
      factor: '焦虑',
    },
    {
      id: 32,
      text: '对事物不感兴趣',
      factor: '抑郁',
    },
    {
      id: 33,
      text: '感到害怕',
      factor: '恐怖',
    },
    {
      id: 34,
      text: '您的感情容易受到伤害',
      factor: '人际关系敏感',
    },
    {
      id: 35,
      text: '旁人能知道您的私下想法',
      factor: '偏执',
    },
    {
      id: 36,
      text: '感到别人不理解您、不同情您',
      factor: '人际关系敏感',
    },
    {
      id: 37,
      text: '感到人们对您不友好，不喜欢您',
      factor: '人际关系敏感',
    },
    {
      id: 38,
      text: '做事必须做得很慢以保证做得正确',
      factor: '强迫症状',
    },
    {
      id: 39,
      text: '心跳得很厉害',
      factor: '焦虑',
    },
    {
      id: 40,
      text: '恶心或胃部不舒服',
      factor: '躯体化',
    },
    {
      id: 41,
      text: '感到比不上他人',
      factor: '人际关系敏感',
    },
    {
      id: 42,
      text: '肌肉酸痛',
      factor: '躯体化',
    },
    {
      id: 43,
      text: '感到有人在监视您、谈论您',
      factor: '偏执',
    },
    {
      id: 44,
      text: '难以入睡',
      factor: '抑郁',
    },
    {
      id: 45,
      text: '做事必须反复检查',
      factor: '强迫症状',
    },
    {
      id: 46,
      text: '难以做出决定',
      factor: '抑郁',
    },
    {
      id: 47,
      text: '怕乘电车、公共汽车、地铁或火车',
      factor: '恐怖',
    },
    {
      id: 48,
      text: '呼吸有困难',
      factor: '躯体化',
    },
    {
      id: 49,
      text: '一阵阵发冷或发热',
      factor: '躯体化',
    },
    {
      id: 50,
      text: '因为感到害怕而避开某些东西、场合或活动',
      factor: '恐怖',
    },
    {
      id: 51,
      text: '脑子变空了',
      factor: '抑郁',
    },
    {
      id: 52,
      text: '身体发麻或刺痛',
      factor: '躯体化',
    },
    {
      id: 53,
      text: '喉咙有梗塞感',
      factor: '躯体化',
    },
    {
      id: 54,
      text: '感到前途没有希望',
      factor: '抑郁',
    },
    {
      id: 55,
      text: '不能集中注意力',
      factor: '抑郁',
    },
    {
      id: 56,
      text: '感到身体的某一部分软弱无力',
      factor: '躯体化',
    },
    {
      id: 57,
      text: '感到紧张或容易紧张',
      factor: '焦虑',
    },
    {
      id: 58,
      text: '感到手或脚发重',
      factor: '躯体化',
    },
    {
      id: 59,
      text: '想到死亡的事',
      factor: '抑郁',
    },
    {
      id: 60,
      text: '吃得太多',
      factor: '躯体化',
    },
    {
      id: 61,
      text: '同异性相处时感到害羞不自在',
      factor: '人际关系敏感',
    },
    {
      id: 62,
      text: '有一些不属于您自己的想法',
      factor: '精神病性',
    },
    {
      id: 63,
      text: '有想打人或伤害他人的冲动',
      factor: '敌对',
    },
    {
      id: 64,
      text: '醒得太早',
      factor: '抑郁',
    },
    {
      id: 65,
      text: '必须反复洗手、点数',
      factor: '强迫症状',
    },
    {
      id: 66,
      text: '睡得不稳不深',
      factor: '抑郁',
    },
    {
      id: 67,
      text: '有想摔坏或破坏东西的想法',
      factor: '敌对',
    },
    {
      id: 68,
      text: '有一些别人没有的想法',
      factor: '精神病性',
    },
    {
      id: 69,
      text: '感到对别人神经过敏',
      factor: '人际关系敏感',
    },
    {
      id: 70,
      text: '在商店或电影院等人多的地方感到不自在',
      factor: '恐怖',
    },
    {
      id: 71,
      text: '感到任何事情都很困难',
      factor: '抑郁',
    },
    {
      id: 72,
      text: '一阵阵恐惧或惊恐',
      factor: '恐怖',
    },
    {
      id: 73,
      text: '感到公共场合吃东西很不舒服',
      factor: '人际关系敏感',
    },
    {
      id: 74,
      text: '经常与人争论',
      factor: '敌对',
    },
    {
      id: 75,
      text: '单独一人时神经很紧张',
      factor: '焦虑',
    },
    {
      id: 76,
      text: '别人对您的成绩没有做出恰当的评价',
      factor: '人际关系敏感',
    },
    {
      id: 77,
      text: '感到人们对您不友好，不喜欢您',
      factor: '人际关系敏感',
    },
    {
      id: 78,
      text: '感到坐立不安心神不定',
      factor: '焦虑',
    },
    {
      id: 79,
      text: '感到自己没有什么价值',
      factor: '抑郁',
    },
    {
      id: 80,
      text: '感到熟悉的东西变成陌生或不像是真的',
      factor: '精神病性',
    },
    {
      id: 81,
      text: '大叫或摔东西',
      factor: '敌对',
    },
    {
      id: 82,
      text: '害怕会在公共场合晕倒',
      factor: '恐怖',
    },
    {
      id: 83,
      text: '感到有人在监视您、谈论您',
      factor: '偏执',
    },
    {
      id: 84,
      text: '为一些有关性的想法而很苦恼',
      factor: '其他',
    },
    {
      id: 85,
      text: '您认为应该因为自己的过错而受到惩罚',
      factor: '抑郁',
    },
    {
      id: 86,
      text: '感到要很快把事情做完',
      factor: '强迫症状',
    },
    {
      id: 87,
      text: '感到自己的身体有严重问题',
      factor: '躯体化',
    },
    {
      id: 88,
      text: '从未感到和其他人很亲近',
      factor: '人际关系敏感',
    },
    {
      id: 89,
      text: '感到自己有罪',
      factor: '抑郁',
    },
    {
      id: 90,
      text: '感到自己的脑子有毛病',
      factor: '精神病性',
    },
  ]
}

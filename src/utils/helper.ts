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

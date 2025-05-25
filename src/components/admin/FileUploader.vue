<script setup lang="ts">
import { useDataStore } from '@/store/modules/dataStore'
import { ref } from 'vue'
import * as XLSX from 'xlsx'

// 类型定义
type UploadStatus = 'ready' | 'uploading' | 'parsing' | 'done'

// 定义 ref
const dataStore = useDataStore()
const fileInput = ref<HTMLInputElement | null>(null)
const dialogVisible = ref(false)
const file = ref<File | null>(null)
const progress = ref(0)
const status = ref<UploadStatus>('ready')
const parsedData = ref<any[]>([])

// 文件类型验证
const validateFile = (file: File): boolean => {
  const validTypes = ['application/json', '.xls', '.xlsx']
  const isValidType = validTypes.some(type =>
    file.type.includes(type) || file.name.endsWith('.xls') || file.name.endsWith('.xlsx'),
  )

  if (!isValidType) {
    alert('请上传JSON或Excel文件')
    return false
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过10MB')
    return false
  }

  return true
}

// 数据格式验证
const validateData = (data: any[]): boolean => {
  if (!Array.isArray(data)) {
    console.warn('数据不是数组')
    return false
  }

  const requiredFields = ['studentId', 'name', 'gender', 'age', 'testDate', 'totalScore']

  return data.every((item) => {
    // 检查必要字段
    const missingFields = requiredFields.filter(field =>
      item[field] === undefined && item[field] !== 0,
    )

    if (missingFields.length > 0) {
      console.warn('缺少必要字段:', missingFields)
      return false
    }

    // 验证因子分
    if (typeof item.factors === 'object') {
      const invalidFactors = Object.values(item.factors).some(
        (value: any) => typeof value !== 'number' || value < 1 || value > 5,
      )

      if (invalidFactors) {
        console.warn('因子分无效:', item)
        return false
      }
    }

    return true
  })
}

// 文件选择处理
const handleFileChange = (selectedFile: Event) => {
  const target = selectedFile.target as HTMLInputElement
  const selected = target.files?.[0]

  if (selected && validateFile(selected)) {
    file.value = selected
    dialogVisible.value = true
    status.value = 'ready'
    parsedData.value = []
  }
}

// 解析文件
const parseFile = () => {
  if (!file.value)
    return

  const reader = new FileReader()

  reader.onload = async (e) => {
    try {
      let result: any[]

      // JSON 文件处理
      if (file.value!.name.endsWith('.json')) {
        result = JSON.parse(e.target?.result as string)
      } else {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        result = XLSX.utils.sheet_to_json(firstSheet)
      }

      // 数据转换
      parsedData.value = result.map((item) => {
        // 处理嵌套结构
        const scl90 = item.scl90 || item.testData?.[0]?.scl90 || {}

        // 计算总分
        const totalScore = item.totalScore
          || Object.values(scl90).reduce((a: number, b: any) => {
            const num = typeof b === 'number' ? b : Number.parseFloat(b)
            return a + (num || 0)
          }, 0)

        return {
          studentId: item.studentId?.toString(),
          name: item.name,
          gender: item.gender,
          age: Number.parseInt(item.age),
          testDate: item.testDate || item.testData?.[0]?.testDate,
          factors: scl90,
          totalScore,
        }
      })

      // 数据验证
      if (validateData(parsedData.value)) {
        status.value = 'done' // 添加 done 状态
      } else {
        status.value = 'ready'
        alert('文件格式不正确，请参考示例文件格式')
      }
    } catch (error) {
      console.error('文件解析失败:', error)
      alert('文件解析失败，请检查文件内容')
      status.value = 'ready'
    }
  }

  // 根据文件类型选择读取方式
  if (file.value.name.endsWith('.json')) {
    reader.readAsText(file.value)
  } else {
    reader.readAsArrayBuffer(file.value)
  }
}

// 上传处理（模拟进度）
const uploadFile = () => {
  if (!file.value)
    return

  status.value = 'uploading'
  progress.value = 0

  // 模拟上传进度
  const uploadInterval = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) {
      clearInterval(uploadInterval)
      status.value = 'parsing'
      // 添加延迟以显示解析状态
      setTimeout(() => {
        parseFile()
      }, 300)
    }
  }, 100)
}

// 提交解析数据
const submitData = () => {
  if (parsedData.value.length > 0) {
    console.log(parsedData.value)
    dataStore.addStudents(parsedData.value)
    dialogVisible.value = false
    alert('数据导入成功')
  }
}
</script>

<template>
  <!-- 文件输入 -->
  <input
    id="fileInput"
    ref="fileInput"
    type="file"
    accept=".json,.xls,.xlsx"
    hidden
    @change="handleFileChange"
  />

  <!-- 上传按钮 -->
  <el-button color="#2FD2FE" @click="fileInput?.click()">
    导入数据
  </el-button>

  <!-- 上传对话框 -->
  <el-dialog v-model="dialogVisible" title="文件导入">
    <div v-if="status === 'ready'" class="dialog-content">
      <p>已选择文件: {{ file?.name }}</p>
      <div class="flex justify-center mt-4">
        <el-button color="#86F6BB" @click="uploadFile">解析</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </div>

    <div v-if="status === 'uploading'" class="dialog-content">
      <p>上传中...</p>
      <el-progress :percentage="progress" :color="['#86F6BB']" />
    </div>

    <div v-if="status === 'parsing'" class="dialog-content">
      <p>解析中...</p>
      <el-progress :percentage="100" :color="['#2FD2FE']" />
    </div>

    <div v-if="status === 'done'" class="dialog-content">
      <p>解析完成，准备导入</p>
      <p class="text-sm text-gray-500 mb-4">共找到 {{ parsedData.length }} 条记录</p>
      <el-button color="#86F6BB" @click="submitData">确认导入</el-button>
    </div>
  </el-dialog>
</template>

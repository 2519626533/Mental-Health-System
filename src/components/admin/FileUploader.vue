<script setup lang="ts">
import { uploadFileAPI } from '@/apis'
import { useDataStore } from '@/store/modules/dataStore'
import { ref } from 'vue'

// 类型定义
type UploadStatus = 'ready' | 'uploading' | 'done'

// 定义 ref
const dataStore = useDataStore()
const fileInput = ref<HTMLInputElement | null>(null)
const dialogVisible = ref(false)
const file = ref<File | null>(null)
const progress = ref(0)
const status = ref<UploadStatus>('ready')

// 文件类型验证
const validateFile = (file: File): boolean => {
  const validTypes = ['application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  const isValidType = validTypes.includes(file.type) || file.name.endsWith('.json') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')

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

// 文件选择处理
const handleFileChange = (selectedFile: Event) => {
  const target = selectedFile.target as HTMLInputElement
  const selected = target.files?.[0]

  if (selected && validateFile(selected)) {
    file.value = selected
    dialogVisible.value = true
    status.value = 'ready'
  }
}

// 上传处理
const uploadFile = async () => {
  if (!file.value)
    return

  status.value = 'uploading'
  progress.value = 0

  try {
    // 创建 FormData 对象
    const formData = new FormData()
    formData.append('file', file.value)

    // 调用上传接口
    const res = await uploadFileAPI(formData, (progressEvent) => {
      // 进度更新
      if (progressEvent.total) {
        progress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
      }
    })

    if (res.data.code === 1) {
      status.value = 'done'
      alert('文件上传成功')

      // 刷新数据
      setTimeout(() => {
        dialogVisible.value = false
        dataStore.loadMockData()
      }, 1000)
    } else {
      alert(res.data.msg || '上传失败')
      status.value = 'ready'
    }
  } catch (error: any) {
    console.error('文件上传失败:', error)
    alert(error.message || '上传失败')
    status.value = 'ready'
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
  <el-dialog v-model="dialogVisible" title="文件上传">
    <div v-if="status === 'ready'" class="dialog-content">
      <p>已选择文件: {{ file?.name }}</p>
      <div class="flex justify-center mt-4">
        <el-button color="#86F6BB" @click="uploadFile">开始上传</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </div>

    <div v-if="status === 'uploading'" class="dialog-content">
      <p>上传中...</p>
      <el-progress :percentage="progress" :color="['#86F6BB']" />
    </div>

    <div v-if="status === 'done'" class="dialog-content">
      <p>上传完成</p>
      <el-progress :percentage="100" :color="['#86F6BB']" />
      <div class="flex justify-center mt-4">
        <el-button color="#86F6BB" @click="dialogVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

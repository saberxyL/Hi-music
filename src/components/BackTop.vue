<template>
  <!-- 使用说明，为指定容器添加类名 content-scroll -->
  <div>
    <!-- 回到顶部按钮 -->
    <el-backtop target=".content-scroll" :right="40" :bottom="100">
      <div class="back-top-btn">
        <el-icon><CaretTop /></el-icon>
      </div>
    </el-backtop>
  </div>
</template>

<style scoped lang="scss">
// 修改回到顶部按钮样式
:deep(.el-backtop) {
  background-color: transparent;
  box-shadow: none;
  --el-backtop-hover-bg-color: transparent;

  .back-top-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px; // 圆角矩形风格
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
    // box-shadow: 0 8px 16px rgba($accent-color, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>

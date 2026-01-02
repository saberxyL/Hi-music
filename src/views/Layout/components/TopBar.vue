<script setup></script>

<template>
  <header class="top-bar">
    <div class="search-bar">
      <el-icon><Search /></el-icon>
      <input type="text" placeholder="搜索音乐、歌手、歌词..." />
    </div>
    <div class="user-profile">
      <el-avatar
        :size="32"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-bar {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;

  .search-bar {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 8px 16px;
    width: 300px;
    gap: 10px;
    color: $text-secondary;

    input {
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      width: 100%;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }
}
</style>

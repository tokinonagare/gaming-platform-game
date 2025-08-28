# 🎮 Gaming Platform Game App

Gaming Platform的游戏库微应用，提供游戏搜索、分类浏览和游戏管理功能。

## 🎯 功能特性

### 🔍 智能搜索
- **全文搜索**: 支持游戏标题、开发商、标签搜索
- **筛选器**: 分类、评分、价格等多维度筛选
- **排序选项**: 按热度、评分、发布时间等排序
- **搜索建议**: 智能搜索提示和纠错

### 📚 游戏库管理
- **分类浏览**: 按游戏类型分类展示
- **详细信息**: 游戏截图、介绍、评分等
- **收藏系统**: 个人游戏收藏管理
- **最近游戏**: 快速访问最近浏览的游戏

## 🏗️ Module Federation 配置

### Remote应用设置
```typescript
name: 'gameApp',
filename: 'remoteEntry.js',
exposes: {
  './App': './src/App.tsx'
},
shared: {
  'react': { singleton: true },
  'react-dom': { singleton: true }
}
```

### 缓存策略
- **API缓存**: 5分钟TTL的智能缓存
- **图片预加载**: 游戏封面图片预加载
- **分页缓存**: 搜索结果分页缓存

## 📦 项目结构

```
src/
├── services/            # 业务逻辑层
│   └── gameApi.ts          # 游戏API服务 + 缓存
├── App.tsx              # 应用主组件
├── index.html           # HTML模板
└── main.tsx             # 应用入口
```

## 🔌 核心服务

### GameAPI服务
```typescript
class GameApiService {
  private api = createApiClient('game')
  private cache = new Map()
  
  // 搜索游戏
  async searchGames(params: SearchParams): Promise<Game[]>
  
  // 获取游戏详情  
  async getGameDetails(gameId: string): Promise<Game>
  
  // 获取用户游戏进度
  async getUserProgress(gameId: string): Promise<UserGameProgress>
  
  // 获取游戏成就
  async getGameAchievements(gameId: string): Promise<Achievement[]>
}
```

## 🚀 开发

### 本地开发
```bash
# 安装依赖
npm install

# 开发模式
npm run dev
# 访问: http://localhost:3002

# Module Federation模式
npm run build && npm run preview
```

---

**🎮 游戏库微应用 - 发现你的下一个最爱游戏！**

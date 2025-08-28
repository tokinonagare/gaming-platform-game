// Game服务专用API客户端
// 演示不同的API调用模式和错误处理

// @ts-ignore - Module Federation运行时类型
import { createApiClient } from 'sharedLib/apiClient'
// @ts-ignore - Module Federation运行时类型  
import type { Game, UserGameProgress, Leaderboard, Achievement } from 'sharedLib/types'

// Game服务API类
class GameApiService {
  private apiClient = createApiClient('game')
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

  // 带缓存的数据获取
  private async getWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
      console.log(`🎮 Using cached data for: ${key}`)
      return cached.data
    }
    
    try {
      const data = await fetcher()
      this.cache.set(key, { data, timestamp: now })
      return data
    } catch (error) {
      // 如果有过期缓存，在错误时返回缓存数据
      if (cached) {
        console.warn(`⚠️ API failed, using stale cache for: ${key}`)
        return cached.data
      }
      throw error
    }
  }

  // 获取游戏详情
  async getGameDetails(gameId: string): Promise<Game> {
    return this.getWithCache(`game-details-${gameId}`, async () => {
      console.log(`🎮 Fetching game details: ${gameId}`)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // 模拟游戏数据
      const gameDetails: Game = {
        id: gameId,
        title: '超级英雄大战',
        description: '与全球玩家一起体验最激动人心的超级英雄战斗！选择你的英雄，掌握独特技能，在多人竞技场中证明自己。',
        thumbnail: `/images/${gameId}-thumbnail.jpg`,
        category: 'action',
        rating: 4.9,
        downloads: 5420000,
        size: '4.2GB',
        version: '2.5.1',
        developer: 'Hero Studios',
        tags: ['动作', '多人', '竞技', '英雄'],
        screenshots: [
          `/images/${gameId}-screen1.jpg`,
          `/images/${gameId}-screen2.jpg`,
          `/images/${gameId}-screen3.jpg`,
          `/images/${gameId}-screen4.jpg`
        ],
        isNew: false,
        isFeatured: true,
        price: 0,
        currency: 'CNY',
        releaseDate: '2023-06-15'
      }
      
      return gameDetails
    })
  }

  // 获取用户游戏进度
  async getUserProgress(gameId: string, userId: string): Promise<UserGameProgress> {
    try {
      console.log(`📊 Fetching progress for user ${userId} in game ${gameId}`)
      
      // 实际API调用示例
      // return await this.apiClient.get<UserGameProgress>(`/games/${gameId}/progress/${userId}`)
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 250))
      
      return {
        gameId,
        progress: Math.floor(Math.random() * 100),
        level: Math.floor(Math.random() * 50) + 1,
        score: Math.floor(Math.random() * 100000),
        achievements: ['first_kill', 'combo_master', 'survivor'],
        playTime: Math.floor(Math.random() * 10000) + 1000,
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    } catch (error) {
      console.error(`❌ Failed to fetch user progress:`, error)
      throw error
    }
  }

  // 更新用户游戏进度
  async updateUserProgress(gameId: string, userId: string, progress: Partial<UserGameProgress>): Promise<UserGameProgress> {
    try {
      console.log(`💾 Updating progress for user ${userId} in game ${gameId}`, progress)
      
      // 实际API调用
      // return await this.apiClient.put<UserGameProgress>(`/games/${gameId}/progress/${userId}`, progress)
      
      // 模拟更新延迟
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // 清除相关缓存
      this.cache.delete(`user-progress-${gameId}-${userId}`)
      
      // 返回更新后的进度
      const currentProgress = await this.getUserProgress(gameId, userId)
      return { ...currentProgress, ...progress }
    } catch (error) {
      console.error(`❌ Failed to update user progress:`, error)
      throw error
    }
  }

  // 获取游戏排行榜
  async getLeaderboard(gameId: string, period: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly'): Promise<Leaderboard> {
    return this.getWithCache(`leaderboard-${gameId}-${period}`, async () => {
      console.log(`🏆 Fetching leaderboard for game ${gameId} (${period})`)
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 350))
      
      // 生成模拟排行榜数据
      const mockEntries = Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        userId: `user-${String(i + 1).padStart(3, '0')}`,
        username: `玩家${i + 1}`,
        avatar: `/avatars/avatar-${(i % 12) + 1}.png`,
        score: Math.floor(Math.random() * 100000) + 50000 - (i * 5000),
        level: Math.floor(Math.random() * 30) + 20 - i
      })).sort((a, b) => b.score - a.score)

      return {
        gameId,
        entries: mockEntries,
        period,
        updatedAt: new Date().toISOString()
      }
    })
  }

  // 获取游戏成就列表
  async getGameAchievements(gameId: string): Promise<Achievement[]> {
    return this.getWithCache(`achievements-${gameId}`, async () => {
      console.log(`🏅 Fetching achievements for game ${gameId}`)
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return [
        {
          id: 'first_blood',
          title: '首杀',
          description: '获得你的第一个击杀',
          icon: '/icons/achievement-first-kill.png',
          rarity: 'common',
          points: 10
        },
        {
          id: 'combo_master',
          title: '连击大师',
          description: '完成50连击',
          icon: '/icons/achievement-combo.png',
          rarity: 'rare',
          points: 50
        },
        {
          id: 'survivor',
          title: '生存专家',
          description: '连续存活10分钟',
          icon: '/icons/achievement-survivor.png',
          rarity: 'epic',
          points: 100
        },
        {
          id: 'legendary_hero',
          title: '传奇英雄',
          description: '达到最高等级',
          icon: '/icons/achievement-legendary.png',
          rarity: 'legendary',
          points: 500
        }
      ]
    })
  }

  // 启动游戏会话
  async startGameSession(gameId: string, userId: string): Promise<{ sessionId: string; serverUrl: string }> {
    try {
      console.log(`🎯 Starting game session for user ${userId} in game ${gameId}`)
      
      // 实际项目中这里会调用游戏服务器API
      // const response = await this.apiClient.post('/sessions/start', { gameId, userId })
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return {
        sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        serverUrl: `wss://game-server-${Math.floor(Math.random() * 5) + 1}.gaming-platform.com`
      }
    } catch (error) {
      console.error('❌ Failed to start game session:', error)
      throw error
    }
  }

  // 批量操作示例 - 获取多个游戏的基本信息
  async getMultipleGamesInfo(gameIds: string[]): Promise<Game[]> {
    try {
      console.log(`📦 Fetching info for ${gameIds.length} games`)
      
      // 并发请求多个游戏的信息
      const promises = gameIds.map(id => this.getGameDetails(id))
      const results = await Promise.allSettled(promises)
      
      const games: Game[] = []
      const errors: string[] = []
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          games.push(result.value)
        } else {
          errors.push(`Game ${gameIds[index]}: ${result.reason.message}`)
        }
      })
      
      if (errors.length > 0) {
        console.warn('⚠️ Some games failed to load:', errors)
      }
      
      return games
    } catch (error) {
      console.error('❌ Batch games fetch failed:', error)
      return []
    }
  }

  // 清除缓存
  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // 获取缓存状态
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: JSON.stringify(Array.from(this.cache.values())).length
    }
  }

  // 服务健康检查和信息
  async checkHealth(): Promise<boolean> {
    try {
      return await this.apiClient.healthCheck()
    } catch (error) {
      console.error('❌ Game service health check failed:', error)
      return false
    }
  }

  getServiceInfo() {
    return {
      serviceName: 'Game Service',
      version: '1.0.0',
      features: [
        'Game Details & Metadata',
        'User Progress Tracking',
        'Leaderboards & Rankings',
        'Achievement System',
        'Game Session Management',
        'Batch Operations',
        'Smart Caching'
      ],
      cache: this.getCacheStats()
    }
  }
}

// 创建并导出服务实例
export const gameApi = new GameApiService()

// React Hook封装
export const useGameApi = () => {
  return {
    getGameDetails: (gameId: string) => gameApi.getGameDetails(gameId),
    getUserProgress: (gameId: string, userId: string) => gameApi.getUserProgress(gameId, userId),
    updateProgress: (gameId: string, userId: string, progress: Partial<UserGameProgress>) => 
      gameApi.updateUserProgress(gameId, userId, progress),
    getLeaderboard: (gameId: string, period?: 'daily' | 'weekly' | 'monthly' | 'allTime') => 
      gameApi.getLeaderboard(gameId, period),
    getAchievements: (gameId: string) => gameApi.getGameAchievements(gameId),
    startSession: (gameId: string, userId: string) => gameApi.startGameSession(gameId, userId),
    clearCache: (pattern?: string) => gameApi.clearCache(pattern),
    serviceInfo: gameApi.getServiceInfo()
  }
}
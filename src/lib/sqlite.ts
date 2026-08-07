import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  // 数据文件路径：优先 /data 目录（容器环境），否则项目 data 目录
  let dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

  // 确保目录存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'consultations.db');
  dbInstance = new Database(dbPath);

  // 启用 WAL 模式，提升并发性能
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('busy_timeout = 30000');
  dbInstance.pragma('foreign_keys = ON');

  // 初始化表
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      domain TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
    CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);

    -- 访问记录表
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      ip TEXT,
      region TEXT,
      path TEXT,
      referer TEXT,
      user_agent TEXT,
      duration INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
    CREATE INDEX IF NOT EXISTS idx_visits_session_id ON visits(session_id);
    CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);
    CREATE INDEX IF NOT EXISTS idx_visits_region ON visits(region);

    -- 页面每日统计表（预聚合，减少查询压力）
    CREATE TABLE IF NOT EXISTS page_stats (
      date TEXT NOT NULL,
      path TEXT NOT NULL,
      page_views INTEGER NOT NULL DEFAULT 0,
      unique_visitors INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (date, path)
    );
  `);

  // 兼容处理：检查并添加 region 列（老版本数据库可能没有该列）
  try {
    const cols = dbInstance
      .prepare("PRAGMA table_info(visits)")
      .all() as Array<{ name: string }>;
    if (!cols.some((c) => c.name === 'region')) {
      dbInstance.exec("ALTER TABLE visits ADD COLUMN region TEXT;");
    }
  } catch {
    // 表还不存在，跳过迁移
  }

  return dbInstance;
}

// 生成 UUID v4
export function generateId(): string {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

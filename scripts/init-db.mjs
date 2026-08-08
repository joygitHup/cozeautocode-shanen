#!/usr/bin/env node
/**
 * 数据库初始化脚本
 * 用途：在服务器上首次部署时手动初始化 SQLite 数据库表结构
 * 使用：node scripts/init-db.mjs
 *
 * 说明：
 *   - 数据库文件默认存放在 ./data/consultations.db
 *   - 可通过环境变量 DATA_DIR 指定数据目录
 *   - 重复执行安全（使用 IF NOT EXISTS）
 *   - 包含自动迁移逻辑，表结构升级时自动添加新字段
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// 数据目录：优先环境变量，否则项目 data 目录
const dataDir = process.env.DATA_DIR || path.join(projectRoot, 'data');
const dbPath = path.join(dataDir, 'consultations.db');

console.log('========================================');
console.log('  杉恩科技官网 - 数据库初始化');
console.log('========================================');
console.log(`数据目录: ${dataDir}`);
console.log(`数据库文件: ${dbPath}`);
console.log('');

// 确保目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`[创建目录] ${dataDir}`);
}

const db = new Database(dbPath);

// 启用 WAL 模式
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 30000');
db.pragma('foreign_keys = ON');

console.log('[状态] 数据库连接成功');
console.log('');

// ========================================
// 表 1: 咨询记录表
// ========================================
console.log('[1/3] 初始化咨询表 (consultations)...');

db.exec(`
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
`);

const consultCount = db.prepare('SELECT COUNT(*) as cnt FROM consultations').get().cnt;
console.log(`      完成！当前记录数: ${consultCount}`);

// ========================================
// 表 2: 访问记录表
// ========================================
console.log('[2/3] 初始化访问记录表 (visits)...');

db.exec(`
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
`);

// 迁移：老版本数据库可能缺少 region 列
const visitCols = db.prepare('PRAGMA table_info(visits)').all();
const hasRegion = visitCols.some((col) => col.name === 'region');
if (!hasRegion) {
  console.log('      → 检测到旧版结构，正在添加 region 列...');
  db.exec('ALTER TABLE visits ADD COLUMN region TEXT;');
  console.log('      → region 列添加成功');
}

const visitCount = db.prepare('SELECT COUNT(*) as cnt FROM visits').get().cnt;
console.log(`      完成！当前记录数: ${visitCount}`);

// ========================================
// 表 3: 页面每日统计表
// ========================================
console.log('[3/3] 初始化页面统计表 (page_stats)...');

db.exec(`
  CREATE TABLE IF NOT EXISTS page_stats (
    date TEXT NOT NULL,
    path TEXT NOT NULL,
    page_views INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (date, path)
  );
`);

const statsCount = db.prepare('SELECT COUNT(*) as cnt FROM page_stats').get().cnt;
console.log(`      完成！当前记录数: ${statsCount}`);

console.log('');
console.log('========================================');
console.log('  数据库初始化完成！');
console.log('========================================');
console.log('');
console.log('数据库文件位置:');
console.log(`  ${dbPath}`);
console.log('');
console.log('常用命令:');
console.log('  进入 sqlite 命令行: sqlite3 ' + dbPath);
console.log('  查看所有表: .tables');
console.log('  查看表结构: .schema consultations');
console.log('  查询咨询记录: SELECT * FROM consultations ORDER BY created_at DESC LIMIT 10;');
console.log('');
console.log('数据备份:');
console.log('  cp ' + dbPath + ' backup_$(date +%Y%m%d).db');
console.log('');

db.close();

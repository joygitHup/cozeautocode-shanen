#!/usr/bin/env node
/**
 * 测试数据生成脚本
 * 用法：node scripts/seed-data.mjs [数量]
 * 默认生成 100 条访问记录 + 20 条咨询记录
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '..', 'data', 'consultations.db');

const db = new Database(dbPath);

// 确保表存在
db.exec(`
  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    domain TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    ip TEXT,
    region TEXT,
    path TEXT NOT NULL,
    referer TEXT,
    duration INTEGER DEFAULT 0,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS page_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    path TEXT NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    UNIQUE(date, path)
  );
`);

// 模拟数据
const names = ['张三', '李四', '王五', '赵六', '陈七', '刘八', '周九', '吴十', '郑一', '孙二'];
const companies = ['深圳市创新科技有限公司', '广州环保技术有限公司', '上海智慧水务有限公司', '北京生态科技有限公司', '成都林业发展有限公司', '杭州智能装备有限公司', '武汉水利工程有限公司', '南京环境监测有限公司', '西安国土资源公司', '重庆生态农业公司'];
const domains = ['reservoir', 'forest', 'territory', 'environment'];
const messages = [
  '想了解水库监测系统的具体方案和报价',
  '请问森林防火监测系统的覆盖范围有多大？',
  '我们单位想采购一套国土监测设备',
  '环境监测系统是否支持第三方平台对接？',
  '能否安排一次产品演示？',
  '想咨询一下项目实施周期',
  '请问设备的使用寿命是多久？',
  '我们有一个大型水库需要监测，约多少预算？',
  '系统支持私有化部署吗？',
  '数据安全如何保障？',
];

const pages = ['/', '/#domains', '/#about', '/#contact', '/#tech', '/admin'];
const referers = [
  '',
  'https://www.baidu.com',
  'https://www.google.com',
  'https://www.bing.com',
  'https://www.sogou.com',
  'https://www.360.cn',
  'https://mp.weixin.qq.com',
  'https://www.toutiao.com',
  'https://www.zhihu.com',
  'https://link.zhihu.com',
];
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
];
const regions = ['广东省深圳市', '广东省广州市', '北京市', '上海市', '浙江省杭州市', '四川省成都市', '湖北省武汉市', '江苏省南京市', '陕西省西安市', '重庆市', '山东省青岛市', '福建省厦门市'];
const ipPrefixes = ['112.97', '113.104', '116.25', '58.251', '223.104', '180.169', '125.88', '61.135', '218.75', '36.149'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  const prefixes = ['138', '139', '158', '159', '186', '188', '132', '133', '150', '151'];
  return randomItem(prefixes) + Math.floor(10000000 + Math.random() * 90000000).toString();
}

function randomIp() {
  return randomItem(ipPrefixes) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
}

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 24));
  d.setMinutes(Math.floor(Math.random() * 60));
  d.setSeconds(Math.floor(Math.random() * 60));
  return d.toISOString().replace('T', ' ').substring(0, 19);
}

function genUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const args = process.argv.slice(2);
const visitCount = parseInt(args[0]) || 100;
const consultationCount = parseInt(args[1]) || 20;

console.log('=== 开始生成测试数据 ===');
console.log(`数据库路径: ${dbPath}`);
console.log(`访问记录: ${visitCount} 条`);
console.log(`咨询记录: ${consultationCount} 条`);
console.log('');

// 生成咨询记录
const insertConsultation = db.prepare(`
  INSERT INTO consultations (name, phone, company, domain, message, status, created_at)
  VALUES (@name, @phone, @company, @domain, @message, @status, @created_at)
`);

const statuses = ['pending', 'processing', 'completed', 'closed'];

const insertManyConsultations = db.transaction((count) => {
  for (let i = 0; i < count; i++) {
    insertConsultation.run({
      name: randomItem(names),
      phone: randomPhone(),
      company: randomItem(companies),
      domain: randomItem(domains),
      message: randomItem(messages),
      status: randomItem(statuses),
      created_at: randomDate(30),
    });
  }
});

insertManyConsultations(consultationCount);
console.log(`✓ 已生成 ${consultationCount} 条咨询记录`);

// 生成访问记录
const insertVisit = db.prepare(`
  INSERT INTO visits (session_id, ip, region, path, referer, duration, user_agent, created_at)
  VALUES (@session_id, @ip, @region, @path, @referer, @duration, @user_agent, @created_at)
`);

const insertManyVisits = db.transaction((count) => {
  for (let i = 0; i < count; i++) {
    const sessionId = genUUID();
    const ip = randomIp();
    const region = randomItem(regions);
    const ua = randomItem(userAgents);
    const pageCount = Math.floor(Math.random() * 5) + 1;
    const startDate = randomDate(30);

    // 同一个 session 可能访问多个页面
    for (let p = 0; p < pageCount; p++) {
      insertVisit.run({
        session_id: sessionId,
        ip,
        region,
        path: randomItem(pages),
        referer: p === 0 ? randomItem(referers) : '',
        duration: Math.floor(Math.random() * 300) + 10,
        user_agent: ua,
        created_at: startDate,
      });
    }
  }
});

insertManyVisits(visitCount);
console.log(`✓ 已生成约 ${visitCount} 个会话的访问记录`);

// 重新统计 page_stats
db.exec('DELETE FROM page_stats');
const insertPageStat = db.prepare(`
  INSERT OR REPLACE INTO page_stats (date, path, page_views, unique_visitors)
  VALUES (@date, @path, @page_views, @unique_visitors)
`);

const stats = db.prepare(`
  SELECT date(created_at) as date, path,
         COUNT(*) as page_views,
         COUNT(DISTINCT session_id) as unique_visitors
  FROM visits
  GROUP BY date(created_at), path
`).all();

const insertStats = db.transaction((rows) => {
  for (const row of rows) {
    insertPageStat.run(row);
  }
});
insertStats(stats);
console.log(`✓ 已更新页面统计表 (${stats.length} 条)`);

// 统计结果
const visitTotal = db.prepare('SELECT COUNT(*) as c FROM visits').get().c;
const consultTotal = db.prepare('SELECT COUNT(*) as c FROM consultations').get().c;

console.log('');
console.log('=== 数据生成完成 ===');
console.log(`访问记录总数: ${visitTotal}`);
console.log(`咨询记录总数: ${consultTotal}`);

db.close();

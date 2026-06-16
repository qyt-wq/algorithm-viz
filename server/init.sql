-- 算法过程可视化系统 - 数据库初始化脚本
-- 使用方法: mysql -u root -p < server/init.sql

CREATE DATABASE IF NOT EXISTS algorithm_viz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE algorithm_viz;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

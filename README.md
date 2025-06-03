# DocuTwin 文档对照工具

[English](#english) | [中文](#chinese)

## English

### Introduction
DocuTwin is a powerful document comparison and translation assistance tool designed for translators, proofreaders, and content reviewers. It provides an intuitive side-by-side viewing experience for original and translated documents, supporting multiple document formats including PDF, DOCX, and HTML.

### Key Features
- **Comprehensive Format Support**
  - PDF files with high-fidelity rendering
  - DOCX files with precise formatting preservation
  - HTML files with responsive layout
  - Support for text extraction and comparison

- **Advanced Viewing Capabilities**
  - Intelligent side-by-side comparison
  - Smart synchronized scrolling
  - Flexible zoom controls
  - Dynamic page navigation
  - Text search and highlighting

- **Modern User Interface**
  - Clean and intuitive design
  - Dark/Light mode support
  - Drag-and-drop file handling
  - Customizable layout options
  - Responsive design for all screen sizes

- **Enhanced File Management**
  - Quick file upload/download
  - Recent files history
  - File format conversion
  - Auto-save feature
  - Session persistence

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/docutwin.git
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure environment
```bash
# Copy example environment files
cp .env.example .env
cd backend && cp .env.example .env
cd frontend && cp .env.example .env
```

4. Start the application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### System Requirements
- Node.js 18.0 or higher
- Modern web browser (Chrome, Firefox, Edge latest versions)
- 4GB RAM minimum
- 2GB free disk space

### Technical Stack
- **Frontend**
  - React.js with TypeScript
  - PDF.js for PDF rendering
  - docx-preview for DOCX handling
  - Material-UI components
  - Redux for state management

- **Backend**
  - Node.js with Express
  - MongoDB for data storage
  - Redis for caching
  - JWT authentication
  - WebSocket for real-time features

---

## Chinese

### 简介
DocuTwin（文档对照工具）是一款功能强大的文档对比和翻译辅助工具，专为译者、校对者和内容审核人员设计。它提供直观的文档并排显示功能，支持包括 PDF、DOCX 和 HTML 在内的多种文档格式。

### 核心功能
- **全面的格式支持**
  - PDF 文件高保真渲染
  - DOCX 文件精确格式保持
  - HTML 文件响应式布局
  - 文本提取与对比功能

- **高级查看功能**
  - 智能并排对比
  - 智能同步滚动
  - 灵活的缩放控制
  - 动态页面导航
  - 文本搜索和高亮

- **现代化用户界面**
  - 简洁直观的设计
  - 深色/浅色主题支持
  - 拖放式文件处理
  - 可自定义布局选项
  - 全尺寸屏幕适配

- **增强的文件管理**
  - 快速文件上传/下载
  - 最近文件历史
  - 文件格式转换
  - 自动保存功能
  - 会话持久化

### 安装步骤
1. 克隆仓库
```bash
git clone https://github.com/yourusername/docutwin.git
```

2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd frontend
npm install
```

3. 配置环境
```bash
# 复制环境配置文件
cp .env.example .env
cd backend && cp .env.example .env
cd frontend && cp .env.example .env
```

4. 启动应用
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

### 系统要求
- Node.js 18.0 或更高版本
- 现代浏览器（Chrome、Firefox、Edge 最新版本）
- 最小 4GB 内存
- 2GB 可用磁盘空间

### 技术栈
- **前端**
  - React.js + TypeScript
  - PDF.js 文档渲染
  - docx-preview 文档处理
  - Material-UI 组件库
  - Redux 状态管理

- **后端**
  - Node.js + Express
  - MongoDB 数据存储
  - Redis 缓存服务
  - JWT 身份认证
  - WebSocket 实时功能

### 更新日志

#### v1.2.0 (2024-03)
- 新增深色模式支持
- 优化文档渲染性能
- 添加文本搜索功能
- 改进用户界面响应性
- 修复已知问题

#### v1.1.0 (2024-02)
- 优化用户界面设计
- 改进文档渲染性能
- 添加页码显示功能
- 优化缩放控制

#### v1.0.0 (2024-01)
- 首次发布
- 基础文档查看功能
- PDF、DOCX 和 HTML 格式支持
- 同步滚动功能
- 文件上传下载

---

### License
MIT License

Copyright (c) 2024 DocuTwin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

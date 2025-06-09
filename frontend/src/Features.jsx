import React from 'react';
import './App.css';

export default function Features() {
  return (
    <div className="features-page">
      <h2>DocuTwin 产品功能介绍</h2>
      <ul className="features-list">
        <li>支持PDF、Word、HTML等多种文档格式的上传与预览</li>
        <li>双栏文档对比，支持同步滚动与缩放</li>
        <li>智能文档差异高亮与比对</li>
        <li>支持深色/浅色主题切换</li>
        <li>便捷的文档上传与拖拽操作</li>
        <li>高效的文档管理与协作体验</li>
      </ul>
      <p style={{marginTop: '2em', color: '#888'}}>返回主页请点击左上角logo</p>
    </div>
  );
} 
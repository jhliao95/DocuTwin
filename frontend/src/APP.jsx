// ✅ 修复 PDF 展示、清除冗余上传区域、格式修复
// frontend/src/App.jsx
import { useRef, useState, useCallback, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import * as docxPreview from 'docx-preview';
import * as pdfjsLib from 'pdfjs-dist';

// 配置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc || `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [leftDocUrl, setLeftDocUrl] = useState('');
  const [leftDocName, setLeftDocName] = useState('');
  const [rightDocUrl, setRightDocUrl] = useState('');
  const [rightDocName, setRightDocName] = useState('');
  const [leftZoom, setLeftZoom] = useState(1);
  const [rightZoom, setRightZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [leftType, setLeftType] = useState('');
  const [rightType, setRightType] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('themeButtonPosition');
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });

  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const themeButtonRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // 保存位置到 localStorage
  useEffect(() => {
    localStorage.setItem('themeButtonPosition', JSON.stringify(position));
  }, [position]);

  // 处理拖动开始
  const handleMouseDown = (e) => {
    if (e.target.closest('.theme-toggle')) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  // 处理拖动
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // 确保按钮不会拖出视窗
      const maxX = window.innerWidth - 48; // 按钮宽度
      const maxY = window.innerHeight - 48; // 按钮高度
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加和移除事件监听器
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isDragging]);

  // 主题切换
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // 文件类型验证
  const validateFileType = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/html'];
    if (!validTypes.includes(file.type)) {
      throw new Error('不支持的文件类型。请上传 PDF、DOCX 或 HTML 文件。');
    }
  };

  const handleUpload = async (file, setDocUrl, setDocName, setDocType) => {
    try {
      validateFileType(file);
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('http://localhost:3001/upload', formData);
      const url = `http://localhost:3001${res.data.url}`;
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'pdf') {
        const pdfBlob = await axios.get(url, { responseType: 'blob' }).then(r => r.data);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setDocUrl(pdfUrl);
        setDocType('pdf');
      } else if (ext === 'html') {
        setDocUrl(url);
        setDocType('html');
      } else if (ext === 'docx') {
        const blob = await axios.get(url, { responseType: 'blob' }).then(r => r.data);
        const container = document.createElement('div');
        await docxPreview.renderAsync(blob, container);
        if (!container.innerHTML.trim()) {
          throw new Error('文档渲染失败：内容为空');
        }
        setDocUrl(container.innerHTML);
        setDocType('docx');
      }

      setDocName(res.data.filename);
    } catch (err) {
      alert(err.message || '上传失败');
    } finally {
      setLoading(false);
    }
  };

  const onDropLeft = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0], setLeftDocUrl, setLeftDocName, setLeftType);
    }
  }, []);

  const onDropRight = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0], setRightDocUrl, setRightDocName, setRightType);
    }
  }, []);

  const { getRootProps: getLeftRootProps, getInputProps: getLeftInputProps } = useDropzone({
    onDrop: onDropLeft,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/html': ['.html']
    }
  });

  const { getRootProps: getRightRootProps, getInputProps: getRightInputProps } = useDropzone({
    onDrop: onDropRight,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/html': ['.html']
    }
  });

  // 优化的同步滚动处理
  const syncScroll = useCallback((e) => {
    const source = e.target;
    const target = source === leftPane.current ? rightPane.current : leftPane.current;
    
    if (source && target) {
      const sourceScrollMax = source.scrollHeight - source.clientHeight;
      const targetScrollMax = target.scrollHeight - target.clientHeight;
      
      if (sourceScrollMax <= 0 || targetScrollMax <= 0) return;
      
      const percentage = source.scrollTop / sourceScrollMax;
      target.scrollTop = percentage * targetScrollMax;
    }
  }, []);

  // 缩放控制
  const zoomIn = useCallback((setZoom) => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, []);

  const zoomOut = useCallback((setZoom) => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const resetZoom = useCallback((setZoom) => {
    setZoom(1);
  }, []);

  // 重置功能
  const handleReset = useCallback(() => {
    setLeftDocUrl('');
    setRightDocUrl('');
    setLeftDocName('');
    setRightDocName('');
    setLeftType('');
    setRightType('');
    setLeftZoom(1);
    setRightZoom(1);
  }, []);

  // 下载功能
  const downloadFile = useCallback((filename) => {
    if (!filename) return;
    const url = `http://localhost:3001/download/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // 渲染文档内容
  const renderContent = useCallback((type, url, zoom) => {
    if (!type || !url) {
      return (
        <div className="empty-content">
          <div className="upload-hint">
            <span className="upload-icon">📄</span>
            <p>点击或拖拽上传文件</p>
            <div className="supported-formats">
              支持的格式：PDF、DOCX、HTML
            </div>
          </div>
        </div>
      );
    }

    if (type === 'pdf') {
      return (
        <div className="pdf-viewer" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          <iframe
            src={url}
            title="PDF viewer"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      );
    }

    if (type === 'docx') {
      return (
        <div 
          className="docx-content"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          dangerouslySetInnerHTML={{ __html: url }}
        />
      );
    }

    if (type === 'html') {
      return (
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          <iframe
            src={url}
            title="HTML viewer"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      );
    }

    return null;
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="brand">
          <img src="/logo.svg" alt="DocuTwin Logo" className="app-logo" />
          <h1>DocuTwin</h1>
        </div>
        <button 
          ref={themeButtonRef}
          className={`theme-toggle ${isDarkMode ? 'dark' : 'light'} ${isDragging ? 'dragging' : ''}`}
          onClick={(e) => {
            if (!isDragging) {
              toggleTheme();
            }
          }}
          title={isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div className="theme-toggle-icon">
            <div className="sun-moon">
              {isDarkMode && (
                <>
                  <div className="star" style={{ top: '10%', left: '60%' }} />
                  <div className="star" style={{ top: '30%', left: '80%' }} />
                  <div className="star" style={{ top: '50%', left: '40%' }} />
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="main-content">
        {/* 左侧面板 - 原文 */}
        <div className="panel">
          <div className="panel-header">
            <h2>原文档</h2>
            <div className="zoom-controls">
              <button onClick={() => zoomIn(setLeftZoom)} className="zoom-button">
                <span className="zoom-icon">🔍</span>
                <span className="zoom-symbol">+</span>
              </button>
              <button onClick={() => zoomOut(setLeftZoom)} className="zoom-button">
                <span className="zoom-icon">🔍</span>
                <span className="zoom-symbol">-</span>
              </button>
              <button onClick={() => resetZoom(setLeftZoom)} className="zoom-button">
                <span>↺</span>
              </button>
              {leftDocName && (
                <>
                  <button onClick={() => downloadFile(leftDocName)} className="download-button">
                    <span>⭳</span>
                  </button>
                  <button 
                    className="clear-button"
                    onClick={() => {
                      setLeftDocUrl('');
                      setLeftDocName('');
                      setLeftType('');
                      setLeftZoom(1);
                    }}
                  >
                    <span>🗑️</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="panel-content">
            <div {...getLeftRootProps()} className="dropzone">
              <input {...getLeftInputProps()} />
              <div 
                ref={leftPane}
                className="document-viewer"
                onScroll={syncScroll}
              >
                {renderContent(leftType, leftDocUrl, leftZoom)}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧面板 - 译文 */}
        <div className="panel">
          <div className="panel-header">
            <h2>译文档</h2>
            <div className="zoom-controls">
              <button onClick={() => zoomIn(setRightZoom)} className="zoom-button">
                <span className="zoom-icon">🔍</span>
                <span className="zoom-symbol">+</span>
              </button>
              <button onClick={() => zoomOut(setRightZoom)} className="zoom-button">
                <span className="zoom-icon">🔍</span>
                <span className="zoom-symbol">-</span>
              </button>
              <button onClick={() => resetZoom(setRightZoom)} className="zoom-button">
                <span>↺</span>
              </button>
              {rightDocName && (
                <>
                  <button onClick={() => downloadFile(rightDocName)} className="download-button">
                    <span>⭳</span>
                  </button>
                  <button 
                    className="clear-button"
                    onClick={() => {
                      setRightDocUrl('');
                      setRightDocName('');
                      setRightType('');
                      setRightZoom(1);
                    }}
                  >
                    <span>🗑️</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="panel-content">
            <div {...getRightRootProps()} className="dropzone">
              <input {...getRightInputProps()} />
              <div 
                ref={rightPane}
                className="document-viewer"
                onScroll={syncScroll}
              >
                {renderContent(rightType, rightDocUrl, rightZoom)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading">
          加载中...
        </div>
      )}
    </div>
  );
}

export default App;

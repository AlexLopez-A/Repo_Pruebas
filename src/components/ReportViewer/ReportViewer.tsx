import React, { useState, useEffect, useRef } from 'react';
import './ReportViewer.css';

interface ReportViewerProps {
  reportSvg: string | null;
  reportName: string;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportSvg, reportName, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(1);
  }, [reportSvg]);

  if (!reportSvg) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.3));
  const handleZoomReset = () => setZoom(1);

  const handleDownload = () => {
    const blob = new Blob([reportSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-viewer-overlay" onClick={onClose}>
      <div className="report-viewer-content" onClick={e => e.stopPropagation()}>
        <div className="report-header">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Reporte: {reportName}
          </h3>
          <div className="report-actions">
            <div className="zoom-controls">
              <button onClick={handleZoomOut} title="Reducir">−</button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={handleZoomIn} title="Ampliar">+</button>
              <button onClick={handleZoomReset} title="Restablecer">⟲</button>
            </div>
            <button className="action-btn" onClick={handleDownload} title="Descargar SVG">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar
            </button>
            <button className="modal-close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="report-body" ref={containerRef}>
          <div
            className="report-svg-container"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            dangerouslySetInnerHTML={{ __html: reportSvg }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;

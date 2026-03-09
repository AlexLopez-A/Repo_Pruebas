import { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import CommandInput from './components/CommandInput/CommandInput';
import ConsoleOutput from './components/ConsoleOutput/ConsoleOutput';
import MountedModal from './components/MountedModal/MountedModal';
import ReportViewer from './components/ReportViewer/ReportViewer';
import { useConsole } from './hooks/useConsole';
import './App.css';

function App() {
  const { entries, isExecuting, executeInput, addEntry, clearConsole } = useConsole();
  const [showMounted, setShowMounted] = useState(false);
  const [reportSvg, setReportSvg] = useState<string | null>(null);
  const [reportName, setReportName] = useState('');

  const handleExecute = useCallback(async (input: string) => {
    const results = await executeInput(input);
    // Check if any result has a report
    if (results) {
      for (const result of results) {
        if (result.reportDot) {
          try {
            const { instance } = await import('@viz-js/viz');
            const viz = await instance();
            const svg = viz.renderString(result.reportDot, { format: 'svg' });
            setReportSvg(svg);
            setReportName(result.reportPath || 'report');
          } catch (err) {
            addEntry('error', `Error generando reporte visual: ${err}`);
          }
        }
      }
    }
  }, [executeInput, addEntry]);

  const handleLoadScript = useCallback((content: string) => {
    addEntry('info', `Script cargado correctamente (${content.split('\n').length} líneas)`);
  }, [addEntry]);

  return (
    <div className="app">
      <Header onShowMounted={() => setShowMounted(true)} />

      <main className="main-content">
        <div className="workspace">
          <div className="panel left-panel">
            <CommandInput
              onExecute={handleExecute}
              onLoadScript={handleLoadScript}
              isExecuting={isExecuting}
            />
          </div>
          <div className="panel-divider" />
          <div className="panel right-panel">
            <ConsoleOutput
              entries={entries}
              onClear={clearConsole}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span>EXT2 File System Simulator — Manejo e Implementación de Archivos</span>
        <span className="footer-status">
          <span className={`status-dot ${isExecuting ? 'active' : 'idle'}`} />
          {isExecuting ? 'Ejecutando...' : 'Listo'}
        </span>
      </footer>

      <MountedModal
        isOpen={showMounted}
        onClose={() => setShowMounted(false)}
      />

      <ReportViewer
        reportSvg={reportSvg}
        reportName={reportName}
        onClose={() => setReportSvg(null)}
      />
    </div>
  );
}

export default App;

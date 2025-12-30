import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';

export const HomeScreen = () => {
  const { passages, isComplete, exportPassages, importPassages } = usePassages();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleImport = () => {
    setMenuVisible(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importPassages(file);
        window.alert('Passages imported successfully!');
      } catch (error) {
        window.alert(`Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    setMenuVisible(false);
    if (passages.length === 0) {
      window.alert('No passages to export');
      return;
    }
    exportPassages();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
      position: 'relative' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
    },
    title: {
      fontFamily: 'serif',
      fontSize: '24px',
      fontWeight: 600,
      color: colors.text,
      margin: 0,
    },
    headerButtons: {
      display: 'flex',
      gap: '8px',
    },
    headerButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '8px',
      color: colors.text,
    },
    list: {
      padding: '16px',
      paddingBottom: '100px',
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '32px',
    },
    emptyText: {
      fontFamily: 'serif',
      fontSize: '18px',
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 1.6,
    },
    row: {
      backgroundColor: colors.surface,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      border: `1px solid ${colors.border}`,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    rowComplete: {
      border: `2px solid ${colors.correct}`,
    },
    rowTitle: {
      fontFamily: 'serif',
      fontSize: '20px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '4px',
    },
    kelvin: {
      fontFamily: 'serif',
      fontSize: '16px',
      color: colors.textSecondary,
    },
    kelvinComplete: {
      color: colors.correct,
      fontWeight: 600,
    },
    addButton: {
      position: 'fixed' as const,
      bottom: '32px',
      left: '32px',
      right: '32px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: colors.primary,
      borderRadius: '12px',
      padding: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    addButtonText: {
      fontFamily: 'serif',
      fontSize: '18px',
      fontWeight: 600,
      color: colors.surface,
    },
    menu: {
      position: 'absolute' as const,
      top: '50px',
      right: '16px',
      backgroundColor: colors.surface,
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 100,
      minWidth: '180px',
    },
    menuItem: {
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      cursor: 'pointer',
      backgroundColor: colors.surface,
    },
    menuItemLast: {
      borderBottom: 'none',
    },
    menuItemText: {
      fontFamily: 'serif',
      fontSize: '16px',
      color: colors.text,
      margin: 0,
    },
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    },
  };

  return (
    <div style={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={styles.header}>
        <h1 style={styles.title}>Cloze</h1>
        <div style={styles.headerButtons}>
          <button onClick={toggleTheme} style={styles.headerButton}>
            {isDark ? '☀' : '☾'}
          </button>
          <button onClick={() => setMenuVisible(!menuVisible)} style={styles.headerButton}>
            ☰
          </button>
        </div>
      </div>

      {menuVisible && (
        <>
          <div style={styles.overlay} onClick={() => setMenuVisible(false)} />
          <div style={styles.menu}>
            <div style={styles.menuItem} onClick={handleExport}>
              <p style={styles.menuItemText}>Export Passages</p>
            </div>
            <div style={{ ...styles.menuItem, ...styles.menuItemLast }} onClick={handleImport}>
              <p style={styles.menuItemText}>Import Passages</p>
            </div>
          </div>
        </>
      )}

      {passages.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>
            No passages yet.<br />Add one to begin memorizing.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {passages.map((item) => {
            const complete = isComplete(item);
            return (
              <div
                key={item.id}
                style={{ ...styles.row, ...(complete ? styles.rowComplete : {}) }}
                onClick={() => navigate(`/quiz/${item.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={styles.rowTitle}>{item.title}</div>
                <div style={{ ...styles.kelvin, ...(complete ? styles.kelvinComplete : {}) }}>
                  {complete ? 'Memorized' : `${item.kelvin}K`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        style={styles.addButton}
        onClick={() => navigate('/edit')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div style={styles.addButtonText}>Add Passage</div>
      </button>
    </div>
  );
};

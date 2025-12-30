import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';

export const EditScreen = () => {
  const { passageId } = useParams<{ passageId?: string }>();
  const { getPassage, addPassage, updatePassage } = usePassages();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const existingPassage = passageId ? getPassage(passageId) : undefined;
  const isEditing = !!existingPassage;

  const [title, setTitle] = useState(existingPassage?.title ?? '');
  const [text, setText] = useState(existingPassage?.text ?? '');
  const [caseSensitive, setCaseSensitive] = useState(existingPassage?.caseSensitive ?? false);
  const [exactPunctuation, setExactPunctuation] = useState(existingPassage?.exactPunctuation ?? false);
  const [diacriticSensitive, setDiacriticSensitive] = useState(existingPassage?.diacriticSensitive ?? false);

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const canSave = title.trim().length > 0 && wordCount > 0;
  const textChanged = isEditing && text !== existingPassage?.text;

  const handleSave = () => {
    if (!canSave) return;

    if (textChanged) {
      if (window.confirm('Changing the passage text will reset your memorization progress. Continue?')) {
        doSave();
      }
    } else {
      doSave();
    }
  };

  const doSave = () => {
    if (isEditing && passageId) {
      updatePassage(passageId, { title, text, caseSensitive, exactPunctuation, diacriticSensitive });
    } else {
      addPassage(title, text, caseSensitive, exactPunctuation, diacriticSensitive);
    }
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
    },
    headerTitle: {
      fontFamily: 'serif',
      fontSize: '24px',
      fontWeight: 600,
      color: colors.text,
      margin: 0,
    },
    content: {
      padding: '16px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    label: {
      fontFamily: 'serif',
      fontSize: '16px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '8px',
      marginTop: '16px',
      display: 'block',
    },
    input: {
      fontFamily: 'serif',
      fontSize: '16px',
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      padding: '12px',
      color: colors.text,
      width: '100%',
      boxSizing: 'border-box' as const,
    },
    textArea: {
      minHeight: '200px',
      resize: 'vertical' as const,
    },
    wordCount: {
      fontFamily: 'serif',
      fontSize: '14px',
      color: colors.textSecondary,
      marginTop: '8px',
    },
    warning: {
      fontFamily: 'serif',
      fontSize: '14px',
      color: colors.incorrect,
      marginTop: '8px',
    },
    optionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${colors.border}`,
    },
    optionLabel: {
      fontFamily: 'serif',
      fontSize: '16px',
      color: colors.text,
    },
    optionDescription: {
      fontFamily: 'serif',
      fontSize: '14px',
      color: colors.textSecondary,
      marginTop: '2px',
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: '12px',
      padding: '16px',
      border: 'none',
      cursor: canSave ? 'pointer' : 'not-allowed',
      opacity: canSave ? 1 : 0.5,
      marginTop: '32px',
      marginBottom: '32px',
      width: '100%',
    },
    saveButtonText: {
      fontFamily: 'serif',
      fontSize: '18px',
      fontWeight: 600,
      color: colors.surface,
    },
    checkbox: {
      width: '44px',
      height: '24px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{isEditing ? 'Edit Passage' : 'New Passage'}</h1>
      </div>

      <div style={styles.content}>
        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title..."
        />

        <label style={styles.label}>Passage</label>
        <textarea
          style={{ ...styles.input, ...styles.textArea }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to memorize..."
        />
        <div style={styles.wordCount}>
          {wordCount} word{wordCount !== 1 ? 's' : ''} = {wordCount}K
        </div>
        {textChanged && (
          <div style={styles.warning}>
            Changing text will reset progress
          </div>
        )}

        <label style={{ ...styles.label, marginTop: '24px' }}>Options</label>

        <div style={styles.optionRow}>
          <div>
            <div style={styles.optionLabel}>Case Sensitive</div>
            <div style={styles.optionDescription}>
              Require exact capitalization
            </div>
          </div>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            style={styles.checkbox}
          />
        </div>

        <div style={styles.optionRow}>
          <div>
            <div style={styles.optionLabel}>Exact Punctuation</div>
            <div style={styles.optionDescription}>
              Require hyphens, apostrophes, etc.
            </div>
          </div>
          <input
            type="checkbox"
            checked={exactPunctuation}
            onChange={(e) => setExactPunctuation(e.target.checked)}
            style={styles.checkbox}
          />
        </div>

        <div style={styles.optionRow}>
          <div>
            <div style={styles.optionLabel}>Diacritic Sensitive</div>
            <div style={styles.optionDescription}>
              Distinguish é, è, ê from e (preserves æ, œ)
            </div>
          </div>
          <input
            type="checkbox"
            checked={diacriticSensitive}
            onChange={(e) => setDiacriticSensitive(e.target.checked)}
            style={styles.checkbox}
          />
        </div>

        <button
          style={styles.saveButton}
          onClick={handleSave}
          disabled={!canSave}
        >
          <div style={styles.saveButtonText}>
            {isEditing ? 'Save Changes' : 'Create Passage'}
          </div>
        </button>
      </div>
    </div>
  );
};

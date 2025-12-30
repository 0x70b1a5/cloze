import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';
import { BlankInput, BlankInputRef } from '../components/BlankInput';

const generateBlankIndices = (wordCount: number, kelvin: number): number[] => {
  // At full kelvin, show 1 blank so user can test
  // Otherwise: higher K = fewer blanks (easier)
  const numBlanks = kelvin === wordCount ? 1 : wordCount - kelvin;
  const allIndices = Array.from({ length: wordCount }, (_, i) => i);
  const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numBlanks).sort((a, b) => a - b);
};

export const QuizScreen = () => {
  const { passageId } = useParams<{ passageId: string }>();
  const { getPassage, isComplete, setKelvin, deletePassage } = usePassages();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [testAtKVisible, setTestAtKVisible] = useState(false);
  const [testAtKValue, setTestAtKValue] = useState('');
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [quizKey, setQuizKey] = useState(0);

  const passage = passageId ? getPassage(passageId) : undefined;
  const inputRefs = useRef<Map<number, BlankInputRef>>(new Map());

  const words = useMemo(() =>
    passage ? passage.text.split(/\s+/).filter(w => w.length > 0) : [],
    [passage?.text]
  );

  const kelvin = passage?.kelvin ?? 0;
  const complete = passage ? isComplete(passage) : false;

  useEffect(() => {
    if (words.length > 0 && kelvin > 0) {
      setBlankIndices(generateBlankIndices(words.length, kelvin));
    } else {
      setBlankIndices([]);
    }
  }, [kelvin, words.length, quizKey]);

  useEffect(() => {
    if (!passage) {
      navigate('/');
    }
  }, [passage, navigate]);

  if (!passage || !passageId) return null;

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.background,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      paddingTop: '16px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
    },
    backButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: colors.text,
      cursor: 'pointer',
      padding: '8px',
      marginRight: '8px',
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontFamily: 'serif',
      fontSize: '18px',
      fontWeight: 600,
      color: colors.text,
      margin: 0,
    },
    kelvinText: {
      fontFamily: 'serif',
      fontSize: '14px',
      color: complete ? colors.correct : colors.textSecondary,
      marginTop: '2px',
    },
    menuButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: colors.text,
      cursor: 'pointer',
      padding: '8px',
    },
    content: {
      padding: '20px',
      paddingBottom: '100px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    textContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'baseline',
    },
    word: {
      fontFamily: 'serif',
      fontSize: '18px',
      lineHeight: '36px',
      color: colors.text,
      margin: '0 2px',
    },
    completeMessage: {
      fontFamily: 'serif',
      fontSize: '20px',
      fontWeight: 600,
      color: colors.correct,
      textAlign: 'center' as const,
      marginTop: '32px',
    },
    submitButton: {
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
    },
    submitButtonText: {
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
    menuItemTextDanger: {
      color: colors.incorrect,
    },
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: '12px',
      padding: '24px',
      width: '280px',
      border: `1px solid ${colors.border}`,
    },
    modalTitle: {
      fontFamily: 'serif',
      fontSize: '18px',
      fontWeight: 600,
      color: colors.text,
      marginBottom: '8px',
    },
    modalSubtitle: {
      fontFamily: 'serif',
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '16px',
    },
    modalInput: {
      fontFamily: 'serif',
      fontSize: '18px',
      backgroundColor: colors.inputBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      padding: '12px',
      color: colors.text,
      textAlign: 'center' as const,
      marginBottom: '16px',
      width: '100%',
      boxSizing: 'border-box' as const,
    },
    modalButtons: {
      display: 'flex',
      gap: '8px',
    },
    modalButton: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'serif',
      fontSize: '16px',
      fontWeight: 600,
    },
    modalButtonCancel: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    modalButtonConfirm: {
      backgroundColor: colors.primary,
      color: colors.surface,
    },
  };

  const handleSubmit = useCallback(() => {
    let correct = 0;
    let incorrect = 0;

    blankIndices.forEach(wordIndex => {
      const inputRef = inputRefs.current.get(wordIndex);
      if (inputRef) {
        const result = inputRef.getResult();
        if (result.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const delta = correct - incorrect;
    const newKelvin = Math.max(0, Math.min(words.length, kelvin - delta));

    const message = delta > 0
      ? `+${correct} correct, -${incorrect} wrong\nNet: -${Math.abs(delta)}K`
      : delta < 0
        ? `+${correct} correct, -${incorrect} wrong\nNet: +${Math.abs(delta)}K`
        : `+${correct} correct, -${incorrect} wrong\nNo change`;

    window.alert(`${newKelvin === 0 ? 'Memorized!' : `${newKelvin}K`}\n\n${message}`);
    setKelvin(passageId, newKelvin);
    setQuizKey(k => k + 1);
  }, [blankIndices, kelvin, words.length, passageId, setKelvin]);

  const handleSpace = useCallback((currentBlankPosition: number) => {
    if (currentBlankPosition < blankIndices.length - 1) {
      const nextBlankWordIndex = blankIndices[currentBlankPosition + 1];
      const nextInput = inputRefs.current.get(nextBlankWordIndex);
      if (nextInput) {
        setTimeout(() => nextInput.focus(), 50);
      }
    }
  }, [blankIndices]);

  const handleEdit = () => {
    setMenuVisible(false);
    navigate(`/edit/${passageId}`);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    if (window.confirm('Are you sure you want to delete this passage? This cannot be undone.')) {
      deletePassage(passageId);
      navigate('/');
    }
  };

  const handleToggleTheme = () => {
    setMenuVisible(false);
    toggleTheme();
  };

  const handleResetProgress = () => {
    setMenuVisible(false);
    if (window.confirm('This will reset to full Kelvin (all words as blanks). Continue?')) {
      setKelvin(passageId, words.length);
      setQuizKey(k => k + 1);
    }
  };

  const handleTestAtK = () => {
    setMenuVisible(false);
    setTestAtKValue(String(kelvin));
    setTestAtKVisible(true);
  };

  const handleTestAtKSubmit = () => {
    const targetK = parseInt(testAtKValue, 10);

    if (isNaN(targetK) || targetK < 0 || targetK > words.length) {
      window.alert(`Invalid! Please enter a number between 0 and ${words.length}`);
      return;
    }

    setKelvin(passageId, targetK);
    setQuizKey(k => k + 1);
    setTestAtKVisible(false);
  };

  const getWordWidth = (word: string) => {
    // Use full ems for nice padding
    return Math.max(word.length, 3); // Return in em units, min 3em
  };

  let blankPosition = 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          &lt;
        </button>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>{passage.title}</h2>
          <div style={styles.kelvinText}>
            {complete ? 'Memorized!' : `${kelvin}K remaining`}
          </div>
        </div>
        <button style={styles.menuButton} onClick={() => setMenuVisible(!menuVisible)}>
          ☰
        </button>
      </div>

      {menuVisible && (
        <>
          <div style={styles.overlay} onClick={() => setMenuVisible(false)} />
          <div style={styles.menu}>
            <div style={styles.menuItem} onClick={handleToggleTheme}>
              <p style={styles.menuItemText}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
            <div style={styles.menuItem} onClick={handleEdit}>
              <p style={styles.menuItemText}>Edit Passage</p>
            </div>
            <div style={styles.menuItem} onClick={handleTestAtK}>
              <p style={styles.menuItemText}>Test at K...</p>
            </div>
            <div style={styles.menuItem} onClick={handleResetProgress}>
              <p style={styles.menuItemText}>Reset Progress</p>
            </div>
            <div style={{ ...styles.menuItem, ...styles.menuItemLast }} onClick={handleDelete}>
              <p style={{ ...styles.menuItemText, ...styles.menuItemTextDanger }}>
                Delete Passage
              </p>
            </div>
          </div>
        </>
      )}

      <div style={styles.content}>
        <div style={styles.textContainer}>
          {words.map((word, index) => {
            const isBlank = blankIndices.includes(index);

            if (isBlank) {
              const currentPosition = blankPosition;
              blankPosition++;

              return (
                <BlankInput
                  key={`${quizKey}-${index}`}
                  ref={(ref) => {
                    if (ref) {
                      inputRefs.current.set(index, ref);
                    } else {
                      inputRefs.current.delete(index);
                    }
                  }}
                  expectedWord={word}
                  caseSensitive={passage.caseSensitive}
                  exactPunctuation={passage.exactPunctuation}
                  onSpace={() => handleSpace(currentPosition)}
                  width={getWordWidth(word)}
                />
              );
            }

            return (
              <span key={index} style={styles.word}>
                {word}
              </span>
            );
          })}
        </div>

        {complete && (
          <p style={styles.completeMessage}>
            Congratulations! You've memorized this passage.
          </p>
        )}
      </div>

      {!complete && blankIndices.length > 0 && (
        <button style={styles.submitButton} onClick={handleSubmit}>
          <div style={styles.submitButtonText}>Submit</div>
        </button>
      )}

      {testAtKVisible && (
        <div style={styles.modalOverlay} onClick={() => setTestAtKVisible(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Test at K</div>
            <div style={styles.modalSubtitle}>
              Enter target Kelvin (0-{words.length})
            </div>
            <input
              style={styles.modalInput}
              type="number"
              value={testAtKValue}
              onChange={(e) => setTestAtKValue(e.target.value)}
              autoFocus
            />
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.modalButtonCancel }}
                onClick={() => setTestAtKVisible(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.modalButtonConfirm }}
                onClick={handleTestAtKSubmit}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

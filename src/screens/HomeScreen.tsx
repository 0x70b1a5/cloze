import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { usePassages } from '../context/PassagesContext';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { passages, isComplete } = usePassages();
  const { colors, isDark, toggleTheme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20, color: colors.text }}>
            {isDark ? '☀' : '☾'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDark, toggleTheme, colors.text]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      flex: 1,
    },
    listContent: {
      padding: 16,
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontFamily: 'serif',
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 28,
    },
    row: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowComplete: {
      borderColor: colors.correct,
      borderWidth: 2,
    },
    title: {
      fontFamily: 'serif',
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    kelvin: {
      fontFamily: 'serif',
      fontSize: 16,
      color: colors.textSecondary,
    },
    kelvinComplete: {
      color: colors.correct,
      fontWeight: '600',
    },
    addButton: {
      position: 'absolute',
      bottom: 32,
      left: 32,
      right: 32,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    addButtonText: {
      fontFamily: 'serif',
      fontSize: 18,
      fontWeight: '600',
      color: colors.surface,
    },
  });

  const renderItem = ({ item }: { item: typeof passages[0] }) => {
    const complete = isComplete(item);

    return (
      <TouchableOpacity
        style={[styles.row, complete && styles.rowComplete]}
        onPress={() => navigation.navigate('Quiz', { passageId: item.id })}
        activeOpacity={0.7}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.kelvin, complete && styles.kelvinComplete]}>
          {complete ? 'Memorized' : `${item.kelvin}K`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {passages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No passages yet.{'\n'}Add one to begin memorizing.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={passages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Edit', {})}
        activeOpacity={0.8}>
        <Text style={styles.addButtonText}>Add Passage</Text>
      </TouchableOpacity>
    </View>
  );
};

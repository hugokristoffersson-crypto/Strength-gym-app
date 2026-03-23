import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const COLORS = {
  bg: '#0B0D10',
  panel: '#141820',
  panelSoft: '#1A1F28',
  line: '#252B36',
  text: '#F5F7FA',
  muted: '#9FA7B4',
  red: '#D62828',
  redDark: '#931A1A',
  green: '#1FA968',
  white: '#FFFFFF',
};

const WEEK = [
  {
    key: 'mon',
    label: 'Måndag',
    title: 'Överkropp • Tryck',
    description: 'Bröst, axlar och triceps med tydliga basövningar.',
    exercises: [
      {
        name: 'Bänkpress',
        sets: '4 x 6–8',
        focus: 'Styrka',
        note: 'Sänk kontrollerat till bröstet och pressa rakt upp med stabila axlar.',
        videoUrl: 'https://www.youtube.com/results?search_query=b%C3%A4nkpress+teknik',
      },
      {
        name: 'Lutande hantelpress',
        sets: '3 x 8–10',
        focus: 'Överkropp',
        note: 'Jobba i lugnt tempo och få kontakt med övre bröstet.',
        videoUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+form',
      },
      {
        name: 'Axelpress',
        sets: '3 x 8',
        focus: 'Axlar',
        note: 'Spänn magen och pressa vikten rakt upp utan att svanka.',
        videoUrl: 'https://www.youtube.com/results?search_query=shoulder+press+form',
      },
      {
        name: 'Triceps pushdown',
        sets: '3 x 12',
        focus: 'Armar',
        note: 'Håll armbågarna nära kroppen och sträck ut fullt.',
        videoUrl: 'https://www.youtube.com/results?search_query=triceps+pushdown+form',
      },
    ],
  },
  {
    key: 'tue',
    label: 'Tisdag',
    title: 'Snabbhet & explosivitet',
    description: 'Acceleration, hopp och riktningsförändringar för fotboll.',
    exercises: [
      {
        name: 'Sprintstarter 10–20 m',
        sets: '6 reps',
        focus: 'Acceleration',
        note: 'Luta kroppen lätt fram och tryck explosivt i första stegen.',
        videoUrl: 'https://www.youtube.com/results?search_query=sprint+start+technique',
      },
      {
        name: 'Box jumps',
        sets: '4 x 5',
        focus: 'Explosivitet',
        note: 'Hoppa snabbt och mjukt, landa stabilt med kontroll.',
        videoUrl: 'https://www.youtube.com/results?search_query=box+jump+technique',
      },
      {
        name: 'Sidledsförflyttning',
        sets: '4 x 20 sek',
        focus: 'Riktningsförändring',
        note: 'Små, snabba steg och håll låg tyngdpunkt.',
        videoUrl: 'https://www.youtube.com/results?search_query=lateral+shuffle+drill',
      },
      {
        name: 'Core plank',
        sets: '3 x 35 sek',
        focus: 'Bål',
        note: 'Håll kroppen rak och spänn hela bålen.',
        videoUrl: 'https://www.youtube.com/results?search_query=plank+form',
      },
    ],
  },
  {
    key: 'wed',
    label: 'Onsdag',
    title: 'Överkropp • Drag',
    description: 'Rygg, baksida axlar och biceps för balans och bättre fysik.',
    exercises: [
      {
        name: 'Latsdrag',
        sets: '4 x 8',
        focus: 'Rygg',
        note: 'Dra armbågarna ned mot sidan och undvik att gunga.',
        videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+form',
      },
      {
        name: 'Sittande rodd',
        sets: '3 x 10',
        focus: 'Övre rygg',
        note: 'Bröstet upp, dra handtaget mot magen.',
        videoUrl: 'https://www.youtube.com/results?search_query=seated+row+form',
      },
      {
        name: 'Face pulls',
        sets: '3 x 12',
        focus: 'Baksida axel',
        note: 'Dra repet mot ansiktet och öppna upp bröstet.',
        videoUrl: 'https://www.youtube.com/results?search_query=face+pull+form',
      },
      {
        name: 'Bicepscurl',
        sets: '3 x 10',
        focus: 'Armar',
        note: 'Lugna reps och undvik att svinga.',
        videoUrl: 'https://www.youtube.com/results?search_query=biceps+curl+form',
      },
    ],
  },
  {
    key: 'thu',
    label: 'Torsdag',
    title: 'Benstyrka + kraft',
    description: 'Ben som hjälper både sprint, dueller och explosivitet.',
    exercises: [
      {
        name: 'Knäböj',
        sets: '4 x 5–6',
        focus: 'Styrka',
        note: 'Bröstet upp, knäna följer tårna och pressa upp genom hela foten.',
        videoUrl: 'https://www.youtube.com/results?search_query=squat+form',
      },
      {
        name: 'Rumänska marklyft',
        sets: '3 x 8',
        focus: 'Baksida lår',
        note: 'Fäll i höften med rak rygg och känn sträck i baksidan.',
        videoUrl: 'https://www.youtube.com/results?search_query=romanian+deadlift+form',
      },
      {
        name: 'Utfall',
        sets: '3 x 8 / ben',
        focus: 'Balans',
        note: 'Långt steg och håll överkroppen stabil.',
        videoUrl: 'https://www.youtube.com/results?search_query=lunge+form',
      },
      {
        name: 'Vadpress',
        sets: '3 x 15',
        focus: 'Underben',
        note: 'Kontrollerad botten och kraftfull press upp.',
        videoUrl: 'https://www.youtube.com/results?search_query=calf+raise+form',
      },
    ],
  },
  {
    key: 'fri',
    label: 'Fredag',
    title: 'Atletisk mix',
    description: 'En enklare proffsdag med pump, tempo och atletisk känsla.',
    exercises: [
      {
        name: 'Armhävningar',
        sets: '3 x max',
        focus: 'Tryck',
        note: 'Håll kroppen rak och bröstet hela vägen ner.',
        videoUrl: 'https://www.youtube.com/results?search_query=pushup+form',
      },
      {
        name: 'Medicinsk boll-kast',
        sets: '4 x 6',
        focus: 'Explosiv överkropp',
        note: 'Explodera i kastet och återställ snabbt mellan reps.',
        videoUrl: 'https://www.youtube.com/results?search_query=medicine+ball+slam+form',
      },
      {
        name: 'Battle rope / tempointervall',
        sets: '5 x 20 sek',
        focus: 'Puls',
        note: 'Jobba hårt men håll teknik och rytm.',
        videoUrl: 'https://www.youtube.com/results?search_query=battle+rope+form',
      },
      {
        name: 'Stegringslopp',
        sets: '5 reps',
        focus: 'Snabbhet',
        note: 'Öka farten gradvis och håll dig avslappnad.',
        videoUrl: 'https://www.youtube.com/results?search_query=strides+running+drill',
      },
    ],
  },
];

function getTodayIndex() {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return 0;
  return day - 1;
}

function Button({ title, onPress, secondary, small }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.buttonSecondary : styles.buttonPrimary,
        small && styles.buttonSmall,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ExerciseCard({ exercise, index, done, isCurrent, onDone, onVideo }) {
  return (
    <View style={[styles.exerciseCard, done && styles.exerciseDone, isCurrent && styles.exerciseCurrent]}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseIndexBubble}>
          <Text style={styles.exerciseIndexText}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
          <View style={styles.exerciseMetaRow}>
            <View style={styles.pill}><Text style={styles.pillText}>{exercise.sets}</Text></View>
            <View style={styles.pill}><Text style={styles.pillText}>{exercise.focus}</Text></View>
            {isCurrent && !done ? (
              <View style={[styles.pill, styles.pillRed]}><Text style={styles.pillRedText}>Nu kör vi</Text></View>
            ) : null}
            {done ? (
              <View style={[styles.pill, styles.pillGreen]}><Text style={styles.pillGreenText}>Klar</Text></View>
            ) : null}
          </View>
        </View>
      </View>
      <Text style={styles.exerciseNote}>{exercise.note}</Text>
      <View style={styles.exerciseActions}>
        <Button title="▶ Se video" onPress={onVideo} secondary small />
        <Button title={done ? 'Ångra' : 'Klar'} onPress={onDone} small />
      </View>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Hem');
  const [activeDayIndex, setActiveDayIndex] = useState(getTodayIndex());
  const [completed, setCompleted] = useState({});

  const todayIndex = getTodayIndex();
  const activeDay = WEEK[activeDayIndex];
  const today = WEEK[todayIndex];

  const currentExerciseIndex = useMemo(() => {
    const dayProgress = completed[activeDay.key] || [];
    const firstOpen = activeDay.exercises.findIndex((_, i) => !dayProgress[i]);
    return firstOpen === -1 ? activeDay.exercises.length - 1 : firstOpen;
  }, [activeDay, completed]);

  const totalDone = WEEK.reduce((acc, day) => {
    const dayProgress = completed[day.key] || [];
    return acc + dayProgress.filter(Boolean).length;
  }, 0);
  const totalExercises = WEEK.reduce((acc, day) => acc + day.exercises.length, 0);
  const totalDaysDone = WEEK.reduce((acc, day) => {
    const dayProgress = completed[day.key] || [];
    const isComplete = day.exercises.every((_, i) => dayProgress[i]);
    return acc + (isComplete ? 1 : 0);
  }, 0);
  const progressPercent = Math.round((totalDone / totalExercises) * 100);

  const toggleExercise = (dayKey, exerciseIndex) => {
    setCompleted((prev) => {
      const current = prev[dayKey] || [];
      const next = [...current];
      next[exerciseIndex] = !next[exerciseIndex];
      return { ...prev, [dayKey]: next };
    });
  };

  const openVideo = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Kunde inte öppna videon');
      return;
    }
    Linking.openURL(url);
  };

  const resetWeek = () => {
    Alert.alert('Nollställ vecka', 'Vill du ta bort alla markeringar?', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Nollställ', style: 'destructive', onPress: () => setCompleted({}) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'Hem' && (
            <>
              <View style={styles.heroCard}>
                <Text style={styles.brandEyebrow}>Strength Gym</Text>
                <Text style={styles.heroTitle}>En premium träningsapp för fotboll + gym.</Text>
                <Text style={styles.heroText}>
                  Enkel nog för hela laget. Snygg nog att kännas som en riktig App Store-app.
                </Text>
                <Button
                  title={`Starta dagens pass • ${today.label}`}
                  onPress={() => {
                    setActiveDayIndex(todayIndex);
                    setActiveTab('Schema');
                  }}
                />
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Dagens pass</Text>
                <Text style={styles.cardBigTitle}>{today.title}</Text>
                <Text style={styles.cardDescription}>{today.description}</Text>
                <View style={styles.rowGap}>
                  <Button
                    title="Öppna pass"
                    onPress={() => {
                      setActiveDayIndex(todayIndex);
                      setActiveTab('Schema');
                    }}
                  />
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Veckoprogress</Text>
                  <Text style={styles.progressPercent}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressBarShell}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.cardDescription}>{totalDaysDone}/5 pass klara denna vecka</Text>
                <Text style={styles.streakText}>🔥 Streak: 2 dagar i rad</Text>
              </View>
            </>
          )}

          {activeTab === 'Schema' && (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Veckoschema</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayTabsRow}>
                  {WEEK.map((day, index) => (
                    <TabButton
                      key={day.key}
                      label={day.label}
                      active={index === activeDayIndex}
                      onPress={() => setActiveDayIndex(index)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.cardBigTitle}>{activeDay.title}</Text>
                <Text style={styles.cardDescription}>{activeDay.description}</Text>
              </View>

              {activeDay.exercises.map((exercise, index) => {
                const dayProgress = completed[activeDay.key] || [];
                const done = !!dayProgress[index];
                return (
                  <ExerciseCard
                    key={`${activeDay.key}-${index}`}
                    exercise={exercise}
                    index={index}
                    done={done}
                    isCurrent={index === currentExerciseIndex}
                    onDone={() => toggleExercise(activeDay.key, index)}
                    onVideo={() => openVideo(exercise.videoUrl)}
                  />
                );
              })}

              <Button title="Nollställ veckan" onPress={resetWeek} secondary />
            </>
          )}

          {activeTab === 'Profil' && (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Profil</Text>
                <Text style={styles.cardBigTitle}>Hugo</Text>
                <Text style={styles.cardDescription}>Fotboll + gym • Lagversion V1</Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Din progress</Text>
                <Text style={styles.profileStat}>✔ {totalDaysDone}/5 pass denna vecka</Text>
                <Text style={styles.profileStat}>🔥 2 dagar i rad</Text>
                <Text style={styles.profileStat}>🏁 {totalDone}/{totalExercises} övningar klara</Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Mål</Text>
                <Text style={styles.cardDescription}>Bygga överkropp, bli snabbare och mer explosiv för fotboll.</Text>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          {['Hem', 'Schema', 'Profil'].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.bottomNavItem}>
              <Text style={[styles.bottomNavText, activeTab === tab && styles.bottomNavTextActive]}>{tab}</Text>
              {activeTab === tab ? <View style={styles.bottomNavDot} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  heroCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 28,
    padding: 20,
    gap: 12,
  },
  brandEyebrow: {
    color: '#FFC8C8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  heroText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  sectionCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  sectionTitle: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBigTitle: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  cardDescription: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  rowGap: {
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarShell: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#0F1217',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.red,
  },
  streakText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  dayTabsRow: {
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.panelSoft,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  tabButtonActive: {
    backgroundColor: '#341717',
    borderColor: '#6E2626',
  },
  tabButtonText: {
    color: COLORS.muted,
    fontWeight: '800',
    fontSize: 13,
  },
  tabButtonTextActive: {
    color: COLORS.text,
  },
  exerciseCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  exerciseCurrent: {
    borderColor: '#7D2727',
  },
  exerciseDone: {
    borderColor: '#266848',
  },
  exerciseHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  exerciseIndexBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#311717',
    borderWidth: 1,
    borderColor: '#5F2525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIndexText: {
    color: '#FFD0D0',
    fontWeight: '900',
  },
  exerciseTitle: {
    color: COLORS.text,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '900',
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.panelSoft,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  pillText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '800',
  },
  pillRed: {
    backgroundColor: '#341717',
    borderColor: '#6E2626',
  },
  pillRedText: {
    color: '#FFD0D0',
    fontSize: 12,
    fontWeight: '800',
  },
  pillGreen: {
    backgroundColor: '#143022',
    borderColor: '#266848',
  },
  pillGreenText: {
    color: '#C8F3DD',
    fontSize: 12,
    fontWeight: '800',
  },
  exerciseNote: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.red,
  },
  buttonSecondary: {
    backgroundColor: COLORS.panelSoft,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  buttonSmall: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#11151B',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 4,
    flex: 1,
  },
  bottomNavText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  bottomNavTextActive: {
    color: COLORS.text,
  },
  bottomNavDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.red,
  },
  profileStat: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
});

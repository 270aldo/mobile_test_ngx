import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  BarChart3,
  Camera,
  Sparkles,
  User,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ngx,
        tabBarInactiveTintColor: colors.chrome,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <BlurView
              intensity={20}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.tabBarOverlay} />
          </View>
        ),
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. INICIO (Home Hub) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <Home size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* 2. PROGRESO */}
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <BarChart3 size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* 3. CAMERA (FAB Central) */}
      <Tabs.Screen
        name="camera"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabWrapper}>
              <LinearGradient
                colors={focused ? ['#8B2CF5', '#6D00FF'] : ['#6D00FF', '#4A00B0']}
                style={styles.fab}
              >
                <Camera size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
          ),
          tabBarStyle: { display: 'none' },
        }}
      />

      {/* 4. GENESIS (Chat) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'GENESIS',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.genesisGlow : undefined}>
              <Sparkles size={22} color={focused ? colors.ngx : color} />
            </View>
          ),
        }}
      />

      {/* 5. PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <User size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* === HIDDEN TABS (accesibles via router.push desde Home) === */}
      <Tabs.Screen
        name="train"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="nourish"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="mind"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 35,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    overflow: 'hidden',
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 10, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 35,
  },
  tabBarItem: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  iconActive: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  genesisGlow: {
    shadowColor: colors.ngx,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6D00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

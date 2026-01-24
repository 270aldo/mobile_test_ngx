import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import {
  Home,
  Dumbbell,
  MessageCircle,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { colors, borderRadius, shadows, layout } from '@/constants/theme';

/**
 * TabLayout - NGX GENESIS HYBRID Tab Navigator
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * .tab-bar {
 *   background: rgba(0, 0, 0, 0.8);
 *   border: 1px solid rgba(255, 255, 255, 0.1);
 *   border-radius: 38px;
 *   backdrop-filter: blur(16px);
 * }
 * .nav-btn.active { color: #6D00FF; filter: drop-shadow(0 0 8px rgba(109, 0, 255, 0.6)); }
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ngx,
        tabBarInactiveTintColor: colors.chrome,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <BlurView
              intensity={16}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.tabBarOverlay} />
          </View>
        ),
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <Home size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <Dumbbell size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <MessageCircle size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <TrendingUp size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <User size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    right: 20,
    height: layout.tabBarHeight,
    borderRadius: borderRadius['3xl'],
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    overflow: 'hidden',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius['3xl'],
    overflow: 'hidden',
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.tabBarBg,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    borderRadius: borderRadius['3xl'],
  },
  tabBarItem: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  iconActive: {
    ...shadows.tabActiveGlow,
  },
});

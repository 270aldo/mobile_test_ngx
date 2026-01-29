import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Plus, Calendar, ChevronRight } from 'lucide-react-native';
import { GlassCard, Button } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - 48 - 16) / 3; // 3 columns with gaps

interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  week: number;
}

interface PhotosViewProps {
  /** Progress photos */
  photos?: ProgressPhoto[];
  /** Callback to take new photo */
  onTakePhoto?: () => void;
  /** Test ID */
  testID?: string;
}

/**
 * PhotosView - Progress photos timeline
 *
 * Shows:
 * - Grid of progress photos
 * - Add new photo button
 * - Before/after comparison option
 */
export function PhotosView({
  photos = [],
  onTakePhoto,
  testID,
}: PhotosViewProps) {
  const router = useRouter();

  // Group photos by week
  const photosByWeek = photos.reduce((acc, photo) => {
    const weekKey = `Week ${photo.week}`;
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(photo);
    return acc;
  }, {} as Record<string, ProgressPhoto[]>);

  const handleTakePhoto = () => {
    if (onTakePhoto) {
      onTakePhoto();
    } else {
      router.push('/(tabs)/camera');
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Add Photo Card */}
      <GlassCard style={styles.addPhotoCard}>
        <View style={styles.addPhotoContent}>
          <View style={styles.addPhotoIcon}>
            <Camera size={24} color={colors.ngx} />
          </View>
          <View style={styles.addPhotoText}>
            <Text style={styles.addPhotoTitle}>Captura tu progreso</Text>
            <Text style={styles.addPhotoSubtitle}>
              Las fotos se guardan de forma privada
            </Text>
          </View>
        </View>
        <Button
          variant="primary"
          onPress={handleTakePhoto}
          style={styles.addPhotoButton}
        >
          <Plus size={16} color={colors.text} style={{ marginRight: 6 }} />
          Nueva foto
        </Button>
      </GlassCard>

      {photos.length > 0 ? (
        <>
          {/* Compare Button */}
          {photos.length >= 2 && (
            <Pressable style={styles.compareButton}>
              <Text style={styles.compareText}>Comparar inicio vs actual</Text>
              <ChevronRight size={16} color={colors.ngx} />
            </Pressable>
          )}

          {/* Photos by Week */}
          {Object.entries(photosByWeek)
            .sort(([a], [b]) => {
              const weekA = parseInt(a.replace('Week ', ''));
              const weekB = parseInt(b.replace('Week ', ''));
              return weekB - weekA; // Most recent first
            })
            .map(([week, weekPhotos]) => (
              <View key={week} style={styles.weekSection}>
                <View style={styles.weekHeader}>
                  <Calendar size={14} color={colors.textMuted} />
                  <Text style={styles.weekTitle}>{week}</Text>
                  <Text style={styles.weekCount}>
                    {weekPhotos.length} {weekPhotos.length === 1 ? 'foto' : 'fotos'}
                  </Text>
                </View>

                <View style={styles.photosGrid}>
                  {weekPhotos.map((photo) => (
                    <Pressable key={photo.id} style={styles.photoItem}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.photoImage}
                        resizeMode="cover"
                      />
                      <View style={styles.photoOverlay}>
                        <Text style={styles.photoDate}>{photo.date}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
        </>
      ) : (
        /* Empty State */
        <GlassCard style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Camera size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Sin fotos aún</Text>
          <Text style={styles.emptyText}>
            Documenta tu progreso tomando fotos semanales.
            {'\n'}Las fotos son privadas y solo tú las puedes ver.
          </Text>
          <View style={styles.emptyTips}>
            <Text style={styles.tipTitle}>Tips para mejores fotos:</Text>
            <Text style={styles.tipItem}>• Misma ubicación y luz</Text>
            <Text style={styles.tipItem}>• Misma hora del día</Text>
            <Text style={styles.tipItem}>• Mismas poses (frente, lado, espalda)</Text>
          </View>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },

  // Add Photo Card
  addPhotoCard: {
    padding: spacing.md,
  },
  addPhotoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  addPhotoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    flex: 1,
  },
  addPhotoTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  addPhotoSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  addPhotoButton: {},

  // Compare Button
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.2)',
  },
  compareText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ngx,
  },

  // Week Section
  weekSection: {
    gap: spacing.sm,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weekTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  weekCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginLeft: 'auto',
  },

  // Photos Grid
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  photoDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
  },

  // Empty State
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTips: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    alignSelf: 'stretch',
  },
  tipTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tipItem: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },
});

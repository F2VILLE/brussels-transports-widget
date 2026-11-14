import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  stopsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  scrollContainer: {
    width: "100%",
  },
  scrollContent: {
    padding: 16
  },
  stop: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#533bbe",
    borderRadius: 10
  },
  line: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  stopNameContainer: {},
  stopName: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 42,
    textAlign: "center"
  },
  lineName: {
  },
  lineTime: {},
  button: {
    backgroundColor: "#6135ff63",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 600,
    marginTop: 10
  }
});

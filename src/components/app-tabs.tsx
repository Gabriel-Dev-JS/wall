import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { useThemeMode } from '@/hooks/theme-mode-provider';

export default function AppTabs() {
  const { resolvedScheme } = useThemeMode();
  const colors = Colors[resolvedScheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Despesas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="banknote" md="payments" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="metrics">
        <NativeTabs.Trigger.Label>Métricas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar" md="bar_chart" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Configurações</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

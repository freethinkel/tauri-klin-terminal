<script lang="ts">
  import {
    fontSize$,
    fontFamily$,
    lineHeight$,
    opacity$,
    changeSettings,
  } from "../../store";
  import { SettingsCard } from "../../components/settings-card";
  import { ControlInput } from "../../components/control-input";
  import { ControlSlider } from "../../components/control-slider";

  const fontFamily = fontFamily$;
  const fontSize = fontSize$;
  const lineHeight = lineHeight$;
  const opacity = opacity$;
</script>

<SettingsCard title="Text">
  <ControlInput
    title="Font family"
    placeholder="Enter font family"
    value={$fontFamily}
    on:change={({ detail }) =>
      changeSettings({ key: "fontFamily", value: detail })}
  />
  <ControlInput
    title="Font size"
    type="number"
    value={$fontSize.toString()}
    min={1}
    max={25}
    step={1}
    on:change={({ detail }) =>
      changeSettings({ key: "fontSize", value: Number(detail) || 13 })}
  />
  <ControlInput
    title="Line height"
    type="number"
    min={0.5}
    max={5}
    step={0.1}
    value={$lineHeight.toString()}
    on:change={({ detail }) =>
      changeSettings({ key: "lineHeight", value: Number(detail) || 1 })}
  />
</SettingsCard>
<SettingsCard title="Background">
  <ControlSlider
    title="Opacity"
    value={$opacity}
    showValue={Math.ceil($opacity * 100).toString()}
    on:change={({ detail }) =>
      changeSettings({ key: "opacity", value: detail })}
  />
</SettingsCard>

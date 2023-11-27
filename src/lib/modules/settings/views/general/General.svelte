<script lang="ts">
  import { Input } from "@/shared/components/input";
  import { settings$ } from "../../store";
  import RangeSlider from "@/shared/components/range-slider/RangeSlider.svelte";
  import { SettingsCard } from "../../components/settings-card";
  import { ControlInput } from "../../components/control-input";
  import { ControlSlider } from "../../components/control-slider";

  const fontFamily = settings$.fontFamily;
  const fontSize = settings$.fontSize;
  const lineHeight = settings$.lineHeight;
  const opacity = settings$.opacity;
</script>

<SettingsCard title="Text">
  <ControlInput
    title="Font family"
    placeholder="Enter font family"
    value={$fontFamily}
    on:change={({ detail }) => settings$.handleChange("fontFamily")(detail)}
  />
  <ControlInput
    title="Font size"
    type="number"
    value={$fontSize.toString()}
    min={1}
    max={25}
    step={1}
    on:change={({ detail }) =>
      settings$.handleChange("fontSize")(Number(detail) || 13)}
  />
  <ControlInput
    title="Line height"
    type="number"
    min={0.5}
    max={5}
    step={0.1}
    value={$lineHeight.toString()}
    on:change={({ detail }) =>
      settings$.handleChange("lineHeight")(Number(detail) || 1)}
  />
</SettingsCard>
<SettingsCard title="Background">
  <ControlSlider
    title="Opacity"
    value={$opacity}
    showValue={Math.ceil($opacity * 100).toString()}
    on:change={({ detail }) => settings$.handleChange("opacity")(detail)}
  />
</SettingsCard>

<script lang="ts">
  import { Input } from "@/shared/components/input";
  import { settings$ } from "../../store";
  import RangeSlider from "@/shared/components/range-slider/RangeSlider.svelte";

  const fontFamily = settings$.fontFamily;
  const fontSize = settings$.fontSize;
  const lineHeight = settings$.lineHeight;
  const opacity = settings$.opacity;
</script>

<div class="form-field">
  <Input
    value={$fontSize.toString()}
    on:change={({ detail }) =>
      settings$.handleChange("fontSize")(Number(detail) || 13)}
    label="Font size"
    placeholder="Enter font size"
  />
  <Input
    value={$lineHeight.toString()}
    on:change={({ detail }) =>
      settings$.handleChange("lineHeight")(Number(detail) || 1)}
    label="Line height"
    placeholder="Enter line height"
  />
</div>
<div class="form-field">
  <Input
    value={$fontFamily}
    on:change={({ detail }) => settings$.handleChange("fontFamily")(detail)}
    label="Font family"
    placeholder="Enter font family"
  />
</div>
<div class="form-field">
  <RangeSlider
    value={$opacity}
    on:change={({ detail }) => settings$.handleChange("opacity")(detail)}
    label="Opacity"
  />
</div>

<style>
  .form-field {
    display: flex;
    width: 100%;
    gap: 6px;
  }
  .form-field + .form-field {
    margin-top: 10px;
  }
  .form-field > :global(*) {
    flex: 1;
  }
</style>

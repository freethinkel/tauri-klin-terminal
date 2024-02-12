<script lang="ts">
  import { Titlebar } from "@/components/titlebar";
  import { SettingsTab } from "@/components/settings-tab";
  import { General } from "@/views/general";
  import { Themes } from "@/views/themes";
  import { Keymaps } from "@/views/keymaps";
  import { Advanced } from "@/views/advanced";

  const sections = [
    {
      icon: "settings",
      text: "General",
      view: General,
    },
    {
      icon: "brush",
      text: "Theme",
      view: Themes,
    },
    {
      icon: "keyboard",
      text: "Keymaps",
      view: Keymaps,
    },
    {
      icon: "tools",
      text: "Advanced",
      view: Advanced,
    },
  ] as Array<never>;
</script>

<div class="wrapper">
  <Titlebar>Terminal Settings</Titlebar>
  <SettingsTab {sections} />
</div>

<style lang="postcss">
  .wrapper {
    background: var(--color-primary);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

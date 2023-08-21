<script lang="ts">
  import { Titlebar } from "@/shared/components/titlebar";
  import { SettingsTab } from "../../components/tab";
  import { Themes } from "../themes";
  import { General } from "../general";
  import { Advanced } from "../advanced";

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

<style>
  .wrapper {
    background: var(--color-primary);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

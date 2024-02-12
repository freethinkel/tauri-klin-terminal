<script lang="ts">
  import { platform, type Platform } from "@tauri-apps/api/os";
  import { onMount } from "svelte";

  let currentPlatform: Platform = "win32";

  onMount(async () => {
    currentPlatform = await platform();
  });
</script>

<nav data-tauri-drag-region class:macos={currentPlatform === "darwin"}>
  <slot />
</nav>

<style>
  nav {
    display: flex;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 28px;
    cursor: default;
  }
  .macos {
    padding: 0 78px;
  }
</style>

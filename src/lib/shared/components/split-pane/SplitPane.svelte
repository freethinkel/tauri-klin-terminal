<script lang="ts">
  import { Splitpanes } from "svelte-splitpanes";

  export let axis: "vertical" | "horizontal" = "vertical";
</script>

<Splitpanes horizontal={axis === "horizontal"}>
  <slot />
</Splitpanes>

<style lang="postcss">
  :global(.splitpanes) {
    & :global(.splitpanes__pane) {
      background: none !important;
    }
    & :global(.splitpanes__splitter) {
      background: var(--color-selection12) !important;
      border: none !important;
      &::after {
        content: none;
        display: none;
      }
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        height: 25px !important;
        transform: translate(-50%, -50%) !important;
        width: 2px !important;
        margin: 0 !important;
        border-radius: 2px;
        background: var(--color-selection) !important;
      }
    }
    &
      :global(.splitpanes--horizontal)
      > :global(.splitpanes__splitter)::before {
      height: 2px !important;
      width: 25px !important;
    }
  }
</style>

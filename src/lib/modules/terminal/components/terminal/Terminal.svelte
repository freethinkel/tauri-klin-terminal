<script lang="ts">
  import { Terminal } from "xterm";
  import "xterm/css/xterm.css";
  import { createEventDispatcher, onMount } from "svelte";

  export let terminal: Terminal;

  let terminalEl: HTMLDivElement;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    terminal.open(terminalEl);
    terminal.onTitleChange((title) => {
      dispatch("change_title", title);
    });
  });
</script>

<div class="wrapper">
  <div class="terminal" bind:this={terminalEl} />
</div>

<style>
  .wrapper,
  .terminal,
  :global(.terminal) {
    height: 100%;
    width: 100%;
  }
</style>

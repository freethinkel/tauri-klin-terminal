<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let checked = false;

  const dispatch = createEventDispatcher();

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    dispatch("change", target.checked);
    target.checked = checked;
  };
</script>

<label>
  <input
    class="visually-hidden"
    type="checkbox"
    {checked}
    on:change={onChange}
  />
  <div class="toggle">
    <div class="toggle__circle" />
  </div>

  <div class="children">
    <slot />
  </div>
</label>

<style>
  label {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .toggle {
    --size: 24px;
    --border-size: 2px;
    --width: 1.7;
    height: var(--size);
    width: calc(var(--size) * var(--width));
    background: var(--color-selection12);
    border: var(--border-size) solid var(--color-selection24);
    border-radius: 10em;
    position: relative;
    cursor: pointer;
  }
  .toggle__circle:active {
    width: calc(var(--size) * 1.2 - var(--border-size) * 2);
  }
  .toggle__circle {
    height: calc(var(--size) - var(--border-size) * 2);
    width: calc(var(--size) - var(--border-size) * 2);
    background: var(--color-terminal-foreground);
    border: 1px solid var(--color-selection12);
    border-radius: 10em;
    position: absolute;
    left: 0;
    top: 0;
    transition: var(--transition);
    box-shadow: var(--shadow1);
  }
  input:checked + .toggle .toggle__circle {
    transform: translateX(calc(var(--size) * var(--width) - var(--size)));
  }
  input:checked + .toggle .toggle__circle:active {
    transition: 0.1s transform, 0s width;
    transform: translateX(calc(var(--size) * var(--width) - var(--size) * 1.2));
  }
  input:checked + .toggle {
    background: var(--color-accent80);
  }
</style>

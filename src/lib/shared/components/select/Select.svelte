<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Icon } from "../icon";

  type Option = {
    label: string;
    value: string | number;
  };
  export let value = "";
  export let options: Option[] = [];

  const dispatch = createEventDispatcher();

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    dispatch("change", target.value);
    target.value = value;
  };
</script>

<label>
  <select class="raw-select" {value} on:change={handleChange}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  <div class="icon">
    <Icon name="selector" />
  </div>
</label>

<style lang="postcss">
  label {
    display: inline-flex;
    position: relative;
    width: auto;
    background: var(--color-selection12);
    border-radius: var(--border-radius);
  }
  .raw-select {
    font-size: 1rem;
    appearance: none;
    background: none;
    border: none;
    height: 26px;
    font-size: 1rem;
    padding-right: 24px;
    padding-left: 6px;
  }
  .icon {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding-right: 4px;
    display: flex;
    align-items: center;
    pointer-events: none;
    --size: 16px;
  }
</style>

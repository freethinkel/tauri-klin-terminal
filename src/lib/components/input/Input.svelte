<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label = "";
  export let placeholder = "";
  export let value = "";
  export let type = "text";

  const dispatch = createEventDispatcher();

  const onChange = (e: Event) => {
    const el = e.target as HTMLInputElement;
    const newValue = type === "range" ? String(+el.value / 100) : el.value;
    dispatch("change", newValue);
    value = newValue;
  };
</script>

<label>
  {#if label}
    <div class="label">{label}</div>
  {/if}
  {#if type === "range"}
    <input
      {type}
      min="0"
      max="100"
      class="input"
      on:input={onChange}
      value={+value * 100}
    />
  {:else}
    <input {type} {placeholder} class="input" on:input={onChange} {value} />
  {/if}
</label>

<style>
  label {
    display: flex;
    flex-direction: column;
  }
  input {
    appearance: none;
    border: 1px solid var(--color-selection12);
    background: var(--color-selection12);
    border-radius: var(--border-radius);
    outline: none;
    padding: 5px 4px;
    font-size: 1rem;
    transition: var(--transition);
  }
  input:focus {
    border: 1px solid var(--color-selection24);
  }

  .label {
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--color-text-pale);
  }
</style>

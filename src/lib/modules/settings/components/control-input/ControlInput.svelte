<script lang="ts">
  import { Button } from "@/shared/components/button";
  import { Icon } from "@/shared/components/icon";
  import { createEventDispatcher } from "svelte";

  export let title = "";
  export let description = "";
  export let type: "text" | "number" = "text";
  export let placeholder = "";
  export let value = "";
  export let step = 0.1;
  export let min = 0;
  export let max = 1;

  const dispatch = createEventDispatcher();

  const handleChange = (event: Event) => {
    const el = event.target as HTMLInputElement;
    dispatch("change", el.value);
    if (type === "number") {
      dispatch("change", Math.max(Math.min(Number(el.value), max), min));
    } else {
      dispatch("change", el.value);
    }

    el.value = value;
  };

  let isFocused = false;
</script>

<div class="wrapper control">
  <div class="content">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
  </div>
  <div class="input__wrapper" class:focused={isFocused}>
    <input
      {type}
      {placeholder}
      {value}
      on:blur={(event) => {
        handleChange(event);
        isFocused = false;
      }}
      on:focus={() => (isFocused = true)}
    />
    {#if type === "number"}
      <Button
        on:click={() =>
          dispatch(
            "change",
            Math.max(Math.min(Number(value) - step, max), min)
          )}
      >
        <Icon name="minus" />
      </Button>
      <Button
        on:click={() =>
          dispatch(
            "change",
            Math.max(Math.min(Number(value) + step, max), min)
          )}
      >
        <Icon name="plus" />
      </Button>
    {/if}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    display: flex;
  }
  .content {
    flex: 1;
    min-width: 0;
  }
  .title {
    font-size: 1.1rem;
  }
  input {
    appearance: none;
    font-size: 1rem;
    background: none;
    border: none;
    outline: none;
    padding: 0 3px;
    height: 24px;
    width: 150px;
    &[type="number"] {
      width: 80px;
      border-right: 1px solid var(--color-selection12);
    }

    &::-webkit-inner-spin-button {
      display: none;
    }
  }

  .input__wrapper {
    display: flex;
    border: 1px solid var(--color-selection12);
    border-radius: var(--border-radius);
    overflow: hidden;

    &.focused {
      box-shadow: 0 0 0 2px var(--color-selection12);
    }

    & :global(button) {
      --size: 16px;
      border-radius: 0;
    }
  }
</style>

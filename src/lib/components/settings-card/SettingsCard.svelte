<script lang="ts">
  export let title = "";
</script>

<div class="wrapper">
  <div class="title">{title}</div>
  <div class="card">
    <slot />
  </div>
</div>

<style lang="postcss">
  .wrapper {
    & + :global(&) {
      margin-top: 18px;
    }
  }
  .title {
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 0.9rem;
  }
  .card {
    background: var(--color-selection12);
    border-radius: calc(var(--border-radius) * 2);
    border: 1px solid var(--color-selection12);
    overflow: hidden;

    & > :global(.control) {
      height: 48px;
      display: flex;
      align-items: center;
      padding: 0 8px;

      &:not(:last-of-type) {
        border-bottom: 1px solid var(--color-selection12);
      }
    }
  }
</style>

<script lang="ts">
  export let name: string;
</script>

<span class="icon ti ti-{name}" />

<style>
  .icon {
    font-size: var(--size, 24px);
    color: var(--color, inherit);
  }
</style>

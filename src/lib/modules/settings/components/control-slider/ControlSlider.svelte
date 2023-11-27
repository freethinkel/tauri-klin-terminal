<script lang="ts">
  import { RangeSlider } from "@/shared/components/range-slider";
  import { createEventDispatcher } from "svelte";

  export let title = "";
  export let description = "";
  export let value = 0.5;
  export let showValue: string | undefined;

  const dispatch = createEventDispatcher();
</script>

<div class="wrapper control">
  <div class="content">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
  </div>
  <div class="slider__wrapper">
    <div class="slider">
      <RangeSlider
        {value}
        on:change={({ detail }) => dispatch("change", detail)}
      />
    </div>
    <div class="value">{showValue ?? value}</div>
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
  .slider {
    flex: 1;
    min-width: 0;
    margin-bottom: -15px;

    &__wrapper {
      width: 150px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  .value {
    min-width: 30px;
    text-align: right;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: number;
  export let label = "";

  let _currentValue = value;
  let isDragging = false;
  let sliderEl: HTMLDivElement;

  const dispatch = createEventDispatcher();

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseUp = () => {
    isDragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseMove);
    _currentValue = value;
  };
  const onMouseMove = (event: MouseEvent) => {
    const x = event.clientX;
    const { left, width } = sliderEl.getBoundingClientRect();
    _currentValue = Math.min(Math.max((x - left) / width, 0), 1);

    dispatch("change", _currentValue);
  };
</script>

<div class="wrapper" style:--value={_currentValue}>
  <div class="label">{label}</div>

  <div class="slider" bind:this={sliderEl}>
    <div class="line" />
    <div class="circle__track">
      <button type="button" class="circle" on:pointerdown={onMouseDown} />
    </div>
  </div>
</div>

<style>
  .wrapper {
    --size: 24px;
    height: 38px;
  }
  .label {
    font-size: 0.7rem;
    font-weight: 800;
  }
  .slider {
    position: relative;
  }
  .line {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(var(--size) / 2 - 2px);
    height: 3px;
    background: var(--color-selection12);
    border-radius: 10em;
  }
  .line::before {
    content: "";
    position: absolute;
    left: 0;
    height: 3px;
    top: 0;
    width: calc(var(--value) * 100%);
    background: var(--color-accent);
    border-radius: 10em;
  }
  .circle {
    width: var(--size);
    height: var(--size);
    appearance: none;
    border: 1px solid var(--color-primary12);
    background: var(--color-selection);
    border-radius: 10em;
    position: absolute;
    left: calc(var(--value) * 100%);
    transform: translateX(-50%);
    transition: var(--transition) transform;
  }
  .circle:hover {
    transform: translateX(-50%) scale(1.1);
  }
  .circle__track {
    position: absolute;
    left: calc(var(--size) / 2);
    right: calc(var(--size) / 2);
  }
</style>

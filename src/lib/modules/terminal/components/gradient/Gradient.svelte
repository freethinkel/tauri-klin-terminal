<div class="wrapper" />
<div class="noise" />

<style lang="postcss">
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    background-image: linear-gradient(
      -30deg,
      var(--color-gradient-start),
      var(--color-gradient-end)
    );
    background-repeat: repeat;
  }

  .noise {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: url("/assets/images/noise.svg");
    background-size: 400px;
    opacity: 0.5;
    z-index: 0;
    mix-blend-mode: soft-light;
  }
</style>

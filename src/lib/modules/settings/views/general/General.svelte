<script lang="ts">
  import { Input } from "@/shared/components/input";
</script>

<div class="form-field">
  <Input label="Font family" placeholder="Enter font family" />
  <Input label="Font size" placeholder="Enter font size" />
</div>
<div class="form-field">
  <Input label="Font family" placeholder="Enter font family" />
  <Input label="Font size" placeholder="Enter font size" />
</div>
<Input label="Opacity" type="range" />

<style>
  .form-field {
    display: flex;
    width: 100%;
    gap: 6px;
  }
  .form-field + .form-field {
    margin-top: 10px;
  }
  .form-field > :global(*) {
    flex: 1;
  }
</style>

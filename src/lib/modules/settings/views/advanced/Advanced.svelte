<script>
  import { Toggle } from "@/shared/components/toggle";
  import { settings$ } from "../../store";

  const isAutohide = settings$.isAutoHideToolbar;
</script>

<Toggle
  checked={$isAutohide}
  on:change={({ detail }) =>
    settings$.handleChange("isAutoHideToolbar")(detail)}
>
  Auto hide toolbar
</Toggle>

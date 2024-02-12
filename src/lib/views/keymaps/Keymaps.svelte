<script>
  import { Select } from "@/components/select";
  import { ShortcutRecorder } from "@/components/shortcut-recorder";
  import { Input } from "@/components/input";
  import { Icon } from "@/components/icon";
  import { Button } from "@/components/button";
  import { MappingType } from "@/types";
  import { keymapsStore } from "@/stores/keymaps";
  import { AVAILABLE_ACTIONS } from "@/stores/keymaps/keymaps.constants";

  const TYPES = [
    {
      label: "Internal action",
      value: MappingType.internal,
    },
    {
      label: "Send chars",
      value: MappingType.sendChars,
    },
  ];
  const mappings = keymapsStore.mappings$;
</script>

<div class="wrapper">
  <div class="toolbar">
    <Button on:click={() => keymapsStore.addEmptyMapping()}>
      <Icon name="plus" />
      Add new mapping
    </Button>
  </div>
  <div class="table__wrapper">
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Action</th>
          <th>Shortcut</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {#each $mappings as mapping}
          <tr>
            <td>
              <Select
                options={TYPES}
                value={mapping.type}
                on:change={({ detail }) =>
                  keymapsStore.changeType({ mapping, payload: detail })}
              />
            </td>
            <td class="action-col">
              {#if mapping.type === MappingType.sendChars}
                <Input
                  placeholder="Escape chars"
                  value={mapping.chars}
                  on:change={({ detail }) =>
                    keymapsStore.changeSendChars({ mapping, payload: detail })}
                />
              {:else if mapping.type === MappingType.internal}
                <Select
                  value={mapping?.action?.type}
                  on:change={({ detail }) =>
                    keymapsStore.changeAction({
                      mapping,
                      payload: AVAILABLE_ACTIONS[detail],
                    })}
                  options={Object.values(AVAILABLE_ACTIONS).map((action) => ({
                    value: action.type,
                    label: action.label,
                  }))}
                />
              {/if}
            </td>
            <td class="shortcut-recorder-col">
              <ShortcutRecorder
                keys={mapping.shortcut}
                on:record={({ detail }) =>
                  keymapsStore.changeShortcut({ mapping, payload: detail })}
              />
            </td>
            <td class="controls-col">
              <Button on:click={() => keymapsStore.deleteMapping(mapping)}>
                <Icon name="trash" />
              </Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="postcss">
  .toolbar {
    padding-bottom: 12px;

    & :global(button) {
      --size: 16px;
      gap: 6px;
    }
  }
  .table__wrapper {
    border: 1px solid var(--color-selection12);
    overflow: hidden;
    border-radius: var(--border-radius);
  }
  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;

    & thead {
      background: var(--color-selection12);
      & th {
        opacity: 0.8;
      }
    }

    & tbody tr {
      border-top: 1px solid var(--color-selection12);
    }

    th,
    td {
      padding: 0 6px;
      height: 36px;
      &:last-of-type {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: right;
      }
    }
  }
  .controls-col {
    & :global(button) {
      cursor: pointer;
      --size: 16px;
    }
  }

  .action-col {
    & :global(input) {
      width: 115px;
    }
  }
</style>

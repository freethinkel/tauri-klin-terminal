<script>
  import { Select } from "@/shared/components/select";
  import { ShortcutRecorder } from "@/shared/components/shortcut-recorder";
  import { MappingType } from "../../store/types/keymaps";
  import { Input } from "@/shared/components/input";
  import { AVAILABLE_ACTIONS } from "../../store/constants/keymaps";
  import { Icon } from "@/shared/components/icon";
  import { Button } from "@/shared/components/button";
  import {
    addEmptyMapping,
    changeAction,
    changeSendChars,
    changeShortcut,
    changeType,
    deleteMapping,
    mappings$,
  } from "../../store/keymaps";

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
</script>

<div class="wrapper">
  <div class="toolbar">
    <Button on:click={() => addEmptyMapping()}>
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
        {#each $mappings$ as mapping}
          <tr>
            <td>
              <Select
                options={TYPES}
                value={mapping.type}
                on:change={({ detail }) =>
                  changeType({ mapping, payload: detail })}
              />
            </td>
            <td class="action-col">
              {#if mapping.type === MappingType.sendChars}
                <Input
                  placeholder="Escape chars"
                  on:change={({ detail }) =>
                    changeSendChars({ mapping, payload: detail })}
                />
              {:else if mapping.type === MappingType.internal}
                <Select
                  value={mapping?.action?.type}
                  on:change={({ detail }) =>
                    changeAction({
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
                  changeShortcut({ mapping, payload: detail })}
              />
            </td>
            <td class="controls-col">
              <Button on:click={() => deleteMapping(mapping)}>
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

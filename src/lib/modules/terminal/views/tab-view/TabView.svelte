<script lang="ts">
  import SplitPane from "@/shared/components/split-pane/SplitPane.svelte";
  import { Terminal } from "../../components/terminal";
  import { TerminalContextMenu } from "../../components/terminal-context-menu";
  import type { TerminalTab } from "../../store/types";
  import Pane from "@/shared/components/split-pane/Pane.svelte";
  import { setTitle } from "../../store";

  export let tab: TerminalTab;
</script>

<TerminalContextMenu>
  <SplitPane>
    <!-- <Pane> -->
    <!--   <SplitPane axis="horizontal"> -->
    <!--     <Pane> -->
    <!--       <div> -->
    <!--         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere, -->
    <!--         neque. -->
    <!--       </div> -->
    <!--     </Pane> -->
    <!--     <Pane> -->
    <!--       <div> -->
    <!--         Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, -->
    <!--         dignissimos inventore consequatur officia temporibus tempora culpa -->
    <!--         quas eum obcaecati vel? -->
    <!--       </div> -->
    <!--     </Pane> -->
    <!--   </SplitPane> -->
    <!-- </Pane> -->
    <Pane>
      <Terminal
        terminal={tab.terminalController.terminal}
        on:change_title={({ detail }) =>
          setTitle({ tabId: tab.id, title: detail })}
      />
    </Pane>
  </SplitPane>
</TerminalContextMenu>

<script lang="ts">
  import { DICT } from "../lib/game.ts";

  let { onClose }: { onClose: () => void } = $props();

  let filter = $state("");

  const filtered = $derived(
    filter.length === 0
      ? DICT
      : DICT.filter((word) => word.includes(filter.toUpperCase())),
  );
</script>

<div
  class="overlay"
  role="presentation"
  onclick={onClose}
  onkeydown={(event) => {
    if (event.key === "Escape") onClose();
  }}
>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(event) => event.stopPropagation()}
    onkeydown={(event) => {
      if (event.key === "Escape") onClose();
    }}
  >
    <h2>Dictionary</h2>
    <input
      type="text"
      maxlength="4"
      placeholder="Filter..."
      bind:value={filter}
    />
    <div class="words">
      {#each filtered as word (word)}
        <span class="word">{word}</span>
      {/each}
    </div>
    <div class="footer">
      <span>{filtered.length} words</span>
      <button onclick={onClose}>Close</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 16px;
    box-sizing: border-box;
  }

  .modal {
    background-color: #2c2c2c;
    border: 1px solid #fff4;
    border-radius: 12px;
    padding: 24px;
    min-width: 280px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .modal h2 {
    margin: 0 0 12px 0;
  }

  .modal input {
    appearance: none;
    font-family: JetBrainsMono;
    background-color: transparent;
    border: 1px solid #fff4;
    border-radius: 8px;
    color: white;
    text-transform: uppercase;
    padding: 8px;
    margin-bottom: 12px;
    outline: none;
  }

  .modal input:focus {
    border-color: #fff8;
  }

  .words {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    align-content: flex-start;
  }

  .word {
    padding: 4px 6px;
    background-color: #444;
    border-radius: 4px;
    border: 1px solid #fff3;
    font-size: 0.8rem;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 0.8rem;
    opacity: 0.7;
  }
</style>

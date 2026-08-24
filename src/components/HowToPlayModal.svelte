<script lang="ts">
  let { onClose }: { onClose: () => void } = $props();
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
    <h2>How to play</h2>
    <ol>
      <li>
        You start on a <b>start word</b> and must reach the <b>target word</b>.
      </li>
      <li>Each step must be a word in the <b>dictionary</b>.</li>
      <li>
        Each step must differ from the previous word by <b
          >exactly one letter</b
        >.
      </li>
      <li>
        You can also <b>reverse</b> the previous word, as long as it forms a valid
        word.
      </li>
      <li>
        Reach the target word to win. Try to do it in <b
          >as few steps as possible</b
        >.
      </li>
    </ol>
    <button onclick={onClose}>Close</button>
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
    text-align: center;
  }

  .modal h2 {
    margin: 0 0 12px 0;
  }

  .modal ol {
    text-align: left;
    margin: 0 0 16px 0;
    padding-left: 20px;
    font-family: sans-serif;
    text-transform: none;
  }

  .modal li {
    margin-bottom: 8px;
  }
</style>

<script lang="ts">
  let {
    guesses,
    minGuesses,
    path,
    onClose,
  }: {
    guesses: number;
    minGuesses: number | null;
    path: string[] | null;
    onClose: () => void;
  } = $props();
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
    <h2>You win!</h2>
    <p>
      Solved in {guesses} guesses.
      {#if minGuesses !== null}
        The minimum was <b>{minGuesses}</b>.
      {:else}
        No minimum path found.
      {/if}
    </p>
    {#if path !== null && path.length > 0}
      <details class="solution">
        <summary>Best solution</summary>
        <ol start="0">
          {#each path as word}
            <li>{word}</li>
          {/each}
        </ol>
      </details>
    {/if}
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
    text-align: center;
  }

  .modal h2 {
    margin: 0 0 12px 0;
  }

  .modal p {
    margin: 0 0 16px 0;
  }

  .solution {
    text-align: left;
    margin: 0 0 16px 0;
    padding: 8px;
    background-color: #ffffff0a;
    border: 1px solid #fff2;
    border-radius: 8px;
  }

  .solution summary {
    cursor: pointer;
    font-weight: 700;
    text-align: center;
  }

  .solution ol {
    margin: 8px 0 0 0;
    padding-left: 24px;
  }

  .solution li {
    font-size: 0.9rem;
    padding: 2px 0;
  }
</style>

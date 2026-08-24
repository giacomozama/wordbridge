<script lang="ts">
  let {
    steps,
    targetWord,
    onGoBack,
  }: {
    steps: string[];
    targetWord: string;
    onGoBack: (index: number) => void;
  } = $props();
</script>

<div class="steps-container">
  {#each [...steps].reverse() as step, ri}
    {@const i = steps.length - 1 - ri}
    <div>
      <div>
        {#if i > 0}<span class="step-number">{i}</span>{/if}
      </div>
      <div>
        {#each [0, 1, 2, 3] as i}
          <span
            class={step.charAt(i) === targetWord.charAt(i) ? "correct" : ""}
            >{step.charAt(i)}</span
          >
        {/each}
      </div>
      <div>
        {#if i > 0}
          <button
            class="go-back"
            onclick={(event) => {
              onGoBack(i);
              event.currentTarget.blur();
            }}
            title="Undo up to this step">↺</button
          >
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .steps-container {
    border-radius: 8px;
    border: 1px solid #fff4;
    flex: 1;
    min-height: 0;
    overflow: auto;
    background-color: #1c1c1c;
  }

  .steps-container > div {
    display: flex;
    overflow: auto;
  }

  .steps-container > div > div {
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 1.4rem;
    flex: 1;
    justify-content: center;
  }

  .steps-container > div > div:last-child {
    justify-content: end;
  }

  .steps-container > div:nth-child(2n) {
    background-color: #ffffff04;
  }

  .steps-container > div:nth-child(2n + 1) {
    background-color: #ffffff08;
  }

  .steps-container > div > div > span {
    padding: 8px;
    background-color: #444;
    border-radius: 4px;
    border: 1px solid #fff3;
  }

  .step-number {
    background: none !important;
    border: none !important;
    font-size: 0.9rem;
    opacity: 0.6;
    padding: 0 !important;
    margin-right: auto;
  }

  .steps-container > div > div > span.correct {
    background-color: green;
    border: 1px solid #fff3;
  }

  .go-back {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 1.6rem;
    padding: 0 6px;
    border-radius: 4px;
  }

  @media (hover: hover) {
    .go-back:hover {
      color: white;
      background-color: #ffffff2a;
    }
  }
</style>

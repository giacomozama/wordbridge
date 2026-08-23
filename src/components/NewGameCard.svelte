<script lang="ts">
  export type Difficulty = "easy" | "medium" | "hard";

  let {
    difficulty,
    onDifficultyChange,
    onNewGame,
  }: {
    difficulty: Difficulty;
    onDifficultyChange: (newDifficulty: Difficulty) => void;
    onNewGame: () => void;
  } = $props();
</script>

<div class="new-game-card">
  <div class="difficulty-btn-row">
    <button
      class="difficulty-btn easy"
      class:selected={difficulty === "easy"}
      onclick={() => onDifficultyChange("easy")}
    >
      Easy
    </button>
    <button
      class="difficulty-btn medium"
      class:selected={difficulty === "medium"}
      onclick={() => onDifficultyChange("medium")}
    >
      Medium
    </button>
    <button
      class="difficulty-btn hard"
      class:selected={difficulty === "hard"}
      onclick={() => onDifficultyChange("hard")}
    >
      Hard
    </button>
  </div>
  <button onclick={onNewGame}>New game</button>
</div>

<style>
  .new-game-card {
    display: flex;
    flex-direction: column;
  }

  .difficulty-btn-row {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 8px;
    position: relative;
  }

  .difficulty-btn-row::before {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    content: "";
    border-radius: 8px;
    border: 1px solid #fff2;
    z-index: 10;
    pointer-events: none;
  }

  .difficulty-btn-row button {
    appearance: none;
    border: none;
    color: white;
    font-family: JetBrainsMono;
    text-transform: uppercase;
    border-radius: 0;
    padding: 8px;
    flex: 1;
  }

  .difficulty-btn-row .easy {
    background-color: green;
  }

  .difficulty-btn-row .medium {
    background-color: orange;
  }

  .difficulty-btn-row .hard {
    background-color: firebrick;
  }

  .difficulty-btn {
    transition: all 0.2s ease;
  }

  .difficulty-btn.selected {
    cursor: default;
  }

  .difficulty-btn:not(.selected) {
    opacity: 0.8;
    color: #fff6;
  }

  .difficulty-btn:not(.selected):hover {
    opacity: 0.9;
    color: #fffa;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import {
    DICT,
    DICT_SET,
    isNeighbor,
    loadPairsFromUrl,
    minimumGuesses,
    bestPath,
  } from "./lib/game.ts";
  import NewGameCard, {
    type Difficulty,
  } from "./components/NewGameCard.svelte";
  import WordInfoCard from "./components/WordInfoCard.svelte";
  import GuessPrompt from "./components/GuessPrompt.svelte";
  import GuessesContainer from "./components/GuessesContainer.svelte";
  import WinModal from "./components/WinModal.svelte";
  import HowToPlayModal from "./components/HowToPlayModal.svelte";
  import DictionaryModal from "./components/DictionaryModal.svelte";

  let difficulty = $state<Difficulty>("medium");
  let startWord = $state("____");
  let targetWord = $state("____");
  let guesses = $state<string[]>([]);
  let prompt = $state("");
  let label = $state("Enter a word");
  let labelError = $state(false);
  let showWinModal = $state(false);
  let winGuesses = $state(0);
  let winMinGuesses = $state<number | null>(null);
  let winPath = $state<string[] | null>(null);
  let showHowToPlay = $state(false);
  let showDictionary = $state(false);
  let guessPrompt = $state<{
    focus: () => void;
    focusFirst: () => void;
    focusLastFilled: (length: number) => void;
  } | null>(null);

  const STORAGE_KEY = "wordbridge-game-v1";
  const HOW_TO_PLAY_SEEN_KEY = "wordbridge-how-to-play-seen";

  function saveGame() {
    const state = {
      difficulty,
      startWord,
      targetWord,
      guesses,
      prompt,
      winGuesses,
      winMinGuesses,
      winPath,
      showWinModal,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function restoreGame(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      if (
        typeof data !== "object" ||
        data === null ||
        typeof data.startWord !== "string" ||
        typeof data.targetWord !== "string" ||
        !Array.isArray(data.guesses) ||
        data.guesses.length === 0
      ) {
        return false;
      }
      if (
        data.difficulty === "easy" ||
        data.difficulty === "medium" ||
        data.difficulty === "hard"
      ) {
        difficulty = data.difficulty;
      }
      startWord = data.startWord;
      targetWord = data.targetWord;
      guesses = data.guesses;
      prompt =
        typeof data.prompt === "string" ? data.prompt.replace(/[^a-zA-Z]/g, "") : "";
      winGuesses = typeof data.winGuesses === "number" ? data.winGuesses : 0;
      winMinGuesses =
        typeof data.winMinGuesses === "number" ? data.winMinGuesses : null;
      winPath = Array.isArray(data.winPath)
        ? data.winPath.filter((w: unknown) => typeof w === "string")
        : null;
      showWinModal = data.showWinModal === true;
      return true;
    } catch {
      return false;
    }
  }

  $effect(() => {
    if (startWord !== "____" && guesses.length > 0) {
      saveGame();
    }
  });

  function closeHowToPlay() {
    showHowToPlay = false;
    localStorage.setItem(HOW_TO_PLAY_SEEN_KEY, "1");
  }

  function newGame() {
    let targetDist = 5;
    switch (difficulty) {
      case "easy":
        targetDist = Math.floor(Math.random() * 2) + 4;
        break;
      case "medium":
        targetDist = Math.floor(Math.random() * 3) + 6;
        break;
      default:
        targetDist = Math.floor(Math.random() * 2) + 9;
        break;
    }

    loadPairsFromUrl(
      import.meta.env.BASE_URL + "pairs_" + targetDist + ".bin",
    ).then((pairs) => {
      const chosen = pairs[Math.floor(pairs.length * Math.random())];
      const startIndex = chosen[0];
      const endIndex = chosen[1];

      startWord = DICT[startIndex];
      targetWord = DICT[endIndex];
      guesses = [startWord];
      label = "Enter a word";
      labelError = false;
      prompt = "";
      showWinModal = false;
      winGuesses = 0;
      winMinGuesses = null;
      winPath = null;
      guessPrompt?.focusFirst();
    });
  }

  function validateGuess(guess: string): boolean {
    label = "Enter a word";
    labelError = false;
    if (guess.length !== 4) {
      label = "Words are exactly 4 letters long";
      labelError = true;
      return false;
    }
    if (!DICT_SET.has(guess)) {
      label = "Not in the dictionary";
      labelError = true;
      return false;
    }
    if (guesses.includes(guess)) {
      label = "You already guessed that word";
      labelError = true;
      return false;
    }
    const prev = guesses[guesses.length - 1];
    if (!isNeighbor(prev, guess)) {
      label = "Change exactly one letter (or reverse the previous word)";
      labelError = true;
      return false;
    }
    return true;
  }

  function submitGuess(): boolean {
    const guess = prompt.toUpperCase();
    if (!validateGuess(guess)) {
      guessPrompt?.focusLastFilled(guess.length);
      return false;
    }
    guesses = [...guesses, guess];
    prompt = "";
    if (guess === targetWord) {
      winGuesses = guesses.length - 1;
      const min = minimumGuesses(startWord, targetWord);
      winMinGuesses = min === null ? null : min - 1;
      winPath = bestPath(startWord, targetWord);
      showWinModal = true;
    }
    return true;
  }

  function undoLast() {
    if (guesses.length <= 1) return;
    prompt = guesses[guesses.length - 1];
    guesses = guesses.slice(0, -1);
    label = "Enter a word";
    labelError = false;
  }

  function goBackTo(index: number) {
    if (index <= 0 || index >= guesses.length) return;
    prompt = guesses[index];
    guesses = guesses.slice(0, index);
    label = "Enter a word";
    labelError = false;
    guessPrompt?.focus();
  }

  function setDifficulty(newDifficulty: Difficulty) {
    difficulty = newDifficulty;
  }

  onMount(() => {
    if (!restoreGame()) {
      newGame();
    }
    if (!localStorage.getItem(HOW_TO_PLAY_SEEN_KEY)) {
      showHowToPlay = true;
    }
  });
</script>

<main>
  <div class="top-buttons">
    <button onclick={() => (showHowToPlay = true)}>How to play</button>
    <button onclick={() => (showDictionary = true)}>Dictionary</button>
  </div>

  <WordInfoCard {startWord} {targetWord} />

  <GuessPrompt
    bind:this={guessPrompt}
    bind:value={prompt}
    {label}
    error={labelError}
    onEnter={submitGuess}
    onUndo={undoLast}
  />

  <GuessesContainer {guesses} {targetWord} onGoBack={goBackTo} />
  
  <div class="new-game-divider">
    <NewGameCard
      {difficulty}
      onDifficultyChange={setDifficulty}
      onNewGame={newGame}
    />
  </div>
</main>

<style>
  .top-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    position: relative;
  }

  .top-buttons::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background-color: #fff2;
  }

  .top-buttons button {
    flex: 1;
  }

  .new-game-divider {
    position: relative;
    margin-top: 16px;
    padding-top: 16px;
  }

  .new-game-divider::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background-color: #fff2;
  }
</style>

{#if showWinModal}
  <WinModal
    guesses={winGuesses}
    minGuesses={winMinGuesses}
    path={winPath}
    onClose={() => (showWinModal = false)}
  />
{/if}

{#if showHowToPlay}
  <HowToPlayModal onClose={closeHowToPlay} />
{/if}

{#if showDictionary}
  <DictionaryModal onClose={() => (showDictionary = false)} />
{/if}

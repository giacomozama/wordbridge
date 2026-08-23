<script lang="ts">
  import { onMount } from "svelte";

  let {
    label = "Enter a word",
    error = false,
    value = $bindable(),
    onEnter,
    onUndo,
  }: {
    label?: string;
    error?: boolean;
    value?: string;
    onEnter?: () => boolean;
    onUndo?: () => void;
  } = $props();

  const LENGTH = 4;
  let inputs = $state<HTMLInputElement[]>([]);

  function sanitize(char: string): string {
    return char.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1);
  }

  function setChar(index: number, char: string) {
    const chars = (value ?? "").split("");
    while (chars.length < LENGTH) chars.push("");
    chars[index] = char;
    value = chars.join("").slice(0, LENGTH);
  }

  function onInput(index: number, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const char = sanitize(input.value);
    input.value = char;
    setChar(index, char);
    if (char && index < LENGTH - 1) {
      requestAnimationFrame(() => inputs[index + 1]?.focus());
    }
  }

  function onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === "Backspace") {
      if (!inputs[index].value && index > 0) {
        event.preventDefault();
        const prev = inputs[index - 1];
        if (prev) {
          prev.value = "";
          setChar(index - 1, "");
          prev.focus();
        }
      }
    }
    if (event.key === "Enter") {
      const ok = onEnter?.() ?? false;
      if (ok) inputs[0]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputs[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      event.preventDefault();
      inputs[index + 1]?.focus();
    }
  }

  function onPaste(index: number, event: ClipboardEvent) {
    event.preventDefault();
    const text = (event.clipboardData?.getData("text") ?? "")
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase();
    if (!text) return;
    const chars = (value ?? "").split("");
    while (chars.length < LENGTH) chars.push("");
    for (let i = 0; i < LENGTH; i++) {
      chars[i] = text[i] ?? chars[i];
    }
    value = chars.join("").slice(0, LENGTH);
    for (let i = 0; i < LENGTH; i++) {
      const input = inputs[i];
      if (input) input.value = chars[i];
    }
    const target = Math.min(index + text.length, LENGTH - 1);
    inputs[target]?.focus();
  }

  function onWindowKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      onUndo?.();
      return;
    }
    const target = e.target as HTMLElement;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    )
      return;
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      inputs[0]?.focus();
    }
  }

  $effect(() => {
    const v = value ?? "";
    for (let i = 0; i < LENGTH; i++) {
      const input = inputs[i];
      if (input && input.value !== (v[i] ?? "")) {
        input.value = v[i] ?? "";
      }
    }
  });

  onMount(() => {
    window.addEventListener("keydown", onWindowKeydown);
    return () => window.removeEventListener("keydown", onWindowKeydown);
  });

  export function focus() {
    inputs[LENGTH - 1]?.focus();
  }

  export function focusFirst() {
    inputs[0]?.focus();
  }

  export function focusLastFilled(length: number) {
    const index = Math.max(0, Math.min(length - 1, LENGTH - 1));
    inputs[index]?.focus();
  }
</script>

<div class="guess-prompt">
  <div class="guess-prompt-label" class:error>
    {label}
  </div>
  <div class="guess-prompt-input-container">
    {#each Array(LENGTH) as _, index}
      <input
        type="text"
        maxlength="1"
        bind:this={inputs[index]}
        name="guess"
        inputmode="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="characters"
        spellcheck={false}
        oninput={(event) => onInput(index, event)}
        onkeydown={(event) => onKeydown(index, event)}
        onpaste={(event) => onPaste(index, event)}
      />
    {/each}
  </div>
</div>

<style>
  .guess-prompt {
    border-radius: 8px;
    border: 1px solid #fff4;
    margin-bottom: 8px;
    padding: 8px 8px 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .guess-prompt-input-container {
    display: flex;
    gap: 8px;
    position: relative;
  }

  .guess-prompt input {
    appearance: none;
    font-size: 2.5rem;
    font-family: JetBrainsMono;
    background-color: #fff1;
    border: 1px solid #fff4;
    border-radius: 8px;
    outline: none;
    color: white;
    text-transform: uppercase;
    text-align: center;
    width: 3rem;
    height: 3.75rem;
    padding: 0;
  }

  .guess-prompt input:focus {
    border-color: #fff;
    background-color: #fff2;
  }

  .guess-prompt-label {
    font-size: 0.75rem;
    font-weight: 800;
    opacity: 0.7;
    align-self: flex-start;
    margin-bottom: 8px;
  }

  .guess-prompt-label.error {
    color: #f44;
  }
</style>

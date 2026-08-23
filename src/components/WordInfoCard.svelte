<script lang="ts">
  let { startWord, targetWord }: { startWord: string; targetWord: string } =
    $props();
</script>

<div class="word-info-card">
  <div class="word-info-group">
    <div class="word-info-label">Start</div>
    <div class="word-info-word">{startWord}</div>
  </div>
  <div class="word-info-group">
    <div class="word-info-label">Target</div>
    <div class="word-info-word">{targetWord}</div>
  </div>
</div>

<style>
  .word-info-card {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .word-info-group {
    flex: 1;
    padding: 8px;
    border: 1px solid #fff4;
    border-radius: 8px;
  }

  .word-info-label {
    font-size: 0.75rem;
    font-weight: 800;
    opacity: 0.7;
  }
</style>

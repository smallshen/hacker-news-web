<svelte:options immutable={true} />

<script lang="ts">
    export let s: string
</script>

<div class="text body1">
    {@html s}
</div>

<style>
    .text {
        color: var(--gray12);
        display: flex;
        flex-direction: column;
        line-height: 1.8;
        gap: 1.2rem;
    }

    .text :global(pre) {
        overflow-x: auto;
    }

    .text :global(a) {
        overflow-wrap: anywhere;
    }
</style>

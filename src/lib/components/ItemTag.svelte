<script lang="ts">
    export let type: string
</script>

<div class="tag" data-type={type}>
    <p>{type}</p>
</div>

<style>
    .tag {
        text-transform: capitalize;
        margin-left: auto;
        padding: 0 8px;

        background: var(--gray4);
        color: var(--gray11);

        border-radius: 8px;
    }

    .tag[data-type="job"] {
        background: var(--tomato4);
        color: var(--tomato11);
    }

    .tag[data-type="story"],
    .tag[data-type="show"] {
        background: var(--blue4);
        color: var(--blue11);
    }

    .tag[data-type="ask"] {
        background: var(--green4);
        color: var(--green11);
    }
</style>

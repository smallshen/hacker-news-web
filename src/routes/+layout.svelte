<script lang="ts">
    import "./normalize.css"
    import "./baseStyle.css"
    import "./typography.css"

    import "./main-page-transition.css"

    import { preparePageTransition } from "$lib/page-transition"

    preparePageTransition()
</script>

<div class="big-body">
    <header>
        <a class="ico" href="/">
            <img
                src="https://news.ycombinator.com/y18.svg"
                width="18"
                height="18"
                style="border:1px white solid; display:block"
                alt="hacker news"
            />
            Hacker News
        </a>

        <ol>
            <li><a class="link" href="/show">show</a></li>
            <li><a class="link" href="/ask">ask</a></li>
            <li><a class="link" href="/jobs">jobs</a></li>
        </ol>
    </header>
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .big-body {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 8px;
        box-sizing: border-box;
    }

    header {
        background: var(--tomato9);
        margin-top: 4px;
        margin-bottom: 1rem;

        view-transition-name: header;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .content {
        width: 100%;
    }

    .ico {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.2em;
        color: white;
        text-decoration: none;
        font-weight: bolder;
        gap: 0.5rem;
    }

    ol {
        all: unset;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 1rem;
        padding-right: 1rem;
        gap: 0.5rem;
    }

    li {
        all: unset;
        display: block;
    }

    .link {
        all: unset;
        display: block;
        font-weight: normal;
        font-family: var(--font-regular);
        cursor: pointer;
    }

    .link:is(:active, :hover, :focus) {
        text-decoration: underline;
    }
</style>

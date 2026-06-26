<template>
    <div class="container-fluid">
        <header>
            <router-link to="/">
                <img class="main-logo" src="@assets/logo-white.svg" alt="31ngo" />
            </router-link>
        </header>
    </div>
</template>

<style lang="scss" scoped>
a {
    color: #fff;
    &:hover,
    &:focus {
        text-decoration: none;
    }
}

header {
    min-height: 3rem;
    display: flex;
    align-items: center;
}

.main-logo {
    max-width: 3.75rem;
    display: block;
}
</style>

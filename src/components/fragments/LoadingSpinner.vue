<template>
    <div class="loader" @transitionend.stop v-if="horizontal">
        <div class="loader__item loader__item--20"></div>
        <div class="loader__item loader__item--40"></div>
        <div class="loader__item loader__item--60"></div>
        <div class="loader__item loader__item--80"></div>
        <div class="loader__item loader__item--100"></div>
        <slot/>
    </div>
    <div class="loader" @transitionend.stop v-else>
        <div class="sk-circle">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
        </div>
        <slot/>
    </div>
</template>

<script>
    export default {
        props: {
            horizontal: Boolean,
        },
    };
</script>

<style rel="stylesheet/scss" lang="scss">
.loader {
    &__item {
        float: left;
        width: 16px;
        height: 16px;
        margin-right: 1px;
        background-color: var(--contao);
        animation: loading 1.4s infinite ease-in-out both;

        &--20 {
            animation-delay: -0.64s;
        }

        &--40 {
            animation-delay: -0.48s;
        }

        &--60 {
            animation-delay: -0.32s;
        }

        &--80 {
            animation-delay: -0.16s;
        }

        @keyframes loading {
            0%, 90%, 100% { opacity: 0; }
            20% { opacity: 1; }
        }
    }

    &__text {
        float: left;
        width: 40px;
    }
}

.sk-circle {
    width: 25px;
    height: 25px;
    position: relative;
}
.sk-circle .sk-child {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
.sk-circle .sk-child:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: var(--text);
    border-radius: 100%;
    animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
}
.sk-circle .sk-circle2 {
    transform: rotate(30deg); }
.sk-circle .sk-circle3 {
    transform: rotate(60deg); }
.sk-circle .sk-circle4 {
    transform: rotate(90deg); }
.sk-circle .sk-circle5 {
    transform: rotate(120deg); }
.sk-circle .sk-circle6 {
    transform: rotate(150deg); }
.sk-circle .sk-circle7 {
    transform: rotate(180deg); }
.sk-circle .sk-circle8 {
    transform: rotate(210deg); }
.sk-circle .sk-circle9 {
    transform: rotate(240deg); }
.sk-circle .sk-circle10 {
    transform: rotate(270deg); }
.sk-circle .sk-circle11 {
    transform: rotate(300deg); }
.sk-circle .sk-circle12 {
    transform: rotate(330deg); }
.sk-circle .sk-circle2:before {
    animation-delay: -1.1s; }
.sk-circle .sk-circle3:before {
    animation-delay: -1s; }
.sk-circle .sk-circle4:before {
    animation-delay: -0.9s; }
.sk-circle .sk-circle5:before {
    animation-delay: -0.8s; }
.sk-circle .sk-circle6:before {
    animation-delay: -0.7s; }
.sk-circle .sk-circle7:before {
    animation-delay: -0.6s; }
.sk-circle .sk-circle8:before {
    animation-delay: -0.5s; }
.sk-circle .sk-circle9:before {
    animation-delay: -0.4s; }
.sk-circle .sk-circle10:before {
    animation-delay: -0.3s; }
.sk-circle .sk-circle11:before {
    animation-delay: -0.2s; }
.sk-circle .sk-circle12:before {
    animation-delay: -0.1s; }

@keyframes sk-circleBounceDelay {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.widget-button {
    .loader {
        width: 25px;
        margin: 0 auto;
    }

    .sk-circle .sk-child:before {
        background-color: #fff;
    }
}
</style>

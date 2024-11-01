import { Comment, Fragment } from 'vue'

const isVnodeEmpty = (vnodes) => {
    return vnodes && vnodes.every((node) => {
        if (node.type === Comment) {
            return true
        }

        if (node.type === Text && typeof node.children === 'string' && !node.children.trim()) {
            return true
        }

        if (node.type === Fragment && isVnodeEmpty(node.children)) {
            return true
        }

        return false
    })
}

export default function (slot) {
    return !slot || isVnodeEmpty(slot())
}

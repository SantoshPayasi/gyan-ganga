import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
} from "@arcjet/next"
import { env } from "./env"


export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
}


export const Arcjet = arcjet({
    key: env.ARCJET_API_KEY as string,
    characteristics: [
        "fingerprint"
    ],

    // define base rules here, can also be empty if dont want to apply any base rules
    rules: [
        shield({
            mode: env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE"
        })
    ]

})
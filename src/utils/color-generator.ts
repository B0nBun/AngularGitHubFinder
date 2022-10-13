type Options<T extends object> = {
    [Property in keyof T] : T[Property] | undefined
}

interface HslColor {
    hue : number,
    saturation : number,
    lightness : number
}
export type { HslColor }

function generateColors(numberOfColors : number, options ?: Options<Omit<HslColor, 'hue'>>) : HslColor[] {
    const step = 360 / numberOfColors
    let lastHue = 0
    const colors = []
    for (let _ = 0; _ < numberOfColors; _ ++) {
        const hue = lastHue + step
        colors.push({
            hue,
            saturation : options?.saturation || 50,
            lightness : options?.lightness || 50
        })
        lastHue += step
    }
    return colors
}

export { generateColors }
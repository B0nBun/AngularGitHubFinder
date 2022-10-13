function zip<A, B>(as : A[], bs : B[]) : Array<readonly [A, B]> {
    const result : Array<readonly [A, B]> = []
    for (let i = 0; i < Math.min(as.length, bs.length); i ++) {
        result.push([as[i], bs[i]])
    }
    return result
}
export { zip }
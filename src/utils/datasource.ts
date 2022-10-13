const baseUrl = "https://api.github.com/"

const get = <T extends unknown>(relativeUrl : string) : Promise<T> => {
    const url = new URL(relativeUrl, baseUrl).href
    if ((window as any).debug) {
        console.debug(`get request to ${url}`)
    }
    
    return fetch(url, {
        headers : {
            Accept : 'application/vnd.github+json',
        }
    })
    .then(response => {
        if (response.statusText !== 'OK' && response.statusText !== '') {
            // Ошибка для того, чтобы от catch был смысл
            // (мне так семантически больше нравится)
            throw new Error(`The request failed with status ${response.status}`)
        }
        console.debug(`First then in 'get' function, response:`, response)
        return response
    })
    .then(response => response.json() as T)
}

type ApiData = {
    user : {
        login : string,
        avatar_url : string,
        html_url : string,
        name : string | null
    },
    languages : Record<string, number> | null,
    repositories : Array<{
        name : string,
        owner : string,
        html_url : string,
        description : string | null
    }>,
    readme : {
        content : string
    } | null
}
export type { ApiData }


const DataSource = {
    getUser : (username : string) =>
        get<ApiData['user']>(`/users/${username}`),
    getUsersRepositories : (username : string) =>
        get<ApiData['repositories']>(`/users/${username}/repos`),
    getRepositoryLanguages : (owner : string, repo : string) =>
        get<ApiData['languages']>(`/repos/${owner}/${repo}/languages`),
    getRepositoryReadme : (owner : string, repo : string) =>
        get<ApiData['readme']>(`/repos/${owner}/${repo}/readme`)
            .then(json => json?.content || null)
            .then(content => {
                if (content === null) return null
                // escape - устарел, но я не нашел другого способа получить нормальный текст (с кириллицей)
                // без написания 200 строк функций или без библиотек
                return decodeURIComponent(escape(window.atob(content)))
            })
}

export default DataSource
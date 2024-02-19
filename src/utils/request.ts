import instance from "./index";
const axiosQueue: {
    [param: string]: Promise<any>
} = {}
const axios = ({
    method,
    url,
    data,
    config
}) => {
    method = method.toLowerCase()
    if (method == 'post') {
        // console.log(axiosQueue, 'axiosQueue')
        if (!axiosQueue[url]) {
            axiosQueue[url] = instance.post(url, data, { ...config }).then(
                (res) => {
                    if (config && config.cacheTime > 0) {
                        axiosQueue[url] = new Promise((resolve) => {
                            resolve(res)
                        })
                        setTimeout(() => {
                            delete axiosQueue[url]
                        }, config.cacheTime)
                    } else {
                        delete axiosQueue[url]
                    }
                    return res
                },
                () => {
                    delete axiosQueue[url]
                }
            )
        }
        return (axiosQueue[url] as Promise<T>).then((res) => {
            return res;
        })
    } else if (method == 'get') {
        // console.log(axiosQueue, 'axiosQueue')
        if (!axiosQueue[url]) {
            axiosQueue[url] = instance.get(url, {
                params: data,
                ...config
            }).then(
                (res) => {
                    if (config && config.cacheTime > 0) {
                        axiosQueue[url] = new Promise((resolve) => {
                            resolve(res)
                        })
                        setTimeout(() => {
                            delete axiosQueue[url]
                        }, config.cacheTime)
                    } else {
                        delete axiosQueue[url]
                    }
                    return res
                },
                () => {
                    delete axiosQueue[url]
                }
            )
        }
        return (axiosQueue[url] as Promise<T>).then((res) => {
            return res;
        })
        // return instance.get(url, {
        //     params: data,
        //     ...config
        // })
    } else if (method == 'delete') {
        return instance.delete(url, {
            params: data,
            ...config
        })
    } else if (method == 'put') {
        return instance.put(url, data, { ...config })
    } else {
        console.log('未知的方法' + method)
        return false
    }
}
export default axios
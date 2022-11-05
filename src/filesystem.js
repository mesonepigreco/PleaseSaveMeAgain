
export class File {
    constructor(url, type = "json", onload_function = null) {
        this.ready = false;
        this.data = null;
        let request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = type;

        let self = this;
        request.onload = function() {
            self.data = request.response;
            self.ready = true;

            if (onload_function !== null) onload_function();
        };
        request.send();
    }

    is_ready() {
        return this.ready;
    }
}